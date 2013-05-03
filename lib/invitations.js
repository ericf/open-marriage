var async  = require('async'),
    crypto = require('crypto'),
    pg     = require('pg'),

    config = require('../config'),

    INVITATIONS       = 'SELECT * FROM invitations ORDER BY id',
    INVITATION_BY_ID  = 'SELECT * FROM invitations WHERE id=$1 LIMIT 1',
    INVITATION_GUESTS = 'SELECT * FROM guests WHERE invitation_id=$1',
    UPDATE_INVITATION = 'UPDATE invitations SET rsvp=true WHERE id=$1';

exports.encipherId = function (id) {
    var cipher = crypto.createCipher('bf', config.secrets.invitation);
    cipher.update(String(id), 'utf8', 'hex');
    return cipher.final('hex');
};

exports.decipherId = function (encipheredId) {
    var decipher = crypto.createDecipher('bf', config.secrets.invitation);
    decipher.update(encipheredId, 'hex', 'utf8');
    return decipher.final('utf8');
};

exports.loadInvitation = function (id, callback) {
    function processResults(results, callback) {
        var invitation = results.invitation.rows[0];

        if (invitation) {
            invitation.guests = results.guests.rows;
        }

        callback(null, invitation);
    }

    pg.connect(config.database, function (err, db, done) {
        if (err) { return callback(err); }

        async.waterfall([
            async.parallel.bind(null, {
                invitation: db.query.bind(db, INVITATION_BY_ID, [id]),
                guests    : db.query.bind(db, INVITATION_GUESTS, [id])
            }),

            processResults
        ], function () {
            done();
            callback.apply(null, arguments);
        });
    });
};

exports.loadInvitations = function (callback) {
    function processInvitation(db, invitation, callback) {
        db.query(INVITATION_GUESTS, [invitation.id], function (err, results) {
            if (err) { return callback(err); }

            invitation.guests = results.rows;
            callback(null, invitation);
        });
    }

    function processInvitations(db, results, callback) {
        async.map(results.rows, processInvitation.bind(null, db), callback);
    }

    pg.connect(config.database, function (err, db, done) {
        if (err) { return callback(err); }

        async.waterfall([
            db.query.bind(db, INVITATIONS),
            processInvitations.bind(null, db)
        ], function () {
            done();
            callback.apply(null, arguments);
        });
    });
};

exports.updateInvitation = function (id, changes, callback) {
    pg.connect(config.database, function (err, db, done) {
        if (err) { return callback(err); }

        db.query(UPDATE_INVITATION, [id], function (err, results) {
            done();
            callback(err, results && results.rows[0]);
        });
    });
};
