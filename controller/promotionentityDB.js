var express = require('express');
var app = express();
let middleware = require('./middleware');
var multer = require('multer');

// Configure multer for image upload
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './view/img/products/');
    },
    filename: function (req, file, cb) {
        cb(null, req.body.sku + '.jpg');
    }
});
var upload = multer({ storage: storage });

// Import Promotion DB
const promotionDB = require('../model/promotionModel.js');

// Get all promotions
app.get('/api/getAllPromotions', function (req, res) {
    promotionDB.getAllPromotions()
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            console.error('Error fetching promotions:', err);
            res.status(500).send('Failed to fetch promotions');
        });
});

// Get promotion by ID
app.get('/api/getPromotionById', function (req, res) {
    var promotionId = req.query.promotionId;

    if (!promotionId) {
        return res.status(400).send("Promotion ID is required");
    }

    promotionDB.getPromotionById(promotionId)
        .then((result) => {
            if (!result) {
                return res.status(404).send("Promotion not found");
            }
            res.json(result);
        })
        .catch((err) => {
            console.error('Error fetching promotion by ID:', err);
            res.status(500).send("Failed to get promotion by ID");
        });
});

// Add a new promotion
app.post('/api/addPromotion', upload.single('imgfile'), function (req, res) {
    var name = req.body.name;
    var description = req.body.description;
    var discountRate = req.body.discountRate;
    var endDate = req.body.endDate;

    var data = {
        name: name,
        description: description,
        discountRate: discountRate,
        endDate: endDate,
        imageURL: '/img/promotions/' + req.file.filename
    };

    promotionDB.addPromotion(data)
        .then((result) => {
            res.redirect('/promotionManagement_Add.html?goodMsg=Promotion added successfully.');
        })
        .catch((err) => {
            console.error('Error adding promotion:', err);
            res.status(500).send("Failed to add promotion");
        });
});

module.exports = app;
