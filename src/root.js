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

        this.onChangeParent(null);

        var size = Navy.Config.App.size;
        this.setSize(size[0], size[1]);

        this.setVisible(true);
    },

    getAbsoluteVisible: function() {
        return true;
    },

    /**
     * @override
     */
    getAbsolutePosition: function() {
        return [0, 0];
    },

    /**
     * アクティブなページを取得する.
     * @return {Array.<Navy.Page>} アクティブなページのリスト.
     */
    _getActivePages: function() {
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

    /**
     * ページをスタックの一番上に追加する.
     * @param {Navy.Page} page 新しいページ.
     */
    pushPage: function(page) {
        this._pages.push(page);
        page.onChangeParent(this);
        page.onChangeRoot(this);
    },

    /**
     * スタックの一番上のページを削除する.
     */
    popPage: function() {
        var page = this._pages.pop();
        page.onChangeParent(null);
        page.onChangeRoot(null);
    },

    /**
     * 使わせない.
     */
    addView: function() {
        //TODO:例外にする
        console.log('must not call');
    },

    /**
     * 使わせない.
     */
    findView: function() {
        //TODO:例外にする
        console.log('must not call');
    },

    /**
     * 何もしない.
     */
    removeView: function() {
    },

    /**
     * スタックの上を0としてページを取得する. 現在のページを取得するにはindex = 0, 一つ前はindex = 1となる.
     * @param {number} index ページのスタック上のindex.
     */
    getPage: function(index) {
        var _pages = this._pages;
        if (_pages.length <= index) {
            //TODO:例外にする
            console.log('out of index');
            return;
        }

        return _pages[_pages.length - 1 - index];
    },

    /**
     * アクティブなページだけを描画する.
     * @override
     */
    draw: function($super, context) {
        var pages = this._getActivePages();
        for (var i = 0; i < pages.length; i++) {
            pages[i].draw(context);
        }
    },

    /**
     * タッチイベントを追加する
     * @param {View} view タッチイベントを取得する子要素.
     * @param {function({Navy.Touch.Event})} listener イベントリスナ.
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
        var pages = this._getActivePages();
        for (var i = 0; i < pages.length; i++) {
            pages[i].onTouch(event);
        }
    }
});
