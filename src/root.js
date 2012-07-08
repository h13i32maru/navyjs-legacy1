/**
 * 描画のルート要素
 */
Navy.Root = Navy.View.ViewGroup.instance({
    CLASS: 'Navy.Root',

    _canvas: null,

    /** 保持している子要素 */
    _pages: null,

    /** 登録されているリスナー全て */
    _touchListeners: null,

    /**
     * @constructor
     * @param {Canvas} canvas ルートとして使用するcanvas要素.
     */
    initialize: function($super, canvas) {
        this._canvas = canvas;
        this._pages = [];
        this._touchListeners = [];

        this._setOnTouch();

        this.setParent(null);
    },

    getAbsolutePosition: function(){
        return [0, 0];
    },

    getActivePages: function() {
        var pageNum = this._pages.length;
        var page = this._pages[pageNum - 1];

        var _pages = this._pages;
        var activePages = [];
        for (var i = 0; i < _pages.length; i++) {
            if (!_pages[i].isActive()) {
                continue;
            }

            activePages.push(_pages[i]);
        }

        return activePages; 
    },

    pushPage: function(page) {
        this._pages.push(page);
        page.setParent(this);
        page.attachedRoot(true);
    },

    popPage: function() {
        var page = this._pages.pop();
        page.setParent(null);
        page.attachedRoot(false);
    },

    /**
     * スタックの上を0としてページを取得する. 現在のページを取得するにはindex = 0, 一つ前はindex = 1となる.
     */
    getPage: function(index) {
        var _pages = this._pages;
        if (_pages.length <= index) {
            //TODO:例外にする
            console.log('out of index');
            return;
        }

        return _pages[ _pages.length - 1 - index];
    },

    draw: function($super, context) {
        var pages = this.getActivePages();
        for (var i = 0; i < pages.length; i++) {
            pages[i].draw(context);
        }
    },

    /**
     * タッチイベントを追加する
     * @param {View} view タッチイベントを取得する子要素.
     * @param {function({Navy.TouchEvent})} listener イベントリスナ.
     */
    addTouchListener: function(view, listener) {
        this._touchListeners.push({view: view, listener: listener});
    },

    /**
     * タッチイベントを取得するためのリスナを初期化する.
     */
    _setOnTouch: function() {
        this._canvas.addEventListener('mousedown', this._onTouch.bind(this), false);
        this._canvas.addEventListener('mousemove', this._onTouch.bind(this), false);
        this._canvas.addEventListener('mouseup', this._onTouch.bind(this), false);

        this._canvas.addEventListener('touchstart', this._onTouch.bind(this), false);
        this._canvas.addEventListener('touchmove', this._onTouch.bind(this), false);
        this._canvas.addEventListener('touchend', this._onTouch.bind(this), false);
    },

    /**
     * タッチイベントのリスナ
     * @param {Event} event DOMのイベント.
     */
    _onTouch: function(event) {
        event.preventDefault();
        var pages = this.getActivePages();
        for (var i = 0; i < pages.length; i++) {
            pages[i].onTouch(event);
        }
    }
});
