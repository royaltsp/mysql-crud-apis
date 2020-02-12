// Get users API
app.get('/users', function (req, res) {
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

// ADD users API
app.post('/add-user', function (req, res) {
  let user = req.body.user;
  // let query = `INSERT INTO users(username, email, password) VALUES (${su})`
  let query = "INSERT INTO users SET ?";
  conn.query(query, { user: user }, function(error, result, fields) {
    if(error) throw error;
    return res.send({
      error: false,
      data: result,
      message: "New User Added Successfully"
    })
  })
})