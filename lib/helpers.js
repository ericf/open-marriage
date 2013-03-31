var Handlebars = require('handlebars'),

    escape = Handlebars.Utils.escapeExpression,
    extend = require('./utils').extend;

exports.addCSS = function (path, options) {
    var css  = this.css || (this.css = []);
    css[options.hash.prepend ? 'unshift' : 'push'](path);
};

exports.css = function (options) {
    var urls   = this.css,
        output = '';

    if (!(urls && urls.length)) { return output; }

    if (this.isProduction) {
        urls = ['/combo?' + urls.join('&')];
    }

    urls.forEach(function (url) {
        output += options.fn({url: url});
    });

    return output;
};

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

exports.day = function (day, options) {
    var classNames = ['cal-day', 'l-contain', 'l-grid-u'],
        context    = options.hash,
        output;

    day = day.split(' ');

    context.name = day[0];
    context.date = day[1];

    if (context.primary) {
        classNames.push('cal-day-primary');
    }

    output = '<li class="' + classNames.join(' ') + '">\n' +
                options.fn(context) + '\n' +
             '</li>\n';

    return output;
};

exports.addDayEvent = function (name, options) {
    var events = this.events || (this.events = []),
        event  = options.hash;

    event.name = name;
    events.push(event);
};

exports.rsvpd = function () {
    return this.rsvp ? 'Yes' : 'No';
};

exports.setActiveNav = function (itemId) {
    var nav = [];

    this.nav.forEach(function (item) {
        nav.push(extend({}, item, {isActive: item.id === itemId}));
    });

    this.nav = nav;
};

exports.setPageTitle = function (title) {
    this.pageTitle = title;
};

exports.pageTitle = function () {
    var title     = escape(this.title),
        pageTitle = this.pageTitle ? (' &ndash; ' + escape(this.pageTitle)) : '';

    return new Handlebars.SafeString(title + pageTitle);
};
