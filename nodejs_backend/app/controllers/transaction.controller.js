const db = require("../models");
const Transaction = db.transaction;
const Listing = db.listing;
const User = db.user;
const Notification = db.notification;
const Review = db.review;
const sequelize = db.sequelize;

/** get all transactions on a given listingid
 * expected Query param:
 * @param id listingID 
 */
exports.getListingTransactions = (req, res) => {
    // find listing
    Listing.findOne({
        where: {
            listingID: req.query.id
        },
    }).then(listing => {
        // catch errors
        if (!listing)
            return res.status(404).send({ message: "Invalid listingID" });
        if (listing.userID !== req.userId)
            return res.status(401).send({ message: "Unauthorized to view another user's transactions on his listings"});
        // find all transactions
        Transaction.findAll({
            where: {
                listingID: listing.listingID
            },
            // include userdata (when user has no firstName and lastName use email as name)
            include: {model: User, attributes: ['userID', [db.sequelize.literal("CASE WHEN firstName = '' AND lastName = '' THEN email ELSE CONCAT(firstName, ' ', lastName) END"), 'name']]},
            order: [['time', 'DESC']],
        }).then(t => {
            checkReviewable(t, 'user', res);
        })
    })
};

// get all transactions made by given user
exports.getUserTransactions = (req, res) => {
    Transaction.findAll({
        where: {
            customerID: req.userId // get user from webtoken
        },
        // include listingdata
        include: {model: Listing, attributes: ['listingID', 'name', 'availableAssets', 'date', 'price', 'picture', 'userID']},
        order: [['time', 'DESC']],
    }).then(t => {
        checkReviewable(t, 'listing', res);
    })
};

function checkReviewable(transactions, reviewType, res){
    if (transactions.length === 0)
        return res.status(200).send({transactions: []});
    let checkedTransactions = [];
    transactions.forEach(x => {
        Review.findOne({
            where: {
                transactionID: x.transactionID,
                reviewType: reviewType
            }
        }).then(r => {
            x.dataValues['reviewable'] = !Boolean(r) && Math.ceil((Date.now() - x.time) / (1000 * 60 * 60 * 24)) >= 10;
            checkedTransactions.push(x);
            if (checkedTransactions.length == transactions.length)
                res.status(200).send({transactions: checkedTransactions});
        })
    });
}

/** creates transaction
 * expected params in body:
 * @param listingID
 * @param numberOfAssets
 */
exports.createTransaction = (req, res) => {
    // find listing
    Listing.findOne({
        where: {
            listingID: req.body.listingID
        }
    }).then(listing => {
        // catch errors
        if (!listing)
            return res.status(404).send({ message: "Invalid listingID" });
        if (!req.body.numberOfAssets)
            return res.status(400).send({ message: "Number of assets not given" });
        if (listing.availableAssets && listing.availableAssets < req.body.numberOfAssets)
            return res.status(400).send({ message: "Not enough assets available" });
        if (req.userId === listing.userID)
            return res.status(401).send({ message: "Can't make a transaction on your own listing" })
        if (listing.status === 'cancelled')
            return res.status(400).send({ message : "Can't make a transaction on a cancelled listing" })
        // create transaction
        Transaction.create({
            numberOfAssets: req.body.numberOfAssets,
            pricePerAsset: listing.price,
            customerID: req.userId, // get user from webtoken
            status: 'reserved',
            listingID: listing.listingID,
            time: sequelize.literal('NOW()')
        }).then(t => {
            // update listing's available assets
            if (listing.availableAssets)
                listing.availableAssets -= t.numberOfAssets;
            Notification.create({
                transactionID: t.transactionID,
                viewed: false,
                userID: listing.userID,
                type: 'new transaction'
            })
            Notification.create({
                transactionID: t.transactionID,
                viewed: false,
                userID: req.userId,
                type: 'reviewable',
                activeAt: sequelize.literal('NOW() + INTERVAL 10 day')
            })
            listing.save().then(() => {
                res.send({ message: "Transaction was created successfully!", customerID: t.customerID });
            })
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
    })
}

/** cancels transaction (doesn't delete)
 * expected query param:
 * @param id transactionID 
 */
exports.cancelTransaction = (req, res) => {
    // find transaction
    Transaction.findOne({
        where: {
            transactionID: req.query.id
        },
        // include userID extracted from listing
        include: {model: Listing, attributes: ['userID']},
    }).then(transaction => {
        // catch errors
        if (!transaction)
            return res.status(404).send({ message: "Invalid transactionID" });
        // compare user from webtoken with data
        if (req.userId !== transaction.customerID && req.userId !== transaction.listing.userID) 
            return res.status(401).send({ message: "Unauthorized to cancel transaction"});
        // find listing
        Listing.findOne({
            where: {
                listingID: transaction.listingID
            }
        }).then(listing => {
            // catch error
            if (!listing)
                return res.status(404).send({ message: "Transaction has invalid listingID" });
            // update listing's available assets
            if (listing.availableAssets)
                listing.availableAssets += transaction.numberOfAssets;
            listing.save().then(_ => {
                // update transaction status
                transaction.status = 'cancelled';
                Notification.create({
                    transactionID: transaction.transactionID,
                    viewed: false,
                    userID: req.userId === listing.userID ? transaction.customerID : listing.userID,
                    type: 'cancellation'
                }).then(() => 
                    transaction.save().then(_ => {
                        res.send({ message: "Transaction was cancelled successfully!" });
                    })
                )
                
            })
        })
    })
}

/** confirm payment of transaction
 * expected query param:
 * @param id transactionID 
 */
exports.confirmPayment = (req, res) => {
    // find transaction
    Transaction.findOne({
        where: {
            transactionID: req.query.id
        },
        // include userID extracted from listing
        include: {model: Listing, attributes: ['userID']},
    }).then(transaction => {
        // catch errors
        if (!transaction)
            return res.status(404).send({ message: "Invalid transactionID" });
        // compare user from webtoken with data 
        if (req.userId !== transaction.listing.userID)
            return res.status(401).send({ message: "Unauthorized to confirm payment"});
        // update transaction's status
        transaction.status = 'payed';
        Notification.create({
            transactionID: transaction.transactionID,
            viewed: false,
            userID: transaction.customerID,
            type: 'payment confirmation'
        })
        transaction.save().then(_ => {
            res.send({ message: "Payment was confirmed successfully!" });
        }) 
    })
}