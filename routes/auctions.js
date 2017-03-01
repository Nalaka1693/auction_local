var express = require('express');
var pg = require('pg');
var router = express.Router();

// connection string -> 'postgres://<username>:<password>@<server address>:<port>/<database name>'
var connectionString = 'postgres://apsmhjnf:0tJkVFCf8dkcQlQV_qIrepNDFwf4DfcK@echo.db.elephantsql.com:5432/apsmhjnf';

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('auctions');
});

router.get('/initial', function(req, res, next) {
    const results = [];

    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Insert Data
        const query = client.query("SELECT * FROM auction");

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

router.post('/new', function(req, res, next) {
    const results = [];
    // Get a Postgres client from the connection pool

    const data = {
        auc_id: req.body.auction_id,
        descrip: req.body.description,
        name: req.body.name,
        due_date: req.body.due_date,
        s_time: req.body.start_time,
        e_time: req.body.end_time,
        date_cr: req.body.date_created,
        cr_user: req.body.created_by,
        vendors: req.body.vendors,
        items: req.body.items
    };
    console.log(data);
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        var date = new Date();
        var curr_date = date.getFullYear() +'-'+ date.getMonth() +'-'+ date.getDate();

        // SQL Query > Insert Data
        const query = client.query("INSERT INTO auction(auction_id, description, name, due_date, start_time, end_time, date_created, created_by) " +
            "values($1, $2, $3, $4, $5, $6, $7, $8)",
            [data.auc_id, data.descrip, data.name, data.due_date, data.s_time, data.e_time, curr_date, data.cr_user]);

        data.vendors.forEach(function (vendor) {
            client.query("INSERT INTO auction_vendors (auction_id, vendor_id) values ($1, $2)", [data.auc_id, vendor]);
        });

        data.items.forEach(function (item) {
            client.query("INSERT INTO auction_items (auction_id, item_id) values ($1, $2)", [data.auc_id, item]);
        });


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

router.post('/edit', function(req, res, next) {
    const auc_data = [];
    const items = [];
    const  vendors = [];

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
        // SQL Query > Select Data
        var query = client.query("SELECT * FROM auction WHERE auction_id=($1)", [data.auc_id]);
        query.on('row', function(row) {
            auc_data.push(row);
        });

        query = client.query("SELECT user_id, fname, lname FROM users WHERE user_id in (SELECT user_id FROM auction_vendors WHERE auction_id=($1))", [data.auc_id]);
        query.on('row', function(row) {
            vendors.push(row);
        });

        query = client.query("SELECT item_id, item_name FROM items WHERE item_id in (SELECT item_id FROM auction_items WHERE auction_id=($1)", [data.auc_id]);
        query.on('row', function(row) {
            items.push(row);
        });

        var results = {
            decrip: auc_data[0].description,
            name: auc_data[0].name,
            due_date: auc_data[0].due_date,
            start_time: auc_data[0].start_time,
            end_time: auc_data[0].end_time,
            date_created: auc_data[0].date_created,
            created_by: auc_data[0].created_by,
            vendors: vendors,
            items: items
        };

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });
});

router.post('/edit/confirm', function(req, res, next) {
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
        cr_user: req.body.created_by
    };

    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Update Data
        const query = client.query("UPDATE auction SET description=($2), name=($3), due_date=($4), start_time=($5), " +
            "end_time=($6), date_created=($7), created_by=($8) WHERE auction_id=($1)",
            [data.auc_id, data.descrip, data.name, data.due_date, data.s_time, data.e_time, data.date_cr, data.cr_user]);
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            // console.log(results);
            return res.json({"msg": 'Auction edited successfully'});
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
        // SQL Query > Delete Data
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
            return res.json({"msg": 'Auction deleted successfully'});
        });
    });
});

router.get('/search', function(req, res, next) {
    const results = [];
    // Get a Postgres client from the connection pool
    const data = {
        auc_id: req.body.auction_id,
        name: req.body.name,
        due_date: req.body.due_date
    };

    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Insert Data
        const query = client.query("SELECT * FROM auction");
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

router.get('/initial', function(req, res, next) {
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
        const query = client.query("SELECT auction_id,name,due_date FROM AUCTION");
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

module.exports = router;
