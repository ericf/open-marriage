var async = require('async'),
    dbm   = require('db-migrate'),
    type  = dbm.dataType;

exports.up = function (db, callback) {
    db.addColumn('guests', 'is_attending_brunch', {
        type        : 'boolean',
        defaultValue: true,
        notNull     : true
    }, callback);
};

exports.down = function (db, callback) {
    db.removeColumn('guests', 'is_attending_brunch', callback);
};
