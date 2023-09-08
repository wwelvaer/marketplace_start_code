const db = require("../models");
const Booking = db.Booking;
const Transaction = db.Transaction;
const Listing = db.Listing;
const Op = db.Sequelize.Op
const sequelize = db.sequelize;

/** get booking
 * expected Query param:
 * @param id bookingID 
 */
exports.getBooking = (req, res) => {
    Booking.findOne({
        where: {
            bookingID: req.query.id
        },
        include: [
            {
              model: Transaction,
              include: [
                {
                    model: Listing,
                    attributes: ['userID']
                }],
              attributes: ['customerID']
            }
          ]
    }).then(booking => {
        if (!booking)
            return res.status(404).send({ message: "Invalid bookingID" });
        if (booking.Transaction.Listing.userID !== req.userId || booking.Transaction.customerID !== req.userId)
            return res.status(401).send({ message: "Unauthorized to view another user's booking"});

        return res.send(booking)
    })
}

// temp
exports.deleteBooking = (req, res) => {
    Booking.destroy({
        where: {
            bookingID: req.query.id
        },
    }).then(r => {
        res.status(200).send({ message: "Done"})
    });
}

/** get bookings on transaction
 * expected Query param:
 * @param id transactionID 
 */
exports.getBookingsOnTransaction = (req, res) => {
    Transaction.findOne({
        where: {
            transactionID: req.query.id
        },
        include: [
            {
              model: Listing,
              attributes: ['userID']
            }
        ],
    }).then(transaction => {
        if (!transaction)
            return res.status(404).send({ message: "Invalid transactionID" });
        if (transaction.Listing.userID !== req.userId || transaction.customerID !== req.userId)
            return res.status(401).send({ message: "Unauthorized to view another user's bookings"});

        Booking.findAll({
            where: {
                transactionID: req.query.id
            }
        }).then(bookings => {
            res.send({bookings: bookings})
        })
    })
}

/** get bookings on listing by month
 * expected Query param:
 * @param id listingID
 * @param year
 * @param month 
 */
exports.getListingBookingsByMonth = (req, res) => {
    Listing.findOne({
        where: {
            listingID: req.query.id
        }
    }).then(listing => {
        if (!listing)
            return res.status(404).send({ message: "Invalid listingID" });

        Booking.findAll({
            where: {
                [Op.or]: [
                    {[Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('startDate')), req.query.month),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('startDate')), req.query.year),
                    ]},
                    {[Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('endDate')), req.query.month),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('endDate')), req.query.year),
                    ]}
                ]
            },
            attributes: ["bookingID", "startDate", "endDate", "startTime", "endTime"],
            include: [
                {
                    model: Transaction,
                    attributes: [],
                    where: {
                        listingID: req.query.id
                    }
                }
            ]
        }).then(bookings => {
            res.send({bookings: bookings})
        })
    })
}

// booking maken (let op assets in transaction)
/** creates booking
 * expected params in body:
 * @param transactionID
 * @param startDate
 * @param startTime (optional)
 * @param endDate
 * @param endTime (optional)
 */
exports.createBooking = (req, res) => {
    Transaction.findOne({
        where: {
            transactionID: req.body.transactionID
        }
    }).then(transaction => {
        // catch errors
        if (!transaction)
            return res.status(404).send({ message: "Invalid listingID" });
        if (transaction.customerID !== req.userId)
            return res.status(401).send({ message: "Only owner of transaction can make booking" });
        
        // TODO
        // date check startdate < enddate and if startdate == enddate starttime < endtime
        // check if no bookings overlap

        Booking.findAll({
            where: {
                transactionID: req.body.transactionID,
            }
        }).then(b => {
            if (b.length >= transaction.numberOfAssets)
                return res.status(400).send({ message: "Can't make any more bookings on this transaction"})
            
            Booking.create({
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                transactionID: req.body.transactionID
            }).then(b => {
                res.status(200).send({booking: b});
            })
        })
    })
}


// update info on booking (for owner of listing)