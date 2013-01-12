//TODO:jsdoc
Navy.Builder = Navy.Core.instance({
    CLASS: 'Navy.Builder',
    _enable: false,
    _canvasParent: null,
    _urlPrefix: null,
    _selectedViewListener: null,
    _moveViewListener: null,
    _view: null,
    _listenerId: null,
    initialize: function(){
    },
    init: function(){
        Navy.App.initForBuilder();
    },
    setEnable: function(enable) {
        this._enable = enable;
    },
    getEnable: function() {
        return this._enable;
    },
    setCanvasParentElement: function(parentElement){
        parentElement.innerHTML = '';
        this._canvasParent = parentElement;
    },
    clearCanvas: function() {
        this._canvasParent.innerHTML = '';
    },
    getCanvasparentElement: function() {
        return this._canvasParent;
    },
    setUrlPrefix: function(urlPrefix) {
        this._urlPrefix = urlPrefix;
    },
    getUrl: function(url) {
        if (this._enable) {
            return this._urlPrefix + url;
        } else {
            return url;
        }
    },
    setLayout: function(view, layout, callback) {
        var _parent = view.getParent();
        view.removeFromParent();
        view._id = layout.id;
        view._initLayout();
        if (layout.extra.ref) {
            view._setLayout(layout, callback);
        } else {
            view._setLayout(layout);
            callback(view);
        }
        _parent.addView(view);
    },
    setSelectedViewListener: function(listener) {
        this._selectedViewListener = listener;
    },
    setMoveViewListener: function(listener) {
        this._moveViewListener = listener;
    },
    selectView: function(view){

        if (this._view){
            //同じviewを選択した場合は何もしない
            if (this._view.getId() === view.getId()) {
                return;
            }
            //リスナを削除しておく必要あり。
            var page = this._view.getPage();
            page.removeTouchListener(this._listenerId);
        }

        this._view = view;
        if (!this._view) {
            return;
        }

        this._selectedViewListener(view);

        var page = view.getPage();
        this._listenerId = page.addTouchListener(view.getAbsoluteId(), this._onMove.bind(this));

        Navy.Loop.requestDraw();
    },
    _onMove: function(touchEvent) {
        var view = touchEvent.target;
        if (touchEvent.action !== 'move') {
            view.setData('touch', touchEvent);
            return;
        }

        var prev = view.getData('touch');
        var dx = touchEvent.x - prev.x;
        var dy = touchEvent.y - prev.y;

        view.addPosition(dx, dy);

        view.setData('touch', touchEvent);

        this._moveViewListener(view);
    },
    drawViewBorder: function(context){
        if (!this._view) {
            return;
        }

        var rect = this._view.getComputedRect();
        var padding = 0;
        rect[0] -= padding;
        rect[1] -= padding;
        rect[2] += padding;
        rect[3] += padding;

        context.lineWidth = 2;
        context.strokeStyle = '#ff0000';
        context.strokeRect(rect[0], rect[1], rect[2] - rect[0], rect[3] - rect[1]);
    },

    getPageLayout: function(page) {
        var views = page.getViews();
        var layoutSeqs = [];
        for (var id in views) {
            layoutSeqs.push({seq: views[id].getLayoutSequence(), layout: views[id].getLayout()});
        }

        layoutSeqs.sort(function(seq1, seq2){ return seq1 - seq1; });
        var layouts = [];
        for (var i = 0; i < layoutSeqs.length; i++) {
            layouts.push(layoutSeqs[i].layout);
        }

        return layouts;
    },

    createViewToPage: function(page, viewClassName, x, y) {
        var sortedViews = page.getSortedViews().reverse();
        var z = sortedViews[0].getZ() + 1;

        var layout = {
            'class': viewClassName,
            size: [100, 100],
            z: z,
            pos: [x, y],
            background: {
                color: '#aaaaaa'
            },
            extra: {}
        };

        var view = new Navy.View[viewClassName](layout);
        page.addView(view);
    },

    getSortedViews: function(page) {
        return page.getSortedViews();
    }
});

Navy.Builder.wakeup();
