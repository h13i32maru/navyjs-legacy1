Navy.View.ViewGroup = Navy.View.subclass({
    CLASS: 'Navy.View.ViewGroup',

    /** 子要素 */
    _views: null,

    initialize: function($super, id, layout) {
        this._views = {};
        $super(id, layout);
    },

    _setLayout: function($super, layout) {
        $super(layout);

        var ref = layout.extra.ref; 
        var refLayout = Navy.Config.Layout[ref];
        for (var viewId in refLayout) {
            var viewLayout = refLayout[viewId];
            var viewClass = viewLayout['class'];
            var view = new Navy.View[viewClass](viewId, viewLayout);
            this.addView(view);
        }
    },

    onChangePage: function($super, page) {
        $super(page);

        var _views = this._views;
        for (var viewId in _views) {
            _views[viewId].onChangePage(page);
        }
    },

    attachedRoot: function($super, isAttached) {
        $super(isAttached);

        var _views = this._views;
        for (var viewId in _views) {
            _views[viewId].attachedRoot(isAttached);
        }
    },

    addView: function(view) {
        var viewId = view.getId();
        if (viewId in this._views) {
            //TODO:例外にする
            console.log('duplicate view id: ' + viewId);
            return;
        }
        this._views[viewId] = view;
        view.setParent(this);
        view.attachedRoot(this._isAttachedRoot);
    },

    findView: function(viewId) {
        var idchain = viewId.split('.');

        var view = this._views[idchain[0]];
        if (view) {
           if(idchain.length === 1) {
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

        return null;
    },

    removeView: function(viewId) {
        var view = this._views[viewId];
        view.setParent(null);
        view.attachedRoot(false);
        delete this._views[viewId];
    },

    getViews: function() {
        //TODO:コピーして渡すべき
        return this._views;
    },

    _drawExtra: function($super, context) {
        $super(context);

        var _views = this._views;
        for (var viewId in _views) {
            if (!_views[viewId].getVisible()) {
                continue;
            }
            _views[viewId].draw(context);
        }
    },

    destroy: function($super) {
        var _views = this._views;
        for (var viewId in _views) {
            _views[viewId].destroy();
        }
        $super();
    }
});
