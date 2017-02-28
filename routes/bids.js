var express = require('express');
var pg = require('pg');
var router = express.Router();

// connection string -> 'postgres://<username>:<password>@<server address>:<port>/<database name>'
var connectionString = 'postgres://apsmhjnf:0tJkVFCf8dkcQlQV_qIrepNDFwf4DfcK@echo.db.elephantsql.com:5432/apsmhjnf';

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('bids');
});

router.post('/add', function(req, res, next) {
    const results = [];
    // Get a Postgres client from the connection pool
    const data = {
        auc_id: req.body.auction_id
    };

    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        // SQL Query > Insert Data
        var query = client.query("SELECT item_id, MIN(bid_amount) FROM bid WHERE auction_id=($1) GROUP BY item_id", [data.auc_id]);

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            // console.log(results);
            return res.json(results);
        });
    });
});

router.post('/add/confirm', function(req, res, next) {
    const results = [];
    // Get a Postgres client from the connection pool
    const data = {
        bid_id: req.body.bid_id,
        auc_id: req.body.auction_id,
        i_id: req.body.item_id,
        ven_id: req.body.vendors_id,
        time: req.body.time,
        bid_amnt: req.body.bid_amount
    };

    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        var curr_time = getTime();

        // SQL Query > Insert Data
        for (var i = 0; i < data.i_id.length; ++i) {
            client.query("INSERT INTO bid(auction_id, item_id, vendor_id, time, bid_amount) values($1, $2, $3, $4, $5)",
                [data.auc_id, data.i_id[i], data.ven_id, curr_time, data.bid_amnt[i]]);
        }

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            // console.log(results);
            return res.json({"msg": 'Bid added successfully'});
        });
    });
});

function getTime() {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    return  hour + ":" + min + ":" + sec;
}

module.exports = router;
