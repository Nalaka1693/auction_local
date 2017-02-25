var express = require('express');
var pg = require('pg');
var router = express.Router();

// connection string -> 'postgres://<username>:<password>@<server address>:<port>/<database name>'
var connectionString = 'postgres://apsmhjnf:0tJkVFCf8dkcQlQV_qIrepNDFwf4DfcK@echo.db.elephantsql.com:5432/apsmhjnf';

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

    console.log(data);

    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Select Data
        const query = client.query("INSERT INTO users(user_id, fname, lname, role, email, date_created, mobile, company, password) values($1, $2, $3, $4, $5, $6, $7, $8, $9)",
            [data.uid, data.fname, data.lname, data.role, data.email, 'CURRENT_DATE', data.mob, data.comp, data.pwd]);
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            console.log('done');
            return res.json({"msg": 'User added successfully'});
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
    console.log(req.body);
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Select Data
        const query = client.query("SELECT * FROM users WHERE user_id=($1)", [data.uid]);
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });
});

router.put('/edit/confirm', function(req, res, next) {
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
        const query = client.query("UPDATE users SET fname=($1), lname=($2), role=($3), email=($4), " +
            "date_created=($5), mobile=($6), company=($7), password=($8) WHERE user_id=($9)",
            [data.fname, data.lname, data.role, data.email, data.date_cr, data.mob, data.comp, data.pwd, data.uid]);
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            // console.log(results);
            return res.json({"msg": 'User edited successfully'});
        });
    });
});

router.delete('/del', function(req, res, next) {
    const results = [];
    // Get a Postgres client from the connection pool
    const data = { uid: req.body.user_id };
    console.log(req.body.user_id);
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
            return res.json({"msg": 'User deleted successfully'});
        });
    });
});

router.get('/search', function(req, res, next) {
    const results = [];
    // Get a Postgres client from the connection pool
    const data = {
        uid: req.body.user_id,
        name: req.body.name,
        date_cr: req.body.date_created
    };

    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Select Data
        const query = client.query("SELECT * FROM users WHERE user_id=($1)", [data.uid]);
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            // console.log(results);
            return res.send(results);
        });
    });
});

module.exports = router;
