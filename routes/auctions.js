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

router.get('/current', function(req, res, next) {
    const results = [];

    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Select Data // edit for current auctions
        const query = client.query("SELECT * FROM auction");
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
        cr_user: req.body.created_by,
        vendors: req.body.vendors,
        items: req.body.items,
        item_val : req.body.item_value
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
            client.query("INSERT INTO auction_vendors (auction_id, user_id) values ($1, $2)", [data.auc_id, vendor]);
        });

        data.items.forEach(function (item) {
            client.query("INSERT INTO auction_items (auction_id, item_id) values ($1, $2)", [data.auc_id, item]);
        });

        data.item_val.forEach(function (ival) {
            client.query("INSERT INTO bid (auction_id,item_id,vendor_id,time,bid_amount) VALUES ($1,$2,$3,$4,$5)",
                [data.auc_id,ival.item_id,data.cr_user,getTime(),ival.value]);
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
    console.log(data);
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Select Data
        var query1 = client.query("SELECT * FROM auction WHERE auction_id=($1)", [data.auc_id]);
        query1.on('row', function(row) {
            auc_data.push(row);
        });

        var query2 = client.query("SELECT user_id, lname, fname FROM users WHERE user_id in (SELECT user_id FROM auction_vendors WHERE auction_id=($1))", [data.auc_id]);
        query2.on('row', function(row) {
            vendors.push(row);
        });

        var query3 = client.query("SELECT item_id, item_name FROM items WHERE item_id in (SELECT item_id from auction_items WHERE auction_id=($1))", [data.auc_id]);
        query3.on('row', function(row) {
            items.push(row);
        });

        // After all data is returned, close connection and return results
        query3.on('end', function() {
            done();
            auc_data.push(vendors);
            auc_data.push(items);
            return res.json(auc_data);
        });
    });
});

router.post('/edit/confirm', function(req, res, next) {
    const results = [];
    // Get a Postgres client from the connection pool
    const data = {
        auc_id: req.body.auction_id,
        descrip: req.body.description,
        name: req.body.name,
        due_date: req.body.due_date,
        s_time: req.body.start_time,
        e_time: req.body.end_time,
        cr_user: req.body.created_by,
        vendors: req.body.vendors,
        items: req.body.items,
        item_val: req.body.item_value
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

        // SQL Query > Update Data
        var query = client.query("UPDATE auction SET description=($2), name=($3), due_date=($4), start_time=($5), " +
            "end_time=($6), date_created=($7), created_by=($8) WHERE auction_id=($1)",
            [data.auc_id, data.descrip, data.name, data.due_date, data.s_time, data.e_time, curr_date, req.session.userID]);

        data.vendors.forEach(function (vendor) {
            console.log('vendor');
            client.query("UPDATE auction_vendors SET user_id=($1) WHERE auction_id=($2)", [vendor, data.auc_id]);
        });

        data.items.forEach(function (item) {
            console.log('item');
            client.query("UPDATE auction_items SET item_id=($1) WHERE auction_id=($2)", [item, data.auc_id]);
        });

        data.item_val.forEach(function (ival) {
            console.log('val');
            query = client.query("UPDATE bid SET item_id=($1) ,vendor_id=($2), time=($3), bid_amount=($4) WHERE auction_id=($5)",
                [ival.item_id, data.cr_user, getTime(), ival.value, data.auc_id]);
        });

        // Stream results back one row at a time
        query.on('row', function(row) {
            console.log('row');
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

router.post('/del', function(req, res, next) {
    const results = [];
    // Get a Postgres client from the connection pool
    const data = { uid: req.body.auction_id};

    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Delete Data

        const query1 = client.query("DELETE FROM auction_items WHERE auction_id=($1)",[data.uid]);
        const query2 = client.query("DELETE FROM auction_vendors WHERE auction_id=($1)",[data.uid]);
        const query3 = client.query("DELETE FROM bid WHERE auction_id=($1)",[data.uid]);
        const query = client.query("DELETE FROM auction WHERE auction_id=($1)", [data.uid]);

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
