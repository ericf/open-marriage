var async  = require('async'),
    crypto = require('crypto'),
    pg     = require('pg'),

    config = require('../config'),

    INVITATIONS       = 'SELECT * FROM invitations ORDER BY id',
    INVITATION_BY_ID  = 'SELECT * FROM invitations WHERE id=$1 LIMIT 1',
    INVITATION_GUESTS = 'SELECT * FROM guests WHERE invitation_id=$1 ORDER BY id',
    UPDATE_INVITATION = 'UPDATE invitations SET $UPDATES WHERE id=$1',

    UPDATE_SCHEMEA = {
        address: true,
        rsvpd  : true
    };

exports.encipherId = encipherId;
exports.decipherId = decipherId;

exports.loadInvitation   = loadInvitation;
exports.loadInvitations  = loadInvitations;
exports.updateInvitation = updateInvitation;

function encipherId(id) {
    var cipher = crypto.createCipher('bf', config.invitationSecret);
    cipher.update(String(id), 'utf8', 'hex');
    return cipher.final('hex');
}

function decipherId(encipheredId) {
    var decipher = crypto.createDecipher('bf', config.invitationSecret);

    // TODO: Remove Buffer once bug is fixed:
    // https://github.com/joyent/node/pull/5725
    decipher.update(new Buffer(encipheredId, 'hex'), 'utf8');

    return decipher.final('utf8');
}

function loadInvitation(id, callback) {
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
}

function loadInvitations(callback) {
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
}

function updateInvitation(id, changes, callback) {
    var values  = [id],
        updates = [],
        query;

    Object.keys(UPDATE_SCHEMEA).forEach(function (col) {
        if (col in changes) {
            updates.push(col + '=$' + values.push(changes[col]));
        }
    });

    query = UPDATE_INVITATION.replace('$UPDATES', updates.join(', '));

    pg.connect(config.database, function (err, db, done) {
        if (err) { return callback(err); }

        db.query(query, values, function (err, results) {
            done();
            callback(err, results && results.rows[0]);
        });
    });
}
