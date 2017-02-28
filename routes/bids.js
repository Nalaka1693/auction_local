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
    const data = {
        auc_id: req.body.auction_id
    };

    console.log(data);

    const result = [{"item_name": "ITM_1", "bid": "75"}, {"item_name": "ITM_2", "bid": "45"},{"item_name": "ITM_3", "bid": "4589"} ,{"item_name": "ITM_4", "bid": "21654"} ,{"item_name": "ITM_5", "bid": "7842"}];

    if (data.auc_id == "AUC001"){
        console.log(result);
        return res.json(result);
    }
});

module.exports = router;
