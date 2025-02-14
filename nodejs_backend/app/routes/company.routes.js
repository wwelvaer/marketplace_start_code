const { authJwt } = require("../middleware");
const controller = require("../controllers/company.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
  
    app.get(
      "/api/company",
      controller.getSelectedCompany
    );

    app.get(
      "/api/companies",
      controller.getAllCompanies
    );
    app.put(
      "/api/company/updateSelected", 
      controller.updateSelectedCompany
      );

    app.post(
      "/api/company/create",
      controller.createCompany
    );
  };