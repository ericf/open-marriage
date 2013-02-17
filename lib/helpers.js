exports.event = function (title, options) {
    var classNames = ['event', 'l-grid-u'],
        context    = options.hash,
        output;

    context.title = title;

    if (context.who) {
        classNames.push('event-' + context.who);

        switch (context.who) {
        case 'leslie':
            context.who = {name: 'Leslie', abbrv: 'LV'};
            break;
        case 'eric':
            context.who = {name: 'Eric', abbrv: 'EF'};
            break;
        }
    }

    output = '<li class="' + classNames.join(' ') + '">\n' +
                options.fn(context) + '\n' +
             '</li>\n';

    return output;
};

exports.rsvpd = function () {
    if (this.rsvp == null) { return 'Not yet'; }
    return this.rsvp ? 'Yes' : 'No';
};

exports.rsvpdYes = function (options) {
    return this.rsvp === true ? options.fn(this) : options.inverse(this);
};

exports.rsvpdNo = function (options) {
    return this.rsvp === false ? options.fn(this) : options.inverse(this);
};
