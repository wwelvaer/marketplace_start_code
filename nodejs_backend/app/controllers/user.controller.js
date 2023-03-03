const db = require("../models");
const User = db.User;
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
    }).then(User => {
        // catch error
        if (!User) 
            return res.status(404).send({ message: "Invalid userID" });
        // send data
        res.status(200).send({
            firstName: User.firstName,
            lastName: User.lastName,
            email: User.email,
            userName: User.userName,
            gender: User.gender,
            address: User.address,
            birthDate: User.birthDate,
            phoneNumber: User.phoneNumber,
            profilePicture: User.profilePicture
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
    }).then(User => {
        // catch error
        if (!User) 
            return res.status(404).send({ message: "Invalid userID" });
        // update data
        User.firstName = req.body.firstName;
        User.lastName = req.body.lastName;
        User.email = req.body.email;
        User.userName = req.body.userName;
        User.gender = req.body.gender;
        User.address = req.body.address;
        User.birthDate = req.body.birthDate;
        User.phoneNumber = req.body.phoneNumber;
        User.profilePicture = req.body.profilePicture;
        User.save().then(user => {
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
    }).then(User => {
        // catch errors
        if (!User)
            return res.status(404).send({ message: "No user matching webtoken found"});
        if (!bcrypt.compareSync(req.body.oldPassword,User.authID))
            return res.status(401).send({message: "Invalid Password"});
        // save hashed password
        User.authID = bcrypt.hashSync(req.body.newPassword, 8) 
        User.save().then(_ => {
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