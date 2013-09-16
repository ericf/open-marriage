#!/usr/bin/env node

var async = require('async'),

    email = require('../lib/email'),
    invs  = require('../lib/invitations');

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdout.write('Are you sure you want to BLAST OFF EMAILS? (yes/NO): ');

process.stdin.once('data', function (answer) {
    answer = answer.toString().trim().toLowerCase();

    if (answer === 'yes') {
        sendWeekendInfoEmails();
    } else {
        console.log('Aborting!');
        process.exit();
    }
});

function sendWeekendInfoEmails() {
    console.log('Loading invitations from database...');

    invs.loadInvitations(function (err, invitations) {
        if (err) { throw err; }

        console.log('Filtering invitations to attendees...');

        invitations = invitations.filter(function (invitation) {
            // Exclude all non-RSVPd guests.
            if (!invitation.rsvpd) {
                return false;
            }

            // Include if some guests RSVPd "Yes".
            return invitation.guests.some(function (guest) {
                return guest.is_attending;
            });
        });

        async.eachSeries(invitations, sendEmail, function (err) {
            console.log('Done!');
            process.exit();
        });
    });
}

function sendEmail(invitation, callback) {
    email.sendWeekendInfo(invitation, function (err, res, body) {
        if (err) {
            console.log(err);
        } else {
            console.log('Sent weekend info to Invitation: ' + invitation.id + ' recipients.');
        }

        callback(null);
    });
}
