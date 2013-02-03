var dbm  = require('db-migrate'),
    type = dbm.dataType;

exports.up = function (db, callback) {
    db.createTable('guests', {
        columns: {
            id: {
                autoIncrement: true,
                primaryKey   : true,
                type         : 'int'
            },

            invitation_id: 'int',

            title: {type: 'string', length: 8},
            name : {type: 'string', length: 64},
            email: {type: 'string', length: 128},

            is_attending: 'boolean',
            is_plusone  : {type: 'boolean', defaultValue: false}
        },

        ifNotExists: true
    }, function (err) {
        if (err) { return callback(err); }

        db.runSql(
            'ALTER TABLE guests ' +
            'ADD FOREIGN KEY (invitation_id) REFERENCES invitations;', callback);
    });
};

exports.down = function (db, callback) {
    db.dropTable('guests', {ifExists: true}, callback);
};
