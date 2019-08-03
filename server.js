const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const path = require('path'); //for prod
const saltRounds = 10;

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Connecion settings
// mysql://b79cc199be31c1:c0eb7e4f@us-cdbr-iron-east-02.cleardb.net/heroku_7a140c76f566951?reconnect=true
var con = mysql.createConnection({
  host: 'us-cdbr-iron-east-02.cleardb.net',
  user: 'b79cc199be31c1',
  password: 'c0eb7e4f',
  database: 'heroku_7a140c76f566951'
});

app.get('/api/trailers', (req, res)=>{
  const query = "CALL GET_TRAILER_VIEW";
  con.query(query, (err, response)=>{
    if(err){
      res.send(err);
    }else{
      return res.json({ data : response[0] })
    }
  });
});

app.get('/api/edit/trailers', (req, res)=>{
  const query = "CALL GET_ALL_TRAILERS";
  con.query(query, (err, response)=>{
    if(err){
      res.send(err);
    }else{
      return res.json({ data : response[0] })
    }
  });
});

app.get('/api/doors', (req, res)=>{
  const query = "CALL GET_DOOR_LIST";
  con.query(query, (err, response)=>{
    if(err){
      res.send(err);
    }else{
      return res.json({ data : response[0] })
    }
  });
});

app.get('/api/contacts', (req, res)=>{
  const query = "CALL GET_CONTACTS";
  con.query(query, (err, response)=>{
    if(err){
      res.send(err);
    }else{
      return res.json({ data : response[0] })
    }
  });
});


app.post('/api/edit/status', (req, res) => {
  const query = `CALL TOGGLE_TRAILER_STATUS(${req.body.newStatus}, ${req.body.trailer_id})`;
  con.query(query, (err, result) => {
    if(err){
      res.send(err);
    }else{
      return res.json({data : result.affectedRows});
    }
  });
});

app.post('/api/edit/currentdoor', (req, res) => {
  const query = `CALL UPDATE_CURRENT_DOOR(${req.body.newDoorId}, ${req.body.trailerId}, ${req.body.oldDoorId})`;
  con.query(query, (err, result) => {
    if(err){
      res.send(err);
    }else{
      return res.json({data : result.affectedRows});
    }
  });
});

app.post('/api/edit/wave', (req, res) => {
  const newTranQuery = `CALL CREATE_NEW_TRAN(${req.body.trailerId}, ${req.body.fromDoor}, ${req.body.wave})`;
  const updateTranQuery = `CALL UPDATE_WAVE(${req.body.tranId}, ${req.body.wave})`;
  
  con.query(req.body.tranId === null ? newTranQuery : updateTranQuery, (err, result) => {
    if(err){
      res.send(err);
    }else{
      return res.json({data : result.affectedRows});
    }
  });
});

app.post('/api/edit/destination', (req, res) => {
  const query = `CALL UPDATE_DESTINATION(${req.body.toDoorId}, ${req.body.tranId}, ${req.body.oldDoorId}, ${req.body.trailerId})`;
  con.query(query, (err, result) => {
    if(err){
      res.send(err);
    }else{
      return res.json({data : result.affectedRows});
    }
  });
});

app.post('/api/edit/arrivalts', (req, res) => {
  const query = `CALL UPDATE_ARRIVE_DTTM(${req.body.tranId}, '${req.body.timeSt}', ${req.body.toDoorId}, ${req.body.trailerId}, ${req.body.isEmpty})`;
  con.query(query, (err, result) => {
    if(err){
      res.send(err);
    }else{
      return res.json({data : result.affectedRows});
    }
  });
});

app.post('/api/edit/offloadstart', (req, res) => {
  const query = `CALL UPDATE_START_DTTM(${req.body.tranId}, '${req.body.timeSt}', ${req.body.trailerId})`;
  con.query(query, (err, result) => {
    if(err){
      res.send(err);
    }else{
      return res.json({data : result.affectedRows});
    }
  });
});

app.post('/api/edit/offloadend', (req, res) => {
  const query = `CALL UPDATE_END_DTTM(${req.body.tranId}, '${req.body.timeSt}', ${req.body.trailerId})`;
  con.query(query, (err, result) => {
    if(err){
      res.send(err);
    }else{
      return res.json({data : result.affectedRows});
    }
  });
});

// Add New
app.post('/api/add/contact', (req, res) => {
  const query = `CALL ADD_CONTACT('${req.body.firstName}', '${req.body.lastName}', '${req.body.position}', '${req.body.dc}', '${req.body.phoneNumber}', ${req.body.shift})`;
  con.query(query, (err, result) => {
    if(err){
      res.send(err);
    }else{
      return res.json({data : req.body});
    }
  });
});

app.post('/api/add/door', (req, res) => {
  const query = `CALL ADD_DOOR('${req.body.yard}', '${req.body.doorName}')`;
  con.query(query, (err, result) => {
    if(err){
      return res.json({data : [err, req.body]});
    }else{
      return res.json({data : result.affectedRows});
    }
  });
});

app.post('/api/add/trailer', (req, res) => {
  const query = `CALL ADD_TRAILER('${req.body.trailerName}', ${req.body.isDamaged})`;
  con.query(query, (err, result) => {
    if(err){
      return res.json({data : [err, req.body, query]});
    }else{
      return res.json({data : result.affectedRows});
    }
  });
});

// Update existing
app.post('/api/edit/contact', (req, res) => {
  const query = `CALL EDIT_CONTACT(${req.body.contactId}, '${req.body.firstName}', '${req.body.lastName}', '${req.body.position}', '${req.body.dc}', '${req.body.phoneNumber}', ${req.body.shift})`;
  con.query(query, (err, result) => {
    if(err){
      return res.json({data : [err, req.body]});
    }else{
      return res.json({data : result.affectedRows});
    }
  });
});

