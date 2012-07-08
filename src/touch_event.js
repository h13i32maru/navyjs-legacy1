/**
 * タッチイベントの情報を保持するクラス
 */
Navy.TouchEvent = Navy.Core.subclass({
    CLASS: 'Navy.TouchEvent',

    /** イベントの種類 start|move|end */
    action: '',
    target: null,
    x: 0,
    y: 0,
    time: 0,

    initialize: function(event) {
        this.set(event);
    },

    /**
     * DOMのタッチイベントから{Navy.TouchEvent}に変換する
     * @param {Event} event DOMのタッチイベント.
     */
    set: function(event) {
        var action = null;
        var x = null;
        var y = null;
        var time = null;

        switch (event.type) {
            case 'mousedown':
                action = 'start';
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
            case 'mouseup':
                action = 'end';
                x = event.layerX;
                y = event.layerY;
                time = event.timeStamp;
                break;
            case 'touchstart':
                action = 'start';
                x = event.touches[0].pageX;
                y = event.touches[0].pageY;
                time = event.timeStamp;
                break;
            case 'touchmove':
                action = 'move';
                x = event.touches[0].pageX;
                y = event.touches[0].pageY;
                time = event.timeStamp;
                break;
            case 'touchend':
                action = 'end';
                //touchendでは指を離した位置を取得できない
                x = null;
                y = null;
                time = event.timeStamp;
                break;
            default:
                //TODO:例外にする
                console.log('error touch event type');
        }

        this.action = action;
        this.x = x;
        this.y = y;
        this.time = time;
        this.rawEvent = event;
    }
});
