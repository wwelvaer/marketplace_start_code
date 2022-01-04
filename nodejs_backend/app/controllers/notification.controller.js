const db = require("../models");
const Notification = db.notification;
const Transaction = db.transaction;
const Listing = db.listing;
const Op = db.Sequelize.Op
const sequelize = db.sequelize;

// get all notifications from user
exports.getUserNotifications = (req, res) => {
    Notification.findAll({
        where: {
            userID: req.userId,
            // check if notification is only active from certain date
            activeAt: {
              [Op.or]: {
                [Op.not]: sequelize.literal('NOW()'),
                [Op.is]: null
              }   
            }
        },
        // include customerID, listingID and listing name
        include: {model: Transaction, attributes: ['listingID', 'customerID'], include: {model: Listing, attributes: ['name']}},
    }).then(n => {
        res.status(200).send({notifications: n})
    }).catch(err => {
        res.status(500).send({ message: err.message });
      });
};

/** mark notification as viewed
 * expected query param:
 * @param id notificationID
 */
exports.markNotificationAsViewed = (req, res) => {
    Notification.findOne({
        where: {
            notificationID: req.query.id
        }
    }).then(n => {
        if (!n)
            return res.status(404).send({ message: "Invalid notificationID" });
        if (n.userID !== req.userId)
            return res.status(401).send({ message: "Unauthorized to mark another user's notification as viewed"});
        n.viewed = 'true';
        n.save().then(_ => {
           res.send({message: "Notification marked as viewed successfully"})
        })
    })
}