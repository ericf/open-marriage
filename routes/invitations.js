var email  = require('../lib/email'),
    invs   = require('../lib/invitations'),
    utils  = require('../lib/utils'),

    extend = utils.extend;

exports.read       = read;
exports.update     = update;
exports.readGuests = readGuests;
exports.confirm    = confirm;

function read(req, res, next) {
    res.json(req.invitation);
}

function update(req, res, next) {
    var updates = extend({}, req.body, {rsvpd: true});

    invs.updateInvitation(req.invitation.id, updates, function (err) {
        if (err) { return next(err); }
        res.send(204);
    });
}

function readGuests(req, res, next) {
    res.json(req.invitation.guests);
}

function confirm(req, res, next) {
    email.sendConfirm(req.invitation, function (err) {
        if (err) { return next(err); }
        res.send(204);
    });
}
