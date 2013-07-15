YUI.add('le-rsvp', function (Y) {

    // -- Models ---------------------------------------------------------------

    Y.Model.prototype.promiseSave = function (options) {
        var model = this;

        return new Y.Promise(function (resolve, reject) {
            model.save(options, function (err, res) {
                return err ? reject(err) : resolve(res);
            });
        });
    };


    Y.Guest = Y.Base.create('guest', Y.Model, [Y.ModelSync.REST], {
        root: '/guests/'
    });


    Y.Guests = Y.Base.create('guests', Y.ModelList, [Y.ModelSync.REST], {
        model: Y.Guest
    });


    Y.Invitation = Y.Base.create('invitation', Y.Model, [Y.ModelSync.REST], {
        root: '/invitations/',

        initializer: function () {
            this.guests = new Y.Guests({bubbleTargets: this});
        },

        _setGuests: function (guests) {
            return this.guests.reset(guests);
        }
    }, {
        ATTRS: {
            guests: {setter: '_setGuests'}
        }
    });

    // -- Views ----------------------------------------------------------------

    Y.InvitationView = Y.Base.create('invitationView', Y.View, [], {
        events: {
            '[data-edit]'      : {click: 'edit'},
            '[data-done]'      : {click: 'done'},
            '[data-send-paper]': {click: 'updateSendPaper'}
        },

        edit: function (e) {
            var container = this.get('container'),
                address   = this.get('invitation').get('address');

            e.preventDefault();
            container.addClass('is-inv-editing');
            container.one('[data-address]')
                .focus()
                .setHTML(Y.Escape.html(address));
        },

        done: function (e) {
            var container = this.get('container'),
                address   = container.one('[data-address]').get('value');

            e.preventDefault();
            container.one('address').setHTML(Y.Escape.html(address));
            container.removeClass('is-inv-editing');

            this.fire('invitationUpdate', {
                updates: {address: address}
            });
        },

        updateSendPaper: function (e) {
            var container = this.get('container'),
                checked   = e.currentTarget.get('checked');

            container.toggleClass('is-inv-send-paper', checked);

            this.fire('invitationUpdate', {
                updates: {send_paper: checked}
            });
        }
    });


    Y.GuestsView = Y.Base.create('guestsView', Y.View, [], {
        events: {
            '[data-edit]': {click: 'edit'},
            '[data-done]': {click: 'done'}
        },

        edit: function (e) {
            e.preventDefault();
            this.get('container').addClass('is-guests-editing');
            this.get('guests').each(this.syncGuestUI, this);
        },

        done: function (e) {
            var container = this.get('container');

            e.preventDefault();
            container.all('[data-guest]').each(this.syncGuestData, this);
            container.removeClass('is-guests-editing');
        },

        syncGuestData: function (guestNode) {
            var id           = guestNode.getData('guest'),
                title        = guestNode.one('[data-title]').get('value'),
                name         = guestNode.one('[data-name]').get('value'),
                email        = guestNode.one('[data-email]').get('value'),
                is_attending = guestNode.one('[data-attending]').get('checked');

            guestNode.one('.guest-title').set('text', title);
            guestNode.one('.guest-name').set('text', name);
            guestNode.one('.guest-email').set('text', email);
            guestNode.one('.guest-attending')
                .set('text', is_attending ? 'Attending' : 'Not Attending');

            this.fire('guestUpdate', {
                id: id,

                updates: {
                    title       : title,
                    name        : name,
                    email       : email,
                    is_attending: is_attending
                }
            });
        },

        syncGuestUI: function (guest) {
            var guestId   = guest.get('id'),
                container = this.get('container'),
                guestNode = container.one('[data-guest="' + guestId + '"]');

            guestNode.one('[data-title]').set('value', guest.get('title'));
            guestNode.one('[data-name]').set('value', guest.get('name'));
            guestNode.one('[data-email]').set('value', guest.get('email'));
            guestNode.one('[data-attending]')
                .get('checked', guest.get('is_attending'));
        }
    });


    Y.RsvpView = Y.Base.create('rsvpView', Y.View, [], {
        events: {
            '[data-attending]': {click: 'rsvp'}
        },

        rsvp: function (e) {
            var isAttending = e.currentTarget.getData('attending') === 'true';
            this.fire('rsvp', {isAttending: isAttending});
        }
    });


    Y.AttendingView = Y.Base.create('attendingView', Y.View, [], {
        initializer: function () {
            var container  = this.get('container'),
                invitation = this.get('invitation');

            this.invitationView = new Y.InvitationView({
                container    : container.one('.inv'),
                invitation   : invitation,
                bubbleTargets: this
            }).attachEvents();

            this.guestsView = new Y.GuestsView({
                container    : container.one('.guests'),
                guests       : invitation.get('guests'),
                bubbleTargets: this
            }).attachEvents();
        }
    });


    Y.NotAttendingView = Y.Base.create('notAttendingView', Y.View, [], {
        initializer: function () {
            this.invitationView = new Y.InvitationView({
                container    : this.get('container').one('.inv'),
                invitation   : this.get('invitation'),
                bubbleTargets: this
            }).attachEvents();
        }
    });

    // -- App ------------------------------------------------------------------

    var app = new Y.App({
        container      : '#main',
        viewContainer  : '#main',
        contentSelector: '#main',
        linkSelector   : null,

        transitions: true,
        root       : '/rsvp/',

        views: {
            rsvp        : {type: Y.RsvpView},
            attending   : {type: Y.AttendingView},
            notAttending: {type: Y.NotAttendingView}
        }
    });

    app.invitation     = new Y.Invitation(YUI.Env.LE.invitation);
    app.initialContent = Y.one('#main > [data-view]');

    app.rsvp = function (isAttending) {
        var guests = this.invitation.get('guests'),
            saves  = [app.updateInvitation({rsvpd: true, send_paper: false})];

        guests.invoke('set', 'is_attending', isAttending);
        saves.push.apply(saves, guests.invoke('promiseSave'));

        Y.batch.apply(null, saves).then(function () {
            app.replace('');
        });
    };

    app.updateInvitation = function (updates) {
        this.invitation.setAttrs(updates);

        if (this.invitation.isModified()) {
            return this.invitation.promiseSave();
        }

        return Y.when(true);
    };

    app.updateGuest = function (id, updates) {
        var guest = this.invitation.get('guests').getById(id);

        if (!guest) {
            return Y.when(false);
        }

        guest.setAttrs(updates);

        if (guest.isModified()) {
            return guest.promiseSave();
        }

        return Y.when(true);
    };

    app.route('/', 'loadContent', function (req, res, next) {
        var content = res.content.node.one('[data-view]');

        this.showContent(content, {
            view: {
                name  : content.getData('view'),
                config: {invitation: this.invitation}
            }
        });
    });

    app.on('*:rsvp', function (e) {
        this.rsvp(e.isAttending);
    });

    app.on('*:invitationUpdate', function (e) {
        this.updateInvitation(e.updates);
    });

    app.on('*:guestUpdate', function (e) {
        this.updateGuest(e.id, e.updates);
    });

    app.render().showContent(app.initialContent, {
        transition: false,

        view: {
            name  : app.initialContent.getData('view'),
            config: {invitation: app.invitation}
        }
    });

}, '1.3.1', {
    requires: [
        'le-main',
        'app-base',
        'app-content',
        'app-transitions',
        'escape',
        'model',
        'model-list',
        'model-sync-rest',
        'view',
        'promise'
    ]
});
