/**
 * タッチイベントを高レベルなジェスチャーに変換する
 */
Navy.Gesture = Navy.Core.subclass({
    CLASS: 'Navy.Gesture',

    _listener: null,

    initialize: function($super, listener) {
        this._listener = listener;
    },

    /**
     * リスナーを取得する.
     * @return {function(Navy.Touch.Event)} タッチイベントを取得してジェスチャーに変換するリスナー.
     */
    getTouchListener: function() {
        return this._onTouch.bind(this);
    },

    /**
     * リスナーを実行する.
     * @param {Navy.Touch.Event} touchEvent タッチイベント.
     */
    _callListener: function(touchEvent) {
        this._listener(touchEvent);
    },

    /**
     * 各ジェスチャーはこのメソッドをオーバーライドして独自の処理を実装すること.
     * @param {Navy.Touch.Event} touchEvent タッチイベント.
     */
    _onTouch: function(touchEvent) {
    }
});
