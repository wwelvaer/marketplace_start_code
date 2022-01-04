module.exports = {
    HOST: "ugmarket.ugent.be",
    USER: "wwelvaer",
    PASSWORD: "0000",
    DB: "marketplace",
    dialect: "mysql",
    PORT: 13306,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };