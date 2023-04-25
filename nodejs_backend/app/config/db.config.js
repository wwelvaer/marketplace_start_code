module.exports = {
    HOST: "ugmarket.ugent.be",
    USER: "tdrave3",
    PASSWORD: "9030gent",
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
