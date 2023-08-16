const db = require("../models");
const sequelize = require('sequelize');
const Message = db.Message;
const User = db.User;

const { Op } = require("sequelize");

/** Post a message
 * expected params in body:
 * @param receiverID ID of receiving user
 * @param message
 */
exports.postMessage = (req, res) => {
    User.findOne({
        where: {
            userID: req.body.receiverID,
        },
    }).then(u => {
        // catch errors
        if (!u)
            return res.status(400).send({ message: "Invalid receiverID" });
        if (!req.body.message)
            return res.status(400).send({ message: "No message found" });

        Message.create({
            senderID: req.userId,
            receiverID: u.userID,
            message: req.body.message
        }).then(m => {
            res.send({ message: "Message was posted successfully!", messageID: m.messageID})
        }).catch(err => {
            res.status(500).send({ message: err.message});
        });
    })
}

/** Get lasts messages for every person contacted
 */ 
exports.getLastMessages = (req, res) => {
    Message.findAll({
        attributes: [
            'senderID',
            'receiverID',
            'message',
            'createdAt'
        ],
        where: {
            [Op.or]: [
                { senderID: req.userId },
                { receiverID: req.userId }
            ]
        }
    }).then(m => {
        // TODO get last message for every user
    })
}

/** Get all messages with another user
 * expected query param:
 * @param id userID of other user
 */
exports.getMessages = (req, res) => {
    User.findOne({
        where: {
            userID: req.query.id
        }
    }).then(u => {
        // catch errors
        if (!u)
            return res.status(404).send({ message: "Invalid receiverID" });

        Message.findAll({
            attributes: [
                'message',
                'createdAt',
                'senderID'
            ],
            where: {
                [Op.or]: 
                    [{ [Op.and]: 
                            [{ senderID: req.userId },
                            { receiverID: req.query.id }]
                    },{ 
                        [Op.and]:
                            [{ senderID: req.query.id },
                            { receiverID: req.userId }]
                    }]
            }
        }).then(m => {
            return res.status(200).send({messages: m})
        }).catch(err => {
            res.status(500).send({ message: err.message});
        })
    })
    
}