/**
 * viewを持つことができるviewクラス.
 */
Navy.View.ViewGroup = Navy.View.subclass({
    CLASS: 'Navy.View.ViewGroup',

    /** 子要素 */
    _views: null,

    _callbackOnSetLayout: null,

    /**
     * @override
     * @param {Object} layout layout.
     * @param {function(viewGroup)} callback view groupの生成が終わったら実行されるコールバック.
     */
    initialize: function($super, layout, callback) {
        this._views = {};
        this._callbackOnSetLayout = callback;
        $super(layout);
    },

    /**
     * 自身のレイアウトと子要素のレイアウトを行う.
     * @override
     * @param {Object} layout layout.
     * @param {function(viewGroup)} callback view groupの生成が終わったら実行されるコールバック.
     */
    _setLayout: function($super, layout, callback) {
        $super(layout);

        if (callback) {
            this._callbackOnSetLayout = callback;
        }

        var ref = layout.extra.ref;
        Navy.LayoutHolder.download(ref, this._setRefLayout.bind(this));
    },

    /**
     * refに指定されているレイアウトを元に、要素を構築する.
     * @param {Object} layout レイアウトJSON.
     */
    _setRefLayout: function(refLayout) {
        var callback = function(view) {
            this.addView(view);
            num--;
            if (num === 0) {
                this._callbackOnSetLayout(this);
            }
        };

        callback = callback.bind(this);

        var len = refLayout.length;
        var num = len;
        for (var i = 0; i < len; i++) {
            var viewLayout = refLayout[i];
            var viewClass = viewLayout['class'];

            if (viewLayout.extra.ref) {
                //refがあるということは非同期でレイアウトを構成することになるので、callback渡す.
                var view = new Navy.View[viewClass](viewLayout, callback);
            } else {
                //refが無いので、非同期じゃないので、callbackはすぐに実行する.
                var view = new Navy.View[viewClass](viewLayout);
                callback(view);
            }
        }
    },

    /**
     * 子要素のpageも変更する.
     * @override
     */
    onChangePage: function($super, page) {
        $super(page);

        var _views = this._views;
        for (var viewId in _views) {
            _views[viewId].onChangePage(page);
        }
    },

    /**
     * 子要素のrootも変更する.
     * @override
     */
    onChangeRoot: function($super, root) {
        $super(root);

        var _views = this._views;
        for (var viewId in _views) {
            _views[viewId].onChangeRoot(root);
        }
    },

    /**
     * 子要素を追加する.
     * @param {Navy.View} view 追加する子要素.
     */
    addView: function(view) {
        var viewId = view.getId();
        if (viewId in this._views) {
            //TODO:例外にする
            console.log('duplicate view id: ' + viewId);
            return;
        }
        this._views[viewId] = view;
        view.onChangeParent(this);
        view.onChangeRoot(this._root);
    },

    /**
     * 子要素を探す.
     * @param {string} viewId 子要素のid.
     * @return {Navy.View} viewIdをもつview.
     */
    findView: function(viewId) {
        var idchain = viewId.split('.');

        var view = this._views[idchain[0]];
        if (view) {
           if (idchain.length === 1) {
               return view;
           }
           else {
               idchain.shift();
               //TODO:findViewがあるかチェックしてなければ例外
               return view.findView(idchain.join('.'));
           }
        }

        var _views = this._views;
        for (var viewId in _views) {
            if (!_views[viewId].findView) {
                continue;
            }

            var view = _views[viewId].findView(viewId);
            if (view) {
                return view;
            }

        }

        //TODO:例外にする
        console.log('not found view:' + viewId);
        return null;
    },

    /**
     * 子要素を削除する.
     * @param {string} viewId 子要素のid.
     */
    removeView: function(viewId) {
        var view = this._views[viewId];
        if (view) {
            view.onChangeParent(null);
            view.onChangeRoot(null);
            delete this._views[viewId];
        } else {
            var view = this.findView(viewId);
            if (!view) {
                //TODO:例外にする
                console.log('not found view');
                return;
            }

            view.removeFromParent();
        }
    },

    /**
     * 子要素を取得する.
     * @return {{id:Navy.View}} viewのidをキーにしたviewの一覧を取得する.
     */
    getViews: function() {
        //TODO:コピーして渡すべき
        return this._views;
    },

    /**
     * 子要素も描画する.
     * @override
     */
    _drawExtra: function($super, context) {
        $super(context);

        var sortedViews = [];
        var views = this._views;
        for (var viewId in views) {
            sortedViews.push(views[viewId]);
        }

        sortedViews.sort(this._compareViewByZ);
        var len = sortedViews.length;
        for (var i = 0; i < len; i++) {
            if (!sortedViews[i].getVisible()) {
                continue;
            }

            sortedViews[i].draw(context);
        }
    },

    /**
     * viewのz順序をソートするために比較関数.
     * @param {Navy.View} view1 比較対象のview.
     * @param {Navy.View} view2 比較対象のview.
     * @return {number} 負数ならview1はview2より下, 0ならview1とview2は同じ位置, 正数ならview1はview2より上.
     */
    _compareViewByZ: function(view1, view2) {
        return view1.getZ() - view2.getZ();
    },

    /**
     * 子要素も破棄する.
     * @override
     */
    destroy: function($super) {
        var _views = this._views;
        for (var viewId in _views) {
            _views[viewId].destroy();
        }
        $super();
    }
});
