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
        urls = ['/combo/' + this.version + '?' + urls.join('&')];
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

    if (context.credit) {
        context.credit = {
            text: context.credit.split('|')[0],
            url : context.credit.split('|')[1]
        };
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

exports.setActiveNav = function (itemId) {
    this.nav = this.nav.map(function (item) {
        return extend({}, item, {isActive: item.id === itemId});
    });
};

exports.subnav = function (items, options) {
    Array.isArray(items) || (items = this.subnav[items]);
    if (!items) { return; }

    items = items.map(function (item) {
        return extend({}, item, {isActive: item.id === options.hash.active});
    });

    return options.fn(items);
};

exports.setPageTitle = function (title) {
    this.pageTitle = title;
};

exports.setYUIModule = function (module) {
    this.yui_module = module;
};

exports.pageTitle = function () {
    var title     = escape(this.title),
        pageTitle = this.pageTitle ? (' &ndash; ' + escape(this.pageTitle)) : '';

    return new Handlebars.SafeString(title + pageTitle);
};

exports.setDescription = function (description) {
    this.description = description;
};

exports.setMessageToGuests = function (message) {
    this.messageToGuests = message;
};

exports.guestsNames = function (options) {
    var attending = options.hash.attending,
        html      = options.hash.html,
        name, sep;

    names = (this.invitation || this).guests.filter(function (guest) {
        return !!guest.name && (attending ? guest.is_attending : true);
    }).map(function (guest) {
        return guest.name.split(' ')[0];
    });

    sep = html ? ' <span class="ann-sep">&amp;</span> ' : ' & ';

    names = names.join(sep);
    return new Handlebars.SafeString(names);
};

exports.guestAvailable = function () {
    return this.is_plusone && !this.name ? 'guest-available' : '';
};

exports.guestAttending = function () {
    return this.is_attending ? 'is-guest-attending' : '';
};

exports.guests = function (options) {
    return this.guests.reduce(function (output, guest) {
        guest = extend({}, guest, {mealOptions: options.hash.meals});
        return output + options.fn(guest);
    }, '');
};

exports.guestMeal = function () {
    var mealLabel;

    this.mealOptions.some(function (meal) {
        if (meal.id === this.meal) {
            mealLabel = meal.label;
            return true;
        }
    }, this);

    return mealLabel;
};

exports.isGuestMeal = function (meal) {
    return this.id === meal ? 'checked' : '';
};
