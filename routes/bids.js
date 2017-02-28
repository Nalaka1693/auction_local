var express = require('express');
var pg = require('pg');
var router = express.Router();

// connection string -> 'postgres://<username>:<password>@<server address>:<port>/<database name>'
var connectionString = 'postgres://apsmhjnf:0tJkVFCf8dkcQlQV_qIrepNDFwf4DfcK@echo.db.elephantsql.com:5432/apsmhjnf';

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('bids');
});

router.post('/add2 ', function(req, res, next) {
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

        // SQL Query > Insert Data
        const query = client.query("INSERT INTO bid(bid_id, auction_id, item_id, vendor_id, time, bid_amount) " +
            "values($1, $2, $3, $4, $5, $6)",
            [data.bid_id, data.auc_id, data.name, data.due_date, data.s_time, data.e_time, data.date_cr, data.cr_user]);

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            // console.log(results);
            return res.json({"msg": 'Auction added successfully'});
        });
    });
});

module.exports = router;
