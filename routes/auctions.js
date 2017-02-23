var express = require('express');
var pg = require('pg');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('auctions');
});

router.post('/new', function(req, res, next) {
    const results = [];
    // Get a Postgres client from the connection pool
    const data = {
        auc_id: req.body.auction_id,
        descrip: req.body.descrip,
        name: req.body.name,
        due_date: req.body.due_date,
        s_time: req.body.s_time,
        e_time: req.body.e_time,
        date_cr: req.body.date_created,
        cr_user: req.body.password
    };

    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Select Data
        const query = client.query("INSERT INTO auction(auction_id, description, name, due_date, start_time, end_time, date_created, created_by) values($1, $2, $3, $4, $5, $6, $7, $8)",
            [data.auc_id, data.descrip, data.name, data.due_date, data.s_time, data.e_time, data.date_cr, data.cr_user]);
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            // console.log(results);
            return res.send('Auction added successfully');
        });
    });
});

router.post('/edit', function(req, res, next) {
    const results = [];
    // Get a Postgres client from the connection pool
    const data = {
        auc_id: req.body.auction_id,
        descrip: req.body.descrip,
        name: req.body.name,
        due_date: req.body.due_date,
        s_time: req.body.s_time,
        e_time: req.body.e_time,
        date_cr: req.body.date_created,
        cr_user: req.body.password
    };

    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Select Data
        const query = client.query("UPDATE auction SET auction_id=($1), description=($2), name=($3), due_date=($4), start_time=($5), end_time=($6), date_created=($7), created_by=($8)",
            [data.auc_id, data.descrip, data.name, data.due_date, data.s_time, data.e_time, data.date_cr, data.cr_user]);
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            // console.log(results);
            return res.send('Auction edited successfully');
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
        const query = client.query("DELETE FROM auctions WHERE auction_id=($1)", [data.uid]);
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            // console.log(results);
            // return res.json(results[0].password);
            return res.send('Auction deleted successfully');
        });
    });
});

module.exports = router;
