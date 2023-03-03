module.exports = (sequelize, Sequelize) => {
    const Dimension = sequelize.define("Dimension", {
      name: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      type: {
        description: Sequelize.TEXT,
      },
    }, {
      timestamps: true,
      freezeTableName: true,
    });
  
    return Dimension;
  };