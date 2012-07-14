/**
 * 一定間隔で実行されるタイマー
 */
Navy.Timer = Navy.Core.instance({
    CLASS: 'Navy.Timer',

    _listeners: null,
    _old: 0,

    initialize: function() {
        this._listeners = [];
        this._old = (new Date()).getTime();

        setInterval(this._onUpdate.bind(this), Navy.Loop.INTERVAL);
    },

    _onUpdate: function() {
        var now = (new Date()).getTime();
        var delta = now - this._old;
        this._old = now;

        var listeners = this._listeners;
        var len = listeners.length;
        for (var i = 0; i < len; i++) {
            if (listeners[i]) {
                listeners[i](delta);
            }
        }
    },

    addListener: function(listener) {
        this._listeners.push(listener);
    },

    removeListener: function(listener) {
        var listeners = this._listeners;
        var len = listeners.length;
        for (var i = 0; i < len; i++) {
            if (listeners[i] === listener) {
                listeners[i] = null;
            }
        }
    }
});
