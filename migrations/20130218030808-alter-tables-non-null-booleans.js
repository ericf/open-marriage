var async = require('async'),
    dbm   = require('db-migrate'),
    type  = dbm.dataType;

exports.up = function (db, callback) {
    async.series([
        db.runSql.bind(db, 'UPDATE invitations SET rsvp=false WHERE rsvp IS NULL;'),
        db.changeColumn.bind(db, 'invitations', 'rsvp', {defaultValue: false, notNull: true}),

        db.runSql.bind(db, 'UPDATE invitations SET send_paper=true WHERE send_paper IS NULL;'),
        db.changeColumn.bind(db, 'invitations', 'send_paper', {defaultValue: true, notNull: true}),

        db.runSql.bind(db, 'UPDATE invitations SET allow_plusone=false WHERE allow_plusone IS NULL;'),
        db.changeColumn.bind(db, 'invitations', 'allow_plusone', {defaultValue: false, notNull: true}),

        db.runSql.bind(db, 'UPDATE invitations SET has_children=false WHERE has_children IS NULL;'),
        db.changeColumn.bind(db, 'invitations', 'has_children', {defaultValue: false, notNull: true}),

        db.runSql.bind(db, 'UPDATE guests SET is_plusone=false WHERE is_plusone IS NULL;'),
        db.changeColumn.bind(db, 'guests', 'is_plusone', {defaultValue: false, notNull: true})
    ], callback);
};

exports.down = function (db, callback) {
    async.series([
        db.changeColumn.bind(db, 'invitations', 'rsvp',          {defaultValue: false, notNull: false}),
        db.changeColumn.bind(db, 'invitations', 'send_paper',    {defaultValue: true,  notNull: false}),
        db.changeColumn.bind(db, 'invitations', 'allow_plusone', {defaultValue: false, notNull: false}),
        db.changeColumn.bind(db, 'invitations', 'has_children',  {defaultValue: false, notNull: false}),
        db.changeColumn.bind(db, 'guests',      'is_plusone',    {defaultValue: false, notNull: false})
    ], callback);
};
