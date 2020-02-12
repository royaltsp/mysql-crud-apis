let mysql = require('mysql')

//Connection Configuration
let conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "mysql.crud"
});

// Connect to Database
conn.connect()