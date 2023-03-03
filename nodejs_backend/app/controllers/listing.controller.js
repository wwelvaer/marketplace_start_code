const db = require("../models");
const sequelize = require('sequelize');
const Listing = db.Listing;
const Transaction = db.Transaction;
const User = db.User;
const Notification = db.Notification;
const Review = db.Review;

// returns all listings
exports.getAllListings = (req, res) => {
    db.sequelize.query("SELECT l.*, r.avgScore, r.reviewAmount FROM Listing as l LEFT JOIN (SELECT listingID, cast(AVG(score) as decimal(3,2)) as avgScore, IFNULL(COUNT(score), 0) as reviewAmount FROM Review as r INNER JOIN Transaction as t USING (transactionID)  WHERE r.reviewType = 'listing' GROUP BY t.listingID) as r USING(listingID) INNER JOIN Company C on l.company = C.name where C.selected ")
        .then(l => {
            return res.status(200).send({listings: l[0]})
        })
};
 
/** get all listings made by given user
 * expected query param:
 * @param id userID 
 */
exports.getUserListings = (req, res) => {
    Listing.findAll({
        where: {
            userID: req.query.id
        }
    }).then(l => {
        return res.status(200).send({listings: l})
    })
};

/** create listing
 * expected params in body (not required):
 * @param name
 * @param description
 * @param availableAssets
 * @param date
 * @param price
 * @param picture // image in base64 format
 * @param location
 * @param categories
 */
exports.createListing = (req, res) => {
    Listing.create({
        name: req.body.name,
        description: req.body.description,
        availableAssets: req.body.availableAssets,
        date: req.body.date,
        price: req.body.price,
        picture: req.body.picture,
        location: req.body.location,
        categories: req.body.categories,
        status: 'active',
        userID: req.userId
    }).then(l => {
        res.send({ message: "Listing was created successfully!", listingID: l.listingID });
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
}

/** get listingdata
 * expected query param:
 * @param id listingID 
 */
exports.getListing = (req, res) => {
    Listing.findOne({
        where: {
            listingID: req.query.id
        },
        // include userName extracted from user
        include: {model: User, attributes: ['userName']},
    }).then(Listing => {
        if (!Listing)
            return res.status(404).send({ message: "Invalid listingID" });
        // send listingdata
        res.status(200).send({
            listingID: Listing.listingID,
            name: Listing.name,
            description: Listing.description,
            availableAssets: Listing.availableAssets,
            date: Listing.date,
            price: Listing.price,
            picture: Listing.picture,
            location: Listing.location,
            categories: Listing.categories,
            status: Listing.status,
            userID: Listing.userID,
            userName: Listing.User.userName
        })
    })
    
};

/** update listingdata
 * expected query param:
 * @param id listingID
 * expected params in body (not required):
 * @param name
 * @param description
 * @param availableAssets
 * @param date
 * @param price
 * @param picture // image in base64 format
 * @param location
 * @param categories
 */
exports.postListing = (req, res) => {
    Listing.findOne({
        where: {
            listingID: req.query.id
        }
    }).then(Listing => {
        // catch errors
        if (!Listing)
            return res.status(404).send({ message: "Invalid listingID" });
        if (req.userId !== Listing.userID)
            return res.status(401).send({ message: "Unauthorized to edit another user's listing"});
        // save data
        Listing.name = req.body.name
        Listing.description = req.body.description
        Listing.availableAssets = req.body.availableAssets
        Listing.date = req.body.date
        Listing.price = req.body.price
        Listing.picture = req.body.picture
        Listing.location = req.body.location
        Listing.categories = req.body.categories
        Listing.save().then(_ => {
            res.send({ message: "Listing was updatet successfully!" });
        }).catch(err => {
            res.status(500).send({ message: err.message})
        });
    })
};

/** cancel listing
 * expected query param:
 * @param id listingID
 */
exports.cancelListing = (req, res) => {
    Listing.findOne({
        where: {
            listingID: req.query.id
        }
    }).then(Listing => {
        // catch errors
        if (!Listing)
            return res.status(404).send({ message: "Invalid listingID" });
        if (req.userId !== Listing.userID)
            return res.status(401).send({ message: "Unauthorized to cancel another user's listing"});
        // cancel all transactions
        Transaction.findAll({
            where: {
                listingID: Listing.listingID
            }
        }).then(transactions => {
            // cancel all transactions of listing
            transactions.forEach(t => {
                t.status = 'cancelled';
                Notification.create({
                    transactionID: t.transactionID,
                    viewed: false,
                    userID: t.customerID,
                    type: 'cancellation'
                }).then(_ => t.save())
            });
            // cancel listing
            Listing.status = 'cancelled'
            Listing.save().then(_ => {
                res.send({ message: "Listing was cancelled successfully!" });
            })
        })
        
    })
}
