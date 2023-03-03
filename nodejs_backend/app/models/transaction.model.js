module.exports = (sequelize, Sequelize) => {
    const Transaction = sequelize.define("Transaction", {
      transactionID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      numberOfAssets: {
        type: Sequelize.INTEGER
      },
      pricePerAsset: {
        type: Sequelize.DOUBLE
      },
      time: {
        type: Sequelize.DATE,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('payed', 'reserved', 'cancelled')
      }
    }, {
      timestamps: true,
      freezeTableName: true,
    });
    return Transaction;
  };