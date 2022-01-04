module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      userID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      authID: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        isEmail: true
      },
      userName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      gender: {
        type: Sequelize.STRING(7)
      },
      address: {
        type: Sequelize.STRING
      },
      birthDate: {
        type: Sequelize.DATEONLY
      },
      phoneNumber: {
        type: Sequelize.STRING(20)
      },
      profilePicture: {
        type: Sequelize.TEXT('long')
      }
    }, {
      timestamps: false,
      freezeTableName: true,
    });
  
    return User;
  };