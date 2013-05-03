var STATUS_CODES = require('http').STATUS_CODES,
    NOT_FOUND    = STATUS_CODES[404],
    UNAUTHORIZED = STATUS_CODES[401];

exports.ensureInvitation = [checkInvitation, isAuthorized];
exports.ensureGuest      = [checkGuest, isAuthorized];

function checkGuest(req, res, next) {
    var invitation = req.invitation,
        guestId    = req.params.guest,
        guest;

    if (!invitation) {
        req.isAuthorized = false;
        return next();
    }

    invitation.guests.some(function (g) {
        if (g.id.toString() === guestId) {
            guest = g;
            return true;
        }
    });

    req.guest        = guest;
    req.isAuthorized = guest && guest.invitation_id === invitation.id;

    next();
}

function checkInvitation(req, res, next) {
    var invitation   = req.invitation,
        invitationId = req.params.invitation;

    req.isAuthorized = invitation && invitation.id.toString() === invitationId;

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
