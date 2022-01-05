# marketplace

One-time:

1. For angular and node: https://angular.io/guide/setup-local
2. Install MySQLWorkbench
3. Open the `marketplace_start_code/nodejs_backend/Marketplace_start_data_01_2022.sql` file
4. Put `use databaseName`before the sql query
5. Run the query
6. Change the credentials in `marketplace_start_code/nodejs_backend/app/config/db.config.js`

## Backend server

Run `node nodejs_backend/app.js` to start the backend server, it will listen for HTTP requests on port 3000 by default.

## Frontend

One-time: Run `npm install`

Run `cd angular_frontend;ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


