var db = require('./databaseConfig.js');
var Promotion = require('./promotion.js');

var promotionDB = {
    getAllPromotions: function () {
        return new Promise((resolve, reject) => {
            var conn = db.getConnection();
            conn.connect((err) => {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                var sql = 'SELECT ID, DESCRIPTION, DISCOUNTRATE, ENDDATE, IMAGEURL FROM promotionentity';
                conn.query(sql, (err, results) => {
                    if (err) {
                        conn.end();
                        return reject(err);
                    }
                    conn.end();
                    resolve(results);
                });
            });
        });
    },

    getPromotionById: function (id) {
        return new Promise((resolve, reject) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                } else {
                    var sql = 'SELECT ID as id, DESCRIPTION as description, DISCOUNTRATE as discountRate, ENDDATE as endDate, IMAGEURL as imageURL FROM promotionentity WHERE ID = ?';
                    conn.query(sql, [id], function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            if (result.length === 0) {
                                conn.end();
                                return resolve(null);
                            }
                            var promo = new Promotion();
                            promo.id = result[0].id;
                            promo.description = result[0].description;
                            promo.discountRate = result[0].discountRate;
                            promo.endDate = result[0].endDate;
                            promo.imageURL = result[0].imageURL;
                            conn.end();
                            return resolve(promo);
                        }
                    });
                }
            });
        });
    }
};

module.exports = promotionDB;