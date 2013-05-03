var guests = require('../lib/guests'),
    invs   = require('../lib/invitations');

exports.read = function (req, res, next) {
    res.json(req.invitation);
};

exports.update = function (req, res, next) {
    invs.updateInvitation(req.invitationId, req.body, function (err) {
        if (err) { return next(err); }
        res.send();
    });
};

exports.createGuest = function (req, res, next) {
    next('Not implemented');
};

exports.readGuests = function (req, res, next) {
    res.json(req.invitation.guests);
};
