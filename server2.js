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
  host: "remotemysql.com",
  user: "MS44W78VlY",
  password: "ncTvzavuBq",
  database: "MS44W78VlY"
});

// Connect to Database
conn.connect()


// Get users API
app.get('/users', function (req, res) {
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8001/users')
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
app.get('/user/:uid', function(req, res) {
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
  let user = req.body;
  let response = {};
  let query = `INSERT INTO users(displayName, email, password) VALUES ('${user.firstName}', '${user.email}', '${user.password}')`;
  conn.query(query, function (error, result) {
    if (error) throw error;
    else{
      response.userInsertedError = false;
      response.userInsertedResult = result;
      response.userInsertedMessage = "New User Added Successfully";
      result.insertId
      query = `INSERT INTO profiles(uid, firstName, lastName, phone, bio, wayToContact) VALUES 
              ('${result.insertId}', '${user.firstName}', '${user.lastName}', '${user.phone}', '${user.bio}', '${user.wayToContact}')`;
      conn.query(query, function(error, result) {
        if (error) { throw  error; }
        else{
          response.profileInsertedError = false;
          response.profileInsertedResult = result;
          response.profileInsertedMessage = "Profile Added Successfully";
        }
      })              
      return res.send(response);
    }
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

//Check User Present In Database API
app.post('/check-user-in-database', function(req, res) {
  // console.log(req);
  let email = req.body.email;
  let password = req.body.password;
  let query = `SELECT uid FROM users WHERE email = '${email}' and password = '${password}'`;
  conn.query(query, function(error, result) {
    if (error) { throw error; }
    let message, userPresent = false, uid = 0;
    if (result.length) {
      if (!isNaN(result[0].uid)){
        userPresent = true;
        uid = result[0].uid;
        message = "User Present In Database";
      }
    }else
      message = "User Not Present In Database";

    return res.send({
      error: !userPresent,
      uid: uid,
      message: message
    })
  })
})


//set port
app.listen(8001, function() {
  console.log("Node App Running On port 8001");
})

module.exports = app;