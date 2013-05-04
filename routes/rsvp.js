var STATUS_CODES = require('http').STATUS_CODES,

    invs = require('../lib/invitations');

exports.login = function (req, res, next) {
    var invitationId;

    try {
        invitationId = invs.decipherId(req.params.invitation_key);
    } catch (ex) {
        delete req.session.invitation;
        return res.status(401).render('error', {status: STATUS_CODES[401]});
    }

    invs.loadInvitation(invitationId, function (err, invitation) {
        if (err || !invitation) {
            delete req.session.invitation;
            return next(err);
        }

        req.session.invitation = invitationId;
        res.redirect('/rsvp/');
    });
};

exports.edit = function (req, res) {
    if (!req.invitation) {
        return res.render('rsvp/public');
    }

    res.render('rsvp/edit');
};
