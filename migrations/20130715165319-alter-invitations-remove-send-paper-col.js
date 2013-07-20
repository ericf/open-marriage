var dbm  = require('db-migrate'),
    type = dbm.dataType;

exports.up = function (db, callback) {
    db.removeColumn('invitations', 'send_paper', callback);
};

exports.down = function (db, callback) {
    db.addColumn('invitations', 'send_paper', {
        type        : 'boolean',
        defaultValue: true,
        notNull     : true
    }, callback);
};
