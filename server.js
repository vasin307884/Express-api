var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');

var mysql = require('mysql');
var dbConn = mysql.createConnection({
    host: 'us-cdbr-iron-east-04.cleardb.net',
    user: 'b4b170e8daceb8',
    password: 'ffda00d5',
    database: 'heroku_eff46056a22e1a4'
});

// connect to database
dbConn.connect();

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

// set port
app.listen(4000, function () {
    console.log('Node app is running on port 4000');
});
module.exports = app;