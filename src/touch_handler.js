/**
 * タッチイベントを処理するインスタンス
 */
Navy.TouchHandler = Navy.Core.instance({
    CLASS: 'Navy.TouchEventHandler',

    /** 全てのリスナー */
    _touchListeners: null,
    /** 直近に実行されたリスナー全て */
    _latestTouchListeners: null,
    _latestTouchEvent: null,

    initialize: function($super) {
        this._latestTouchEvent = new Navy.TouchEvent('end', 0, 0, 0);
        this._latestTouchEvent.id = 0;
    },

    process: function(event, touchListeners) {
        this._touchListeners = touchListeners;
        var _latestTouchEvent = this._latestTouchEvent;
        var touchEvent = Navy.TouchEvent.create(event);

        switch (touchEvent.action) {
            case 'start':
                touchEvent.id = _latestTouchEvent.id + 1;
                break;
            case 'move':
                if (_latestTouchEvent.action === 'end') {
                    return;
                }
                touchEvent.id = _latestTouchEvent.id;
                break;
            case 'end':
                touchEvent.id = _latestTouchEvent.id;
        }

        this._latestTouchEvent = touchEvent;

        this._callTouchListener(touchEvent);
    },

    _callTouchListener: function(touchEvent) {
        //イベントを取得するlisteners
        var listeners = null;

        switch (touchEvent.action) {
        case 'start':
            listeners = this._getTouchDownListeners(touchEvent);
            break;
        case 'move':
            listeners = this._getTouchMoveListeners(touchEvent);
            break;
        case 'end':
            listeners = this._getTouchUpListeners(touchEvent);
            break;
        }

        var len = listeners.length;
        for (var i = 0; i < len; i++) {
            //TODO:z順でソート必要あり
            //TODO:戻り値を見て、伝搬するかチェックする
            listeners[i]['listener'](touchEvent);
        }
    },

    _getTouchDownListeners: function(touchEvent) {
        var _touchListeners = this._touchListeners;
        var len = _touchListeners.length;
        var x = touchEvent.x;
        var y = touchEvent.y;
        this._latestTouchListeners = [];
        for (var i = 0; i < len; i++) {
            var view = _touchListeners[i]['view'];
            var listener = _touchListeners[i]['listener'];

            var pos = view.getPosition();
            var x0 = pos[0];
            var y0 = pos[1];

            var size = view.getSize();
            var x1 = x0 + size[0];
            var y1 = y0 + size[1];

            if (!(x0 <= x && x <= x1 && y0 <= y && y <= y1)) {
                continue;
            }
            this._latestTouchListeners.push({view: view, listener: listener});
        }

        return this._latestTouchListeners;
    },

    _getTouchMoveListeners: function(touchEvent) {
        return this._latestTouchListeners;
    },

    _getTouchUpListeners: function(touchEvent) {
        return this._latestTouchListeners;
    }
});
