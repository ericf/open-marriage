YUI.add('le-wedding', function (Y) {

    var cal = Y.one('.cal'),
        graphic;

    function centerCal() {
        var scrollWidth = cal.get('scrollWidth'),
            clientWidth = cal.get('clientWidth');

        if (scrollWidth > clientWidth) {
            cal.set('scrollLeft', (scrollWidth - clientWidth) / 2);
        }
    }

    graphic = new Y.Graphic({
        id    : 'cal-day-circle',
        render: cal.one('.cal-day-primary')
    });

    graphic.addShape({
        type  : 'ellipse',
        width : 140,
        height: 28,

        stroke: {
            weight: 2,
            color : '#f2c63d'
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

    centerCal();
    Y.one('win').on(['orientationchange', 'windowresize'], centerCal);

}, '1.8.0', {
    requires: ['le-main', 'le-maps', 'event-resize', 'graphics']
});
