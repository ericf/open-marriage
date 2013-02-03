var async  = require('async'),
    crypto = require('crypto'),
    pg     = require('pg'),

    config = require('../../config'),

    INVITATION_BY_ID       = 'SELECT * FROM invitations WHERE id=$1 LIMIT 1',
    GUEST_BY_INVITATION_ID = 'SELECT * FROM guests WHERE invitation_id=$1';

function decipherInvitationId(enciphered) {
    var decipher = crypto.createDecipher('bf', config.secrets.invitation);
    decipher.update(enciphered, 'hex', 'utf8');
    return decipher.final('utf8');
}

function loadInvitation(id, callback) {
    function processResults(err, results) {
        if (err) { return callback(err); }

        var invitation = results.invitation.rows[0];

        if (invitation) {
            invitation.guests = results.guests.rows;
        }

        callback(null, invitation);
    }

    pg.connect(config.database, function(err, db) {
        if (err) { return callback(err); }

        async.parallel({
            invitation: function (callback) {
                db.query(INVITATION_BY_ID, [id], callback);
            },

            guests: function (callback) {
                db.query(GUEST_BY_INVITATION_ID, [id], callback);
            }
        }, processResults);
    });
}

exports.invitation = function (req, res, next) {
    var id;

    try {
        id = decipherInvitationId(req.params.invitation);
    } catch (ex) {
        return res.send(400, 'Invalid invitation.');
    }

    loadInvitation(id, function (err, invitation) {
        if (err) { return next(err); }

        if (!invitation) {
            return res.send(404, 'Could not find invitation.');
        }

        res.render('rsvp/invitation', {
            invitation: invitation
        });
    });
};
