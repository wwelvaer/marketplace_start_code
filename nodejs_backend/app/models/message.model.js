module.exports = (sequelize, Sequelize) => {
    const Message = sequelize.define("Message", {
      messageID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT
      },
    }, {
      timestamps: true,
      freezeTableName: true,
    });
    return Message;
  };