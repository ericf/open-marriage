var error = require('../lib/utils').error;

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
        next();
    } else {
        next(error(401));
    }
}
