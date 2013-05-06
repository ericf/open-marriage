var invs   = require('../lib/invitations'),
    utils  = require('../lib/utils'),

    extend = utils.extend;

exports.read = function (req, res, next) {
    res.json(req.invitation);
};

exports.update = function (req, res, next) {
    var updates = extend({}, req.body, {rsvpd: true});

    invs.updateInvitation(req.invitation.id, updates, function (err) {
        if (err) { return next(err); }
        res.send(204);
    });
};

exports.readGuests = function (req, res, next) {
    res.json(req.invitation.guests);
};
