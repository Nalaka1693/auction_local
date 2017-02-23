var express = require('express');
var pg = require('pg');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('users');
});

router.post('/add', function(req, res, next) {
    const results = [];
    // Get a Postgres client from the connection pool
    const data = {
        uid: req.body.user_id,
        fname: req.body.fname,
        lname: req.body.lname,
        role: req.body.role,
        email: req.body.email,
        date_cr: req.body.date_created,
        mob: req.body.mobile,
        comp: req.body.company,
        pwd: req.body.password
    };

    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Select Data
        const query = client.query("INSERT INTO users(user_id, fname, lname, role, email, date_created, mobile, company, password) values($1, $2, $3, $4, $5, $6, $7, $8, $9)",
            [data.uid, data.fname, data.lname, data.role, data.email, data.date_cr, data.mob, data.comp, data.pwd]);
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            // console.log(results);
            return res.send('User added successfully');
        });
    });
});

router.post('/edit', function(req, res, next) {
    const results = [];
    // Get a Postgres client from the connection pool
    const data = {
        uid: req.body.user_id,
        fname: req.body.fname,
        lname: req.body.lname,
        role: req.body.role,
        email: req.body.email,
        date_cr: req.body.date_created,
        mob: req.body.mobile,
        comp: req.body.company,
        pwd: req.body.password
    };

    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Select Data
        const query = client.query("UPDATE users SET user_id=($1), fname=($2), lname=($3), role=($4), email=($5), date_created=($6), mobile=($7), company=($8), password=($9)",
            [data.uid, data.fname, data.lname, data.role, data.email, data.date_cr, data.mob, data.comp, data.pwd]);
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            // console.log(results);
        });
    });
});

router.post('/edit/confirm', function(req, res, next) {
    const results = [];
    // Get a Postgres client from the connection pool
    const data = {
        uid: req.body.user_id,
        fname: req.body.fname,
        lname: req.body.lname,
        role: req.body.role,
        email: req.body.email,
        date_cr: req.body.date_created,
        mob: req.body.mobile,
        comp: req.body.company,
        pwd: req.body.password
    };

    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Select Data
        const query = client.query("UPDATE users SET user_id=($1), fname=($2), lname=($3), role=($4), email=($5), date_created=($6), mobile=($7), company=($8), password=($9)",
            [data.uid, data.fname, data.lname, data.role, data.email, data.date_cr, data.mob, data.comp, data.pwd]);
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            // console.log(results);
        });
    });
});

router.delete('/del', function(req, res, next) {
    const results = [];
    // Get a Postgres client from the connection pool
    const data = { uid: req.body.user_id };

    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Select Data
        const query = client.query("DELETE FROM users WHERE user_id=($1)", [data.uid]);
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            // console.log(results);
            return res.send('User deleted successfully');
        });
    });
});

module.exports = router;
