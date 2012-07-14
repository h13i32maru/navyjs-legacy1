/**
 * ページの機能を提供するクラス.
 */
Navy.Page = Navy.View.ViewGroup.subclass({
    CLASS: 'Navy.Page',

    /** ページがアクティブかどうかのフラグ.  */
    _isActive: false,

    /** ページ固有のタッチハンドラー */
    _touchHandler: null,

    /** ページに登録されているタッチリスナー */
    _touchListeners: null,

    initialize: function($super, id, layout) {
        this._touchHandler = new Navy.Touch.Handler();
        this._touchListeners = [];

        $super(id, layout);
    },

    /**
     * ページがアクティブかどうかを取得する.
     */
    isActive: function() {
        return this._isActive;
    },

    /**
     * ページにviewを追加する.
     * @param {Navy.View} view 追加するview.
     */
    addView: function($super, view) {
        $super(view);
        view.onChangePage(this);
    },

    /**
     * ページからviewを削除する.
     * @param {string} viewId 削除するviewのid.
     */
    removeView: function($super, viewId) {
        $super(viewId);
        view.onChangePage(null);
    },

    /**
     * ページが生成され、描画される前に実行される.
     * 各ページはオーバーライドして処理を実装すること.
     * オーバーライドした場合は必ず$superを実行すること.
     * @param {Object} data 遷移元ページからのデータ.
     */
    onCreate: function(data) {
        this._isActive = true;
    },

    /**
     * 画面上に復帰する直前に実行される.
     * 各ページはオーバーライドして処理を実装すること.
     * オーバーライドした場合は必ず$superを実行すること.
     */
    onResumeStart: function() {
        this._isActive = true;
    },

    /**
     * 画面上に完全に復帰した直後に実行される.
     * 各ページはオーバーライドして処理を実装すること.
     * オーバーライドした場合は必ず$superを実行すること.
     */
    onResumeFinish: function() {
    },

    /**
     * 画面上から退避される直前に実行される.
     * 各ページはオーバーライドして処理を実装すること.
     * オーバーライドした場合は必ず$superを実行すること.
     */
    onPauseStart: function() {
    },

    /**
     * 画面上から完全に退避された直後に実行される.
     * 各ページはオーバーライドして処理を実装すること.
     * オーバーライドした場合は必ず$superを実行すること.
     */
    onPauseFinish: function() {
        this._isActive = false;
    },

    /**
     * ページが破棄される直前に実行される.
     * 各ページはオーバーライドして処理を実装すること.
     * オーバーライドした場合は必ず$superを実行すること.
     */
    onDestroy: function() {
        this.destroy();
    },

    /**
     * 遷移先ページからの結果データを受け取る.
     * リクエストID付きで次のページを呼び出した場合にのみ実行される.
     * 各ページはオーバーライドして処理を実装すること.
     * オーバーライドした場合は必ず$superを実行すること.
     * @param {number|string} requestId リクエストID.
     * @param {Object} result 結果データ.
     */
    onResult: function(requestId, result) {
    },

    /**
     * タッチリスナーを登録する.
     * @param {string} viewId リスナーを貼り付けるviewのid.
     * @param {function(Navy.Touch.Event)} listener リスナー関数.
     */
    addTouchListener: function(viewId, listener) {
        var view = this.findView(viewId);
        this._touchListeners.push({view: view, listener: listener});
    },

    /**
     * タップリスナーを登録する.
     * @param {string} viewId リスナーを貼り付けるviewのid.
     * @param {function(Navy.Touch.Event)} listener リスナー関数.
     */
    addTapListener: function(viewId, listener) {
        var tapListener = new Navy.Gesture.Tap(listener);
        this.addTouchListener(viewId, tapListener.getTouchListener());
    },

    /**
     * 絶対IDを取得する.
     */
    getAbsoluteId: function() {
        return '';
    },

    /**
     * タッチイベントを取得する.
     * Navy.Rootから自動的に実行される.
     * @param {Event} event DOM Event.
     */
    onTouch: function(event) {
        this._touchHandler.process(event, this._touchListeners);
    }
});

/**
 * pageIDからページを生成する.
 * @param {string} pageId page.jsonに指定されているページのID.
 * @return {Navy.Page} ページの実装クラス.
 */
Navy.Page.create = function(pageId) {
    var pageConfig = Navy.Config.Page[pageId];

    var pageClass = pageConfig['class'];
    var layoutId = pageConfig['layout'];

    var size = Navy.Root.getSize();
    var layout = {
        pos: [0, 0],
        size: [size[0], size[1]],
        extra: {
            ref: layoutId
        }
    };

    if ('background' in pageConfig) {
        layout.background = pageConfig.background;
    }

    var page = new window[pageClass](pageId, layout);

    return page;
};
