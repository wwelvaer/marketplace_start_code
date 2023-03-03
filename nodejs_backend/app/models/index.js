const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    port: config.PORT,
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// load models
db.User = require("../models/user.model.js")(sequelize, Sequelize);
db.Listing = require("../models/listing.model.js")(sequelize, Sequelize);
db.Transaction = require("../models/transaction.model.js")(sequelize, Sequelize);
db.Category = require("../models/category.model.js")(sequelize, Sequelize);
db.Notification = require("../models/notification.model.js")(sequelize, Sequelize);
db.Review = require("../models/review.model.js")(sequelize, Sequelize);
db.Company = require("../models/company.model.js")(sequelize, Sequelize);
db.PropertyCompany = require("../models/PropertyCompany.model.js")(sequelize, Sequelize);
db.Registration = require("../models/registration.model.js")(sequelize, Sequelize);

// add foreign keys
db.Listing.belongsTo(db.User, {foreignKey: 'userID'})
db.Transaction.belongsTo(db.Listing, {foreignKey: 'listingID'})
db.Transaction.belongsTo(db.User, {foreignKey: 'customerID'})
db.Notification.belongsTo(db.User, {foreignKey: 'userID'})
db.Notification.belongsTo(db.Transaction, {foreignKey: 'transactionID'})
db.Review.belongsTo(db.Transaction, {foreignKey: 'transactionID'})
db.PropertyCompany.belongsTo(db.Company, {foreignKey: 'company'})
db.Listing.belongsTo(db.Company, {foreignKey: 'company'})
db.Registration.belongsTo(db.Company, {foreignKey: 'company'})
db.Registration.belongsTo(db.User, {foreignKey: 'userID'})

module.exports = db;