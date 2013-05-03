var STATUS_CODES = require('http').STATUS_CODES,
    NOT_FOUND    = STATUS_CODES[404],
    UNAUTHORIZED = STATUS_CODES[401],

    guests         = require('../lib/guests'),
    loadInvitation = require('./invitation');

exports.ensureInvitation = [checkInvitation, loadInvitation, isAuthorized];
exports.ensureGuest      = [loadGuest, checkInvitation, isAuthorized];

function checkInvitation(req, res, next) {
    var invitationId = req.params.invitation || req.invitationId;

    if (invitationId && invitationId === req.session.invitation) {
        req.invitationId = invitationId;
        req.isAuthorized = true;
    } else {
        req.isAuthorized = false;
    }

    next();
}

function isAuthorized(req, res, next) {
    if (req.isAuthorized) {
        return next();
    }

    res.status(401).format({
        'html': function () {
            res.render('error', {status: UNAUTHORIZED});
        },

        'json': function () {
            res.json({status: UNAUTHORIZED});
        },

        'text': function () {
            res.send(UNAUTHORIZED);
        }
    });
}

function loadGuest(req, res, next) {
    guests.loadGuest(req.params.guest, function (err, guest) {
        if (err) { return next(err); }

        if (guest) {
            req.guest        = guest;
            req.invitationId = guest.invitation_id.toString();
            return next();
        }

        res.locals.message = 'Could not find guest.';
        res.status(404).format({
            'html': function () {
                res.render('error', {status: NOT_FOUND});
            },

            'json': function () {
                res.json({status: NOT_FOUND});
            },

            'text': function () {
                res.send(NOT_FOUND);
            }
        });
    });
}
