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
    setLayout: function(view, layout) {
        view._initLayout()
        view._setLayout(layout);
    },
    setSelectedViewListener: function(listener) {
        this._selectedViewListener = listener;
    },
    setMoveViewListener: function(listener) {
        this._moveViewListener = listener;
    },
    selectView: function(view){
        if (this._view){
            //リスナを削除しておく必要あり。
            var page = this._view.getPage();
            page.removeTouchListener(this._listenerId);
        }

        this._view = view;
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

    getPageLayoutFromView: function(view) {
        var views = view.getPage().getViews();
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
    }
});

Navy.Builder.wakeup();
