YUI.add('lew-app', function (Y) {

    var win      = Y.config.win,
        isRetina = win.devicePixelRatio >= 2,
        cal      = Y.one('.cal');

function centerCal() {
    var scrollWidth = cal.get('scrollWidth'),
        clientWidth = cal.get('clientWidth');

    if (scrollWidth > clientWidth) {
        cal.set('scrollLeft', (scrollWidth - clientWidth) / 2);
    }
}

function circleDate() {
    var graphic = new Y.Graphic({
            id    : 'cal-day-circle',
            render: cal.one('.cal-day-primary')
        });

    graphic.addShape({
        type  : 'ellipse',
        width : 140,
        height: 28,

        stroke: {
            weight: 2,
            color : '#df0c21'
        }
    });

    Y.one(graphic.get('node')).setStyles({
        left  : null,
        width : '100%',
        height: 'auto'
    }).get('parentNode').setStyle({
        width: '100%'
    });

    Y.one('#cal-day-circle').setStyles({
        left: null,
        top : 0
    });
}

Y.later(0, win, 'scrollTo', [0, 0]);

Y.all('[data-map]').each(function (mapNode) {
    mapbox.load(mapNode.getData('map'), function (data) {
        var map = mapbox.map(mapNode.getDOMNode(), [
            data.layer,
            data.markers
        ], null, [
            MM.DoubleClickHandler(),
            MM.DragHandler()
        ]);

        if (isRetina) {
            map.tileSize = {x: 128, y: 128};
        }

        map.ui.zoomer.add();
        map.centerzoom(data.center, data.zoom);
    });
});

if (cal) {
    circleDate();
    centerCal();
    Y.one(win).on(['orientationchange', 'windowresize'], centerCal);
}

}, '0.0.1', {
    requires: ['node-base', 'event-resize', 'graphics', 'mapbox']
});
