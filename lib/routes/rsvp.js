var invs = require('../services/invitations');

exports.login = function (req, res, next) {
    var invitationId;

    try {
        invitationId = invs.decipherId(req.params.invitation);
    } catch (ex) {
        delete req.session.invitation;
        return res.send(401);
    }

    req.session.invitation = invitationId;
    res.redirect('/rsvp/');
},

exports.edit = function (req, res, next) {
    var invitationId = req.session.invitation;

    if (!invitationId) {
        return res.render('rsvp/description');
    }

    invs.loadInvitation(invitationId, function (err, invitation) {
        if (err) { return next(err); }

        if (!invitation) {
            return res.send(404, 'Could not find invitation.');
        }

        res.render('rsvp/edit', {
            csrf      : req.session._csrf,
            invitation: invitation
        });
    });
};
