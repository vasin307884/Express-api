var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');

var mysql = require('mysql');
const dbConfig = require('./config/db.config')
var dbConn = mysql.createPool({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});
module.exports = dbConn;
// connect to database

app.use(cors({origin:true}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// default route
app.get('/', function (req, res) {
    return res.send({ error: true, message: 'Connected to server' })
});

// Retrieve all users 
app.get('/requests/', function (req, res) {
    dbConn.query('SELECT * FROM requests', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Request list.' });
    });
});

// Retrieve user with id 
app.get('/requests/:id', function (req, res) {

    let usr_id = req.params.id;

    if (!usr_id) {
        return res.status(400).send({ error: true, message: 'Please provide usr_id' });
    }

    dbConn.query('SELECT * FROM requests where id=?', usr_id, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'Request list.' });
    });

});


// Add a new user  
app.post('/requests/add', function (req, res) {
    console.log(req.body)
    let usr = req.body;
    // console.log(emp)
    if (!usr) {
        return res.status(400).send({ error: true, message: 'Please provide user' });
    }

    dbConn.query("INSERT INTO requests SET ? ", usr, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'New request has been created successfully.' });
    });
});

//  Update user with id
app.put('/requests/update', function (req, res) {

    let usr_id = req.body.id;
    let usr = req.body;
    console.log(usr)
    if (!usr_id || !usr) {
        return res.status(400).send({ error: usr, message: 'Please provide user and user_id' });
    }

    dbConn.query("UPDATE requests SET statusValue = ?,color = ? WHERE id = ?", [usr.statusValue,usr.color, usr_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Request has been updated successfully.' });
    });
});

//  Delete user
app.delete('/requests/delete', function (req, res) {
    console.log(req.body)
    let usr_id = req.body.id;

    if (!usr_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }
    dbConn.query('DELETE FROM requests WHERE id = ?', [usr_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'User has been updated successfully.' });
    });
});
app.post('/users',function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;
    dbConn.query("SELECT * FROM users where username = ? AND password = ?",
    [username,password],function(error,row,fields){
        if(error){
            console.log(error);
            res.send({'Success':false,'message':'Could not connect to database'});
        }
        if(row.length > 0){
            res.send({'Success':true,'users':row[0].username});
        }else {
            res.send({'Success':false,'message':'User not found'})
        }
    });
});
// set port
const PORT = process.env.PORT || 4000;
app.listen(PORT, function () {
    console.log(`Server is running on port ${PORT}.`);
});
module.exports = app;