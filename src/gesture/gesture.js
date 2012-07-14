/**
 * タッチイベントを高レベルなジェスチャーに変換する
 */
Navy.Gesture = Navy.Core.subclass({
    CLASS: 'Navy.Gesture',

    _listener: null,

    initialize: function($super, listener) {
        this._listener = listener;
    },

    getTouchListener: function() {
        return this._onTouch.bind(this);
    },

    _callListener: function(touchEvent) {
        this._listener(touchEvent);
    },

    _onTouch: function(touchEvent) {
    }
});
