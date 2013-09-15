var pg = require('pg'),

    config = require('../config'),

    GUEST_BY_ID    = 'SELECT * FROM guests WHERE id=$1 LIMIT 1',
    GUEST_BY_EMAIL = 'SELECT * FROM guests WHERE email=$1 LIMIT 1',
    UPDATE_GUEST   = 'UPDATE guests SET $UPDATES WHERE id=$1',

    UPDATE_SCHEMA = {
        title              : true,
        name               : true,
        is_attending       : true,
        is_attending_brunch: true,
        meal               : true
    };

exports.MEALS = [
    {id: 'seafood', label: 'Crab Cakes'},
    {id: 'beef',    label: 'Bistro Beef'},
    {id: 'veggie',  label: 'Stuffed Portobello'}
];

exports.loadGuest        = loadGuest;
exports.loadGuestByEmail = loadGuestByEmail;
exports.updateGuest      = updateGuest;

function runQuery(query, values, callback) {
    pg.connect(config.database, function (err, db, done) {
        if (err) { return callback(err); }

        db.query(query, values, function (err, results) {
            done();
            callback(err, results && results.rows[0]);
        });
    });
}

function loadGuest(id, callback) {
    runQuery(GUEST_BY_ID, [id], callback);
}

function loadGuestByEmail(email, callback) {
    runQuery(GUEST_BY_EMAIL, [email], callback);
}

function updateGuest(id, changes, callback) {
    var values  = [id],
        updates = [],
        query;

    Object.keys(UPDATE_SCHEMA).forEach(function (col) {
        if (col in changes) {
            updates.push(col + '=$' + values.push(changes[col]));
        }
    });

    query = UPDATE_GUEST.replace('$UPDATES', updates.join(', '));

    runQuery(query, values, callback);
}
