let express = require('express');
let app = express();
let cors = require('cors')
let bodyParser = require('body-parser');
let mysql = require('mysql')

app.use(cors());

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

// default Route
app.get('/', function(req, res) {
  return res.send({
    error: true,
    message: "Hello World"
  })
})

//Connection Configuration
let conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "mysql.crud"
});

// Connect to Database
conn.connect()


// Get users API
app.get('/users', function (req, res) {
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000/users')
  let query = "SELECT * FROM users";
  conn.query(query, function (error, result, fields) {
    if (error) throw error;
    return res.json({
      error: false,
      data: result,
      message: 'User list'
    })
  });
})

// Get Single User API
app.get('/users/:uid', function(req, res) {
  let uid = req.params.uid;
  // console.log(req.params);
  if (!uid || isNaN(uid)) {
    return res.status(400).send({
      error:true,
      message: "No User ID Found or Wrong User ID"
    })
  }
  let query = `SELECT * FROM users WHERE uid = ${uid}`;
  conn.query(query, function(error, result) {
    if(error) throw error;
    let message = '';
    if (!result.length)
      message = `User NOT Found Of ID ${uid}`
    else
      message = `User Found Of ID ${uid}`
    return res.send({
      error: false,
      data: result[0],
      message: message
    })
  })
})

// ADD users API
app.post('/add-user', function (req, res) {
  let user = req.body.user;
  let query = `INSERT INTO users(displayName, email, password) VALUES ('${user.displayName}', '${user.email}', '${user.password}')`;
  // let query = "INSERT INTO users SET ?";
  // console.log(user);
  // console.log(query);
  conn.query(query, function (error, result) {
    if (error) throw error;
    return res.send({
      error: false,
      data: result,
      message: "New User Added Successfully"
    })
  })
})

//ADD Profile API
app.post('/add-profile', function(req, res) {
  let profile = req.body.profile;
  let query = `INSERT INTO profiles (displayName, uid) VALUES ('${profile.displayName}', ${profile.uid})`;
  conn.query(query, function(error, result) {
    if(error) throw error;
    return res.send({
      error: false,
      data: result,
      message: "Profile Created"
    })
  }) 
})


//set port
app.listen(8000, function() {
  console.log("Node App Running On port 8000");
})

module.exports = app;