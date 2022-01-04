const db = require("../models");
const User = db.user;
var bcrypt = require("bcryptjs");

/** get userdata
 * expected query param:
 * @param id userID 
 */
exports.getUserData = (req, res) => {
    // find user
    User.findOne({
        where: {
            userID: req.query.id
        }
    }).then(user => {
        // catch error
        if (!user) 
            return res.status(404).send({ message: "Invalid userID" });
        // send data
        res.status(200).send({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            userName: user.userName,
            gender: user.gender,
            address: user.address,
            birthDate: user.birthDate,
            phoneNumber: user.phoneNumber,
            profilePicture: user.profilePicture
        });
    })
};

/** update userdata
 * expected query param:
 * @param id userID
 * expected params in body (not required):
 * @param firstName
 * @param lastName
 * @param email
 * @param userName
 * @param gender
 * @param address
 * @param birthDate
 * @param phoneNumber
 * @param profilePicture
 */
exports.postUserData = (req, res) => {
    // find user
    User.findOne({
        where: {
            userID: req.query.id
        }
    }).then(user => {
        // catch error
        if (!user) 
            return res.status(404).send({ message: "Invalid userID" });
        // update data
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.email = req.body.email;
        user.userName = req.body.userName;
        user.gender = req.body.gender;
        user.address = req.body.address;
        user.birthDate = req.body.birthDate;
        user.phoneNumber = req.body.phoneNumber;
        user.profilePicture = req.body.profilePicture;
        user.save().then(user => {
            res.send({ message: "Userdata was updatet successfully!" });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
    })
};

/**
 * expected params in body:
 * @param oldPassword
 * @param newPassword
 */
exports.changePassword = (req, res) => {
    // finds user using webtoken
    User.findOne({
    where: {
        userID: req.userId
    }
    }).then(user => {
        // catch errors
        if (!user)
            return res.status(404).send({ message: "No user matching webtoken found"});
        if (!bcrypt.compareSync(req.body.oldPassword,user.authID))
            return res.status(401).send({message: "Invalid Password"});
        // save hashed password
        user.authID = bcrypt.hashSync(req.body.newPassword, 8) 
        user.save().then(_ => {
            res.send({message: "Password updated successfully"})
        })
    })
}

/**
 * expected param in query
 * @param id userID 
 */
exports.getProfilePicture = (req, res) => {
    // finds user using id in query
    User.findOne({
        where: {
            userID: req.query.id
        }
    }).then(u => {
        // catch errors
        if (!u)
            return res.status(404).send({ message: "No user matching webtoken found"});
        res.send({profilePicture: u.profilePicture})
    })
}