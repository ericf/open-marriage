var STATUS_CODES = require('http').STATUS_CODES,

    invs = require('../lib/invitations');

exports.login = [invIdFromUrl, loadInvitation, setSessionInvId];
exports.edit  = [invIdFromSession, loadInvitation, renderInvitation];

function invIdFromSession(req, res, next) {
    var invitationId = req.session.invitation;

    if (invitationId) {
        req.invitationId = invitationId;
        next();
    } else {
        return res.render('rsvp/description');
    }
}

function invIdFromUrl(req, res, next) {
    var invitationId;

    try {
        invitationId = invs.decipherId(req.params.invitation);
    } catch (ex) {
        delete req.session.invitation;
        return res.status(401).render('error', {status: STATUS_CODES[401]});
    }

    req.invitationId = invitationId;
    next();
}

function loadInvitation(req, res, next) {
    invs.loadInvitation(req.invitationId, function (err, invitation) {
        if (err) { return next(err); }

        if (!invitation) {
            res.locals.message = 'Could not find invitation.';
            return res.status(404).render('error', {status: STATUS_CODES[404]});
        }

        req.invitation = invitation;
        next();
    });
}

function renderInvitation(req, res) {
    res.render('rsvp/edit', {
        csrf      : req.session._csrf,
        invitation: req.invitation
    });
}

function setSessionInvId(req, res) {
    req.session.invitation = req.invitationId;
    res.redirect('/rsvp/');
}
