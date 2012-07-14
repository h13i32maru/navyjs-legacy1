/**
 * 画面遷移の基底クラス
 */
Navy.Transition = Navy.Core.subclass({
    CLASS: 'Navy.Transition',

    /** 1つ目のページ */
    _page1: null,

    /** 2つ目のページ */
    _page2: null,

    _currentPage: null,
    _nextPage: null,
    _previousPage: null,

    _nextCompleteListeners: null,
    _backCompleteListeners: null,

    initialize: function($super, currentPage, nextPage) {
        $super();

        this._page1 = currentPage;
        this._page2 = nextPage;

        this._nextCompleteListeners = [];
        this._backCompleteListeners = [];
    },

    /**
     * next完了時のリスナーを追加する.
     * @param {function(Navy.Page, Navy.Page)}} listener 遷移が終わった時に実行されるリスナーを追加する.現在のページと次のページを受け取る.
     */
    addNextCompleteListener: function(listener) {
        this._nextCompleteListeners.push(listener);
    },

    /**
     * back完了時のリスナーを追加する.
     * @param {function(Navy.Page, Navy.Page)}} listener 遷移が終わった時に実行されるリスナーを追加する.前のページと現在のページを受け取る.
     */
    addBackCompleteListener: function(listener) {
        this._backCompleteListeners.push(listener);
    },

    /**
     * 次のページに遷移する.
     * 各遷移の実装クラスはオーバーライドして実装すること.
     */
    next: function() {
        this._currentPage = this._page1;
        this._nextPage = this._page2;
    },

    /**
     * 前のページに戻る.
     * 各遷移の実装クラスはオーバーライドして実装すること.
     */
    back: function() {
        this._previousPage = this._page1;
        this._currentPage = this._page2;
    },

    /**
     * next完了時のリスナーを実行する.
     */
    _callNextCompleteListener: function() {
        var listeners = this._nextCompleteListeners;
        for (var i = 0; i < listeners.length; i++) {
            listeners[i](this._currentPage, this._nextPage);
        }
    },

    /**
     * back完了時のリスナーを実行する.
     */
    _callBackCompleteListener: function() {
        var listeners = this._backCompleteListeners;
        for (var i = 0; i < listeners.length; i++) {
            listeners[i](this._previousPage, this._currentPage);
        }
    }
});
