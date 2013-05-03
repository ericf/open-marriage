var pg = require('pg'),

    config = require('../config'),

    GUEST_BY_ID  = 'SELECT * FROM guests WHERE id=$1 LIMIT 1',
    UPDATE_GUEST = 'UPDATE guests SET is_attending=true WHERE id=$1';

exports.loadGuest = function (id, callback) {
    pg.connect(config.database, function (err, db, done) {
        if (err) { return callback(err); }

        db.query(GUEST_BY_ID, [id], function (err, results) {
            done();
            callback(err, results && results.rows[0]);
        });
    });
};

exports.updateGuest = function (id, changes, callback) {
    pg.connect(config.database, function (err, db, done) {
        if (err) { return callback(err); }

        db.query(UPDATE_GUEST, [id], function (err, results) {
            done();
            callback(err, results && results.rows[0]);
        });
    });
};
