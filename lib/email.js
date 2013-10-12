var async   = require('async'),
    exphbs  = require('express3-handlebars'),
    path    = require('path'),
    request = require('request'),

    config  = require('../config'),
    helpers = require('../lib/helpers'),
    invs    = require('../lib/invitations'),

    templates = config.dirs.emails,
    mailgun   = config.mailgun,
    hbs;

exports.sendRsvpLink    = sendRsvpLink;
exports.sendConfirm     = sendConfirm;
exports.sendReminder    = sendReminder;
exports.sendWeekendInfo = sendWeekendInfo;

hbs = exphbs.create({
    extname: '.hbs',
    helpers: helpers
});

function send(to, subject, body, callback) {
    if (!(mailgun.endpint && mailgun.domain && mailgun.secret)) {
        return callback(new Error('Email service not properly configured.'));
    }

    var url = mailgun.endpint + path.join(mailgun.domain, 'messages');

    request.post(url, {
        auth: {user: 'api', pass: mailgun.secret},
        json: true,

        form: {
            // 'o:testmode': true,

            from   : config.email.from,
            to     : to,
            subject: subject,
            text   : body
        }
    }, callback);
}

function getEmailAddresses(guests) {
    return guests.filter(function (guest) {
        return !guest.is_plusone && !!guest.email;
    }).map(function (guest) {
        return guest.name + ' <' + guest.email + '>';
    }).join(', ');
}

function sendConfirm(invitation, callback) {
    var attending = invitation.guests.some(function (guest) {
        return guest.is_attending;
    });

    function renderEmail(callback) {
        var template = attending ? 'attending.hbs' : 'notattending.hbs';

        hbs.render(path.join(templates, template), {
            guests: invitation.guests
        }, callback);
    }

    function sendEmail(body, callback) {
        var to      = getEmailAddresses(invitation.guests),
            subject = 'Confirmed invitation response for our wedding';

        if (to) {
            send(to, subject, body, callback);
        } else {
            callback('Invitation: ' + invitation.id + ' has no recipients.');
        }
    }

    async.waterfall([
        renderEmail,
        sendEmail
    ], callback);
}

function sendRsvpLink(invitation, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options  = {};
    }

    options || (options = {});

    function renderEmail(callback) {
        var template = options.resend ? 'resend.hbs' : 'rsvp.hbs';

        hbs.render(path.join(templates, template), {
            id    : invs.encipherId(invitation.id),
            guests: invitation.guests
        }, callback);
    }

    function sendEmail(body, callback) {
        // Send to both, or only one guest?
        var guests  = options.guest ? [options.guest] : invitation.guests,
            to      = getEmailAddresses(guests),
            subject = 'RSVP for our wedding';

        if (to) {
            send(to, subject, body, callback);
        } else {
            callback('Invitation: ' + invitation.id + ' has no recipients.');
        }
    }

    async.waterfall([
        renderEmail,
        sendEmail
    ], callback);
}

function sendReminder(invitation, callback) {
    var guestsAttending = invitation.guests.filter(function (guest) {
        return guest.is_attending;
    });

    function renderEmail(callback) {
        hbs.render(path.join(templates, 'reminder.hbs'), {
            id    : invs.encipherId(invitation.id),
            rsvpd : invitation.rsvpd,
            guests: invitation.guests
        }, callback);
    }

    function sendEmail(body, callback) {
        var guests  = invitation.rsvpd ? guestsAttending : invitation.guests,
            to      = getEmailAddresses(guests),
            subject = 'Reserve a hotel room for our wedding';

        if (to) {
            send(to, subject, body, callback);
        } else {
            callback('Invitation: ' + invitation.id + ' has no recipients.');
        }
    }

    async.waterfall([
        renderEmail,
        sendEmail
    ], callback);
}

function sendWeekendInfo(invitation, callback) {
    var guestsAttending = invitation.guests.filter(function (guest) {
        return guest.is_attending;
    });

    function renderEmail(callback) {
        hbs.render(path.join(templates, 'weekend.hbs'), {
            id    : invs.encipherId(invitation.id),
            guests: invitation.guests
        }, callback);
    }

    function sendEmail(body, callback) {
        var to      = getEmailAddresses(guestsAttending),
            subject = 'Wedding Brunch on Sunday, 11am - 1pm';

        if (to) {
            send(to, subject, body, callback);
        } else {
            callback('Invitation: ' + invitation.id + ' has no recipients.');
        }
    }

    async.waterfall([
        renderEmail,
        sendEmail
    ], callback);
}
