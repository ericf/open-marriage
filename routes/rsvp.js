var error = require('../lib/utils').error,
    invs  = require('../lib/invitations'),
    MEALS = require('../lib/guests').MEALS;

exports.login = function (req, res, next) {
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
};

exports.edit = function (req, res) {
    var invitation = req.invitation,
        guestsAttending, guestsNeedMeal;

    if (!invitation) {
        return res.render('rsvp/public');
    }

    res.locals.meals = MEALS;
    res.expose(MEALS, 'MEALS');

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
};
