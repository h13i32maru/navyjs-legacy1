/**
 * タッチイベントの情報を保持するクラス
 */
Navy.TouchEvent = Navy.Core.subclass({
    /** @const */
    CLASS: 'Navy.TouchEvent',

    id: 0,
    action: '',
    x: 0,
    y: 0,
    time: 0,

    initialize: function(action, x, y, time) {
        this.action = action;
        this.x = x;
        this.y = y;
        this.time = time;
    }
});

Navy.TouchEvent.create = function(event) {
    var action = null;
    var x = null;
    var y = null;
    var time = null;

    switch (event.type) {
        case 'mousedown':
            action = 'down';
            x = event.layerX;
            y = event.layerY;
            time = event.timeStamp;
            break;
        case 'mouseup':
            action = 'up';
            x = event.layerX;
            y = event.layerY;
            time = event.timeStamp;
            break;
        case 'mousemove':
            action = 'move';
            x = event.layerX;
            y = event.layerY;
            time = event.timeStamp;
            break;
        default:
            //TODO:例外にする
            console.log('error touch event type');
    }

    return new Navy.TouchEvent(action, x, y, time);
}
