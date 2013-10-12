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

    var guests = invitations.reduce(function (guests, invitation) {
        // Exclude all non-RSVPd guests.
        if (!invitation.rsvpd) {
            return guests;
        }

        // Include if guests who RSVPd "Yes".
        invitation.guests.forEach(function (guest) {
            if (guest.is_attending) {
                guests.push(guest);
            }
        });

        return guests;
    }, []);

    // Sort guests by last name.
    guests.sort(function (a, b) {
        a = getSortableName(a);
        b = getSortableName(b);

        if (a > b) { return 1; }
        if (a < b) { return -1; }
        return 0;
    });

    writeCSV(guests.map(createSeat), output, function () {
        console.log('Done!');
        process.exit();
    });
});

function getSortableName(guest) {
    var nameParts = guest.name.trim().split(/\s+/),
        firstName = nameParts.splice(0, 1)[0],
        lastName  = nameParts.splice(-1, 1)[0];

    // Check for suffix; e.g. "III".
    if (/^(jr|jr\.|iii|iv|v)$/.test(lastName.toLowerCase())) {
        lastName = nameParts.splice(-1, 1)[0] + ' ' + lastName;
    }

    nameParts.unshift(lastName, firstName);
    return nameParts.join(' ');
}

function createSeat(guest) {
    return {
        name : guest.title.trim() + ' ' + guest.name.trim(),
        meal : guest.meal,
        table: null
    };
}

function writeCSV(seats, output, callback) {
    var options = {
        columns: ['table', 'name', 'meal'],
        header : true
    };

    console.log('Writing ' + seats.length + ' seats to CSV file: ' + output);

    csv()
        .from.array(seats)
        .to.path(output, options)
        .on('close', callback);
}
