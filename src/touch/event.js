/**
 * タッチイベントの情報を保持するクラス
 */
Navy.Touch.Event = Navy.Core.subclass({
    CLASS: 'Navy.Touch.Event',

    /** イベントの種類 start|move|end */
    action: '',
    target: null,
    x: 0,
    y: 0,
    time: 0,
    _offsetX: 0,
    _offsetY: 0,

    initialize: function(event) {
        this._offsetX = Navy.App.offset[0];
        this._offsetY = Navy.App.offset[1];
        this.set(event);
    },

    /**
     * DOMのタッチイベントから{Navy.Touch.Event}に変換する
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
                x = event.touches[0].pageX - this._offsetX;
                y = event.touches[0].pageY - this._offsetY;
                time = event.timeStamp;
                break;
            case 'touchmove':
                action = 'move';
                x = event.touches[0].pageX - this._offsetX;
                y = event.touches[0].pageY - this._offsetY;
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

        var scale = Navy.App.scale;
        this.action = action;
        this.x = x ? ~~(x / scale) : x;
        this.y = y ? ~~(y / scale) : y;
        this.time = time;
        this.rawEvent = event;
    }
});
