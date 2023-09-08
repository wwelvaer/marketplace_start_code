const express = require("express");
const cors = require("cors");
const PORT = 3001;

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json({limit: '5mb'}));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");

db.sequelize.sync();

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/listing.routes')(app);
require('./app/routes/transaction.routes')(app);
require('./app/routes/category.routes')(app);
require('./app/routes/notification.routes')(app);
require('./app/routes/review.routes')(app);
require('./app/routes/taxonomy.routes')(app);
require('./app/routes/company.routes') (app);
require('./app/routes/message.routes') (app);
require('./app/routes/booking.routes') (app);

var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'ugmarket.ugent.be',
  port: 13306,
  user: 'tdrave3',
  password: '9030gent',
  database: 'Marketplace',
  timezone: 'CET'
});
connection.connect();
let getTime = () => new Date().toTimeString().split(' ')[0];

// app listens on the home route for incoming POST requests
app.post('/', (req, res) => {
    // no query found in body
    if (!req.body['query'])
      res.send({ error: 'ERROR: couldn\'t find any query to be executed' });
    else {
      // send query to db
      connection.query(req.body['query'], function (error, results, fields) {
        // catch errors
        if (error) {
          res.send({ error: error['sqlMessage'] })
          console.log(getTime(), 'Error while executing query \'' + req.body['query'] + '\': ' + error['sqlMessage'])
        } else {
          res.send({ data: results });
          console.log(getTime(), 'Executed query: \'' + req.body['query'] + '\'');
        }
      });
    }
  })

// listen for requests
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});