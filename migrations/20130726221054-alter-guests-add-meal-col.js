var async = require('async'),
    dbm   = require('db-migrate'),
    type  = dbm.dataType;

exports.up = function (db, callback) {
    async.series([
        db.addColumn.bind(db, 'guests', 'meal', {
            type  : 'string',
            length: 8
        }),

        db.runSql.bind(db,
            "ALTER TABLE guests " +
            "ADD CONSTRAINT meal CHECK (meal IN ('seafood', 'beef', 'veggie'));")
    ], callback);
};

exports.down = function (db, callback) {
    db.removeColumn('guests', 'meal', callback);
};
