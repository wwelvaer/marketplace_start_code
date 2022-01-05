# marketplace

## Angular installation
1. For angular and node: https://angular.io/guide/setup-local
2. Clone the repository: https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository
3. cd repositoryName


## database

1. Install MySQLWorkbench
2. Open the `nodejs_backend/Marketplace_start_data_01_2022.sql` file
3. Put `use databaseName;`before the sql query
4. Run the query
5. Change the credentials `user`, `password`, and `DB` in `nodejs_backend/app/config/db.config.js` via vscode: https://code.visualstudio.com/

## Backend server

Run `node nodejs_backend/app.js` to start the backend server, it will listen for HTTP requests on port 3000 by default.

## Frontend

one-time: Run `cd angular_frontend;npm install` to install the packages
Run `cd angular_frontend;ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


