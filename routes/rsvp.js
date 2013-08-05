var error        = require('../lib/utils').error,
    sendRsvpLink = require('../lib/email').sendRsvpLink,
    invs         = require('../lib/invitations'),
    guests       = require('../lib/guests');

exports.pub    = pub;
exports.resend = resend;
exports.login  = login;
exports.edit   = edit;

function pub(req, res, next) {
    if (req.invitation) {
        return next();
    }

    res.locals.resent = req.session.resent;
    delete req.session.resent;

    res.render('rsvp/public');
}

function resend(req, res, next) {
    var email = req.body.email.trim();

    if (!email) {
        req.session.resent = {needsEmail: true};
        return res.redirect('/rsvp/');
    }

    guests.loadGuestByEmail(email, function (err, guest) {
        if (err) { return next(err); }

        if (!guest) {
            req.session.resent = {notGuest: email};
            return res.redirect('/rsvp/');
        }

        invs.loadInvitation(guest.invitation_id, function (err, invitation) {
            if (err) { return next(err); }

            sendRsvpLink(invitation, {
                guest : guest,
                resend: true
            }, function (err) {
                if (err) { return next(err); }

                req.session.resent = {sent: email};
                res.redirect('/rsvp/');
            });
        });
    });
}

function login(req, res, next) {
    var invitationId;

    try {
        invitationId = invs.decipherId(req.params.invitation_key);
    } catch (ex) {
        delete req.session.invitation;
        return next(error(401));
    }

    invs.loadInvitation(invitationId, function (err, invitation) {
        if (err || !invitation) {
            delete req.session.invitation;
            return next(err);
        }

        req.session.invitation = invitationId;
        res.redirect('/rsvp/');
    });
}

function edit(req, res) {
    var invitation = req.invitation,
        guestsAttending, guestsNeedMeal;

    res.locals.meals = guests.MEALS;
    res.expose(guests.MEALS, 'MEALS');

    if (!invitation.rsvpd) {
        return res.render('rsvp/rsvp');
    }

    guestsAttending = invitation.guests.some(function (guest) {
        return guest.is_attending;
    });

    if (guestsAttending) {
        guestsNeedMeal = invitation.guests.some(function (guest) {
            return guest.is_attending && !guest.meal;
        });

        res.locals.status = guestsNeedMeal ?
            'Choose which Main Course you would like.' :
            'Everything is set with your invitation response.';

        res.render('rsvp/attending');
    } else {
        res.render('rsvp/not-attending');
    }
}
