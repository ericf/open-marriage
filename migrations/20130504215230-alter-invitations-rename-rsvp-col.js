var dbm  = require('db-migrate'),
    type = dbm.dataType;

exports.up = function (db, callback) {
    db.renameColumn('invitations', 'rsvp', 'rsvpd', callback);
};

exports.down = function (db, callback) {
    db.renameColumn('invitations', 'rsvpd', 'rsvp', callback);
};
