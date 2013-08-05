#!/usr/bin/env node

var csv  = require('csv'),
    path = require('path'),

    invs   = require('../lib/invitations'),
    output = process.argv[2];

if (output) {
    output = path.resolve(output);
} else {
    console.error('No output path provided!');
    process.exit(1);
}

console.log('Loading invitations from database...');
invs.loadInvitations(function (err, invitations) {
    if (err) { throw err; }

    var labels = invitations.map(createLabel);

    console.log('Writing ' + labels.length + ' labels to CSV file: ' + output);
    writeCSV(labels, output, function () {
        console.log('Done!');
        process.exit();
    });
});

function createLabel(invitation) {
    var names = invitation.guests.filter(function (guest) {
        return !guest.is_plusone;
    }).map(function (guest) {
        return guest.title.trim() + ' ' + guest.name.trim();
    });

    return {
        names  : names.join('\n'),
        address: invitation.address.trim()
    };
}

function writeCSV(labels, output, callback) {
    var options = {
        columns: ['names', 'address'],
        header : true
    };

    csv()
        .from.array(labels)
        .to.path(output, options)
        .on('close', callback);
}
