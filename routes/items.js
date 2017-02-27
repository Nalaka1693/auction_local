var express = require('express');
var pg = require('pg');
var router = express.Router();

// connection string -> 'postgres://<username>:<password>@<server address>:<port>/<database name>'
var connectionString = 'postgres://apsmhjnf:0tJkVFCf8dkcQlQV_qIrepNDFwf4DfcK@echo.db.elephantsql.com:5432/apsmhjnf';

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('items');
});

router.post('/initial', function(req, res, next) {
    const results = [];

    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Select Data
        const query = client.query("SELECT * FROM items");
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

router.post('/add', function(req, res, next) {
    const results = [];
    // Get a Postgres client from the connection pool
    const data = {
        i_id: req.body.item_id,
        name: req.body.item_name,
        decsrip: req.body.description
    };

    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Select Data
        const query = client.query("INSERT INTO items(item_id, item_name, description) values($1, $2, $3)",
            [data.i_id, data.name, data.descrip]);
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            // console.log(results);
            return res.json({"msg": 'Item added successfully'});
        });
    });
});

router.post('/edit', function(req, res, next) {
    const results = [];
    // Get a Postgres client from the connection pool
    const data = {
        i_id: req.body.item_id,
        name: req.body.item_name,
        decsrip: req.body.description
    };

    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Select Data
        const query = client.query("SELECT * FROM items WHERE item_id=($1)", [data.i_id]);
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
        i_id: req.body.item_id,
        name: req.body.item_name,
        decsrip: req.body.description
    };

    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Select Data
        const query = client.query("UPDATE items SET name=($1), description=($2) WHERE item_id=($3)",
            [data.name, data.decsrip, data.i_id]);
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            // console.log(results);
            return res.json({"msg": 'Item edited successfully'});
        });
    });
});

router.delete('/del', function(req, res, next) {
    const results = [];
    // Get a Postgres client from the connection pool
    const data = { i_id: req.body.item_id };

    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Select Data
        const query = client.query("DELETE FROM items WHERE item_id=($1)", [data.i_id]);
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            // console.log(results);
            return res.json({"msg": 'Item deleted successfully'});
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
