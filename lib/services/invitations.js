var async  = require('async'),
    crypto = require('crypto'),
    pg     = require('pg'),

    config = require('../../config'),

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
    function processResults(err, results) {
        if (err) { return callback(err); }

        var invitation = results.invitation.rows[0];

        if (invitation) {
            invitation.guests = results.guests.rows;
        }

        callback(null, invitation);
    }

    pg.connect(config.database, function (err, db, done) {
        if (err) { return callback(err); }

        async.parallel({
            invitation: db.query.bind(db, INVITATION_BY_ID, [id]),
            guests    : db.query.bind(db, INVITATION_GUESTS, [id])
        }, function () {
            done();
            processResults.apply(null, arguments);
        });
    });
};

exports.updateInvitation = function (id, changes, callback) {
    pg.connect(config.database, function (err, db, done) {
        if (err) { return callback(err); }

        db.query(UPDATE_INVITATION, [id], function () {
            done();
            callback.apply(null, arguments);
        });
    });
};