app.post('/api/edit/door', (req, res) => {
  const query = `CALL EDIT_DOOR(${req.body.doorId}, '${req.body.yard}', '${req.body.doorName}')`;
  con.query(query, (err, result) => {
    if(err){
      return res.json({data : [err, req.body]});
    }else{
      return res.json({data : result.affectedRows});
    }
  });
});

app.post('/api/edit/trailer', (req, res) => {
  const query = `CALL EDIT_TRAILER(${req.body.trailerId}, '${req.body.trailerName}', ${req.body.isDamaged})`;
  con.query(query, (err, result) => {
    if(err){
      return res.json({data : [err, req.body, query]});
    }else{
      return res.json({data : result.affectedRows});
    }
  });
});

// Delete
app.post('/api/delete/contact', (req, res) => {
  const query = `CALL DELETE_CONTACT(${req.body.id})`;
  con.query(query, (err, result) => {
    if(err){
      return res.json({data : err});
    }else{
      return res.json({data : result.affectedRows});
    }
  });
});

app.post('/api/delete/trailer', (req, res) => {
  const query = `CALL DELETE_TRAILER(${req.body.id})`;
  con.query(query, (err, result) => {
    if(err){
      return res.json({data : err});
    }else{
      return res.json({data : result.affectedRows});
    }
  });
});

app.post('/api/delete/door', (req, res) => {
  const query = `CALL DELETE_DOOR(${req.body.id})`;
  con.query(query, (err, result) => {
    if(err){
      return res.json({data : err});
    }else{
      return res.json({data : result.affectedRows});
    }
  });
});


// Add new user
app.post('/api/add/user', (req, res)=>{
  const {firstname,lastname,username,password} = req.body;
  const check_sql = `CALL CHECK_FOR_USER('${username}')`;
  con.query(check_sql, (err, check_response)=>{
    if(err){
      res.send(err)
    }else{
      const values = Object.values(JSON.parse(JSON.stringify(check_response[0])));
      if(values.length>0){
        return res.json({ data : false })
      }else{
        bcrypt.hash(password, saltRounds, (err, hash)=>{
          const sql = `CALL ADD_USER('${firstname}', '${lastname}', '${username}', '${hash}')`;
          con.query(sql, (err, result)=>{
            if(err){
              return res.json({ data : false });
            }else{
              return res.json({ data : true });
            }
          });
        });
      }
    }
  })
});

//Delete existing user
app.post('/api/delete/user', (req, res) => {
  const query = `CALL DELETE_USER(${req.body.id})`;
  con.query(query, (err, result) => {
    if(err){
      return res.json({data : err});
    }else{
      return res.json({data : result.affectedRows});
    }
  });
});

//Get users
app.get('/api/users', (req, res)=>{
  const query = "CALL GET_USERS";
  con.query(query, (err, response)=>{
    if(err){
      res.send(err);
    }else{
      return res.json({ data : response[0] })
    }
  });
});

// Login
app.post('/api/login', (req, res)=>{
  const {username, password} = req.body;

  const query = `CALL LOGIN('${username}')`;
  con.query(query, (err, result)=>{
    if(err){
      return res.json({ success : false });
    }else{
      const values = Object.values(JSON.parse(JSON.stringify(result[0])));
      if(values.length == 0){
        return res.json({success : false});
      }else{
        bcrypt.compare(password, values[0].PASS_WORD, (err, response)=>{
          if(err){
            return res.json({ success : false });
          }if(response){
            return res.json({ 
              success : true,
              user : {
                USER_ID : values[0].USER_ID,
                FIRST_NAME : values[0].FIRST_NAME,
                LAST_NAME : values[0].LAST_NAME,
                USER_NAME : values[0].USER_NAME
              }
            });
          }else{
            return res.json({ success : false });
          }
        });
      }
    }
  });
});

// Get User info when user comes back and is remebered in cookies
app.get('/api/user', (req, res)=>{
  const sql = `CALL GET_USER('${req.query.username}')`;
  con.query(sql, (err, response)=>{
    if(err){
      return res.json({ success : false, error : err});
    }else{
      return res.json({ success : true, user : response[0]})
    }
  })
})

//Edit existing user
app.post('/api/edit/user', (req, res)=>{
  con.query(`SELECT USER_NAME FROM USERS WHERE USER_NAME = '${req.body.username}' AND USER_ID <> ${req.body.userId}`, (err, re)=>{
    if(err){
      return res.json({err})
    }else{
      if(re.length > 0){
        return res.json({ 
          success : false,
          errorMessage : 'Username has been assigned to someone else. Please choose a different one.'
        })
      }else{
        bcrypt.hash(req.body.password, saltRounds, (err, hash)=>{
          const sql = `CALL EDIT_USER(${req.body.userId}, '${req.body.firstname}', '${req.body.lastname}', '${req.body.username}', '${hash}')`;
          con.query(sql, (err, result)=>{
            if(err){
              return res.json({ success : false });
            }else{
              if(result.affectedRows > 0){
                return res.json({ success : true });
              }else{
                return res.json({ 
                  success : false,
                  errorMessage : 'Error updating profile. Please try again or contact your administrator.'
                });
              }
            }
          });
        });
      }
    }
  })
});


app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

// start of prod code ------------------------------------------------------------------------- 
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
    
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}
// end of prod code -------------------------------------------------------------------------


app.listen(port, () => console.log(`Listening on port ${port}`));