/**
 * タッチイベントを処理するクラス
 */
Navy.Touch.Handler = Navy.Core.subclass({
    CLASS: 'Navy.Touch.Handler',

    /** 全てのリスナー */
    _touchListeners: null,

    /** 直近に実行されたリスナー全て */
    _latestTouchListeners: null,

    _latestTouchEvent: null,

    //現在イベントを処理中かどうか
    //1つのイベントしか対応しない(マルチタッチ非対応)
    _isEventProcessing: false,

    /**
     * @constructor
     */
    initialize: function($super) {
    },

    /**
     * タッチイベントを処理してリスナを実行する
     * @param {Event} event DOMのイベント.
     * @param {Array.<{view: Navy.View, listener: function(Navy.Touch.Event) }>} touchListeners 登録されているイベントリスナ.
     */
    process: function(event, touchListeners) {
        this._touchListeners = touchListeners;
        var touchEvent = new Navy.Touch.Event(event);

        switch (touchEvent.action) {
        case 'start':
            if (this._isEventProcessing) {
                return;
            }
            this._isEventProcessing = true;
            break;
        case 'move':
            if (!this._isEventProcessing) {
                return;
            }
            break;
        case 'end':
            if (!this._isEventProcessing) {
                return;
            }
            break;
        }

        var touchedEvents = this._callTouchListener(touchEvent);

        if (touchEvent.action === 'end') {
            this._isEventProcessing = false;
        }

        this._latestTouchEvent = touchEvent;

        return touchedEvents;
    },

    /**
     * イベントリスナを実行する.
     * @param {Navy.Touch.Event} touchEvent 取得したタッチイベント.
     */
    _callTouchListener: function(touchEvent) {
        //イベントを取得するlisteners
        var listeners = null;

        switch (touchEvent.action) {
        case 'start':
            listeners = this._getTouchStartListeners(touchEvent);
            break;
        case 'move':
            listeners = this._getTouchMoveListeners(touchEvent);
            break;
        case 'end':
            listeners = this._getTouchEndListeners(touchEvent);
            break;
        }

        var touchedEvents = [];

        //TODO:z順でソート必要あり
        listeners.sort(function(a, b){
            var order = a.view.getOrderZ(b.view);
            if (order === 0) {
                order = a.view.getLayoutSequence() - b.view.getLayoutSequence();
            }
            return -1 * order;
        });

        var len = listeners.length;
        for (var i = 0; i < len; i++) {
            //TODO:戻り値を見て、伝搬するかチェックする
            var _touchEvent = new Navy.Touch.Event(touchEvent.rawEvent);

            _touchEvent.target = listeners[i]['view'];

            //endの時は指を離した位置を取得できないので、最後のイベントの位置を離した位置をする
            if (touchEvent.action === 'end') {
                _touchEvent.x = this._latestTouchEvent.x;
                _touchEvent.y = this._latestTouchEvent.y;
            }

            var result = listeners[i]['listener'](_touchEvent);
            touchedEvents.push(_touchEvent);
            if (result === false) {
                break;
            }
        }

        return touchedEvents;
    },

    /**
     * タッチスタート時に呼び出すリスナを取得する.
     * @param {Navy.Touch.Event} touchEvent タッチイベント.
     */
    _getTouchStartListeners: function(touchEvent) {
        var _touchListeners = this._touchListeners;
        var len = _touchListeners.length;
        var x = touchEvent.x;
        var y = touchEvent.y;
        this._latestTouchListeners = [];
        for (var i = 0; i < len; i++) {
            var view = _touchListeners[i]['view'];
            var listener = _touchListeners[i]['listener'];

            if (!view.getVisible()) {
                continue;
            }

            if (!view.getRoot()) {
                continue;
            }

            var rect = view.getComputedRect();
            var x0 = rect[0];
            var y0 = rect[1];
            var x1 = rect[2];
            var y1 = rect[3];

            if (!(x0 <= x && x <= x1 && y0 <= y && y <= y1)) {
                continue;
            }
            this._latestTouchListeners.push({view: view, listener: listener});
        }

        return this._latestTouchListeners;
    },

    /**
     * タッチムーブ時に呼び出すリスナを取得する.
     * @param {Navy.Touch.Event} touchEvent タッチイベント.
     */
    _getTouchMoveListeners: function(touchEvent) {
        return this._latestTouchListeners;
    },

    /**
     * タッチエンド時に呼び出すリスナを取得する.
     * @param {Navy.Touch.Event} touchEvent タッチイベント.
     */
    _getTouchEndListeners: function(touchEvent) {
        return this._latestTouchListeners;
    }
});
