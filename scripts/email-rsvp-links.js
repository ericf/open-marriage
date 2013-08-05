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
        sendRsvpEmails();
    } else {
        console.log('Aborting!');
        process.exit();
    }
});

function sendRsvpEmails() {
    console.log('Loading invitations from database...');

    invs.loadInvitations(function (err, invitations) {
        if (err) { throw err; }

        async.eachSeries(invitations, sendEmail, function (err) {
            console.log('Done!');
            process.exit();
        });
    });
}

function sendEmail(invitation, callback) {
    email.sendRsvpLink(invitation, function (err, res, body) {
        if (err) {
            console.log(err);
        } else {
            console.log('Sent RSVP link to Invitation: ' + invitation.id + ' recipients.');
        }

        callback(null);
    });
}
