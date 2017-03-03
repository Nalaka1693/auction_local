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



router.post('/getlatest', function(req, res, next) {
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
        var query = client.query("SELECT DISTINCT ON (m.item_id) m.item_id, m.vendor_id, t.min " +
            "FROM (" +
                "SELECT item_id, MIN(bid_amount) AS  min " +
                "FROM bid WHERE auction_id=($1) " +
                "GROUP BY item_id " +
                ") t JOIN bid m ON m.item_id=t.item_id AND t.min=m.bid_amount", [data.auc_id]);

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            console.log(results);
            return res.json(results);
        });
    });
});


router.get('/test', function(req, res, next) {
    const results = [];
    // Get a Postgres client from the connection pool


    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        // SQL Query > Insert Data
        var query = client.query("SELECT * FROM bid");
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
        auc_id: req.body.auction_id,
        i_id: req.body.item_id,
        ven_id: req.body.vendors_id,
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

        var query;

        // SQL Query > Insert Data
        for (var i = 0; i < data.i_id.length; ++i) {
            query = client.query("INSERT INTO bid(auction_id, item_id, vendor_id, time, bid_amount) values($1, $2, $3, $4, $5)",
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

router.post('/history', function(req, res, next) {
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
        var query = client.query("SELECT item_id, bid_amount FROM bid GROUP BY vendor_id, time LIMIT 20");

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
