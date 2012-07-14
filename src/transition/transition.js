/**
 * 画面遷移の基底クラス
 */
Navy.Transition = Navy.Core.subclass({
    CLASS: 'Navy.Transition',

    _page1: null,
    _page2: null,
    _currentPage: null,
    _newPage: null,
    _previousPage: null,

    _startCompleteListeners: null,
    _backCompleteListeners: null,

    initialize: function($super, currentPage, newPage) {
        $super();

        this._page1 = currentPage;
        this._page2 = newPage;

        this._startCompleteListeners = [];
        this._backCompleteListeners = [];
    },

    addStartCompleteListener: function(listener) {
        this._startCompleteListeners.push(listener);
    },

    addBackCompleteListener: function(listener) {
        this._backCompleteListeners.push(listener);
    },

    start: function() {
        this._currentPage = this._page1;
        this._newPage = this._page2;
    },

    back: function() {
        this._previousPage = this._page1;
        this._currentPage = this._page2;
    },

    _callStartCompleteListener: function() {
        var listeners = this._startCompleteListeners;
        for (var i = 0; i < listeners.length; i++) {
            listeners[i](this._currentPage, this._newPage);
        }
    },

    _callBackCompleteListener: function() {
        var listeners = this._backCompleteListeners;
        for (var i = 0; i < listeners.length; i++) {
            listeners[i](this._previousPage, this._currentPage);
        }
    }
});
