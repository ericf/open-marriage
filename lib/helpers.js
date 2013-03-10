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

exports.rsvpd = function () {
    return this.rsvp ? 'Yes' : 'No';
};
