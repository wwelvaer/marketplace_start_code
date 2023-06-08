module.exports = {
    HOST: "ugmarket.ugent.be",
    USER: "tester",
    PASSWORD: "1234",
    DB: "Marketplace",
    dialect: "mysql",
    PORT: 13306,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
