var express = require('express');
var pg = require('pg');
var router = express.Router();

// connection string -> 'postgres://<username>:<password>@<server address>:<port>/<database name>'
var connectionString = 'postgres://apsmhjnf:0tJkVFCf8dkcQlQV_qIrepNDFwf4DfcK@echo.db.elephantsql.com:5432/apsmhjnf';

router.get('/', function(req, res) {
    res.sendFile(__dirname + '/form/test.html');
});

router.post('/logpost', function(req, res, next) {
    const results = [];
    // Get a Postgres client from the connection pool
    const data = {uname: req.body.uname, passwd: req.body.psw};
    console.log(data);

    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Select Data
        const query = client.query("SELECT password, role FROM users WHERE user_id=($1)", [data.uname]);
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            console.log(results);
            // return res.json(results[0].password);
            if (results.length == 0) {
                return res.redirect('http://localhost:3000/');
            }

            if (data.passwd == results[0].password) {
                if (results[0].role.toUpperCase() == 'ADMIN') {
                    res.sendFile(__dirname + '/admin_pages/index.html');
                } else if (results[0].role.toUpperCase() == 'VENDOR') {
                    res.sendFile(__dirname + '/vendor_pages/index.html');
                }
                req.session.userID =req.body.uname;
            } else {
                return res.redirect('http://localhost:3000/');
            }
        });
    });
});

module.exports = router;
