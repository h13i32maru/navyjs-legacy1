Navy.Page = Navy.View.ViewGroup.subclass({
    CLASS: 'Navy.Page',

    _isActive: false,

    _touchHandler: null,

    _touchListeners: null,

    initialize: function($super, id, layout) {
        this._touchHandler = new Navy.TouchHandler();
        this._touchListeners = [];

        $super(id, layout);
    },

    isActive: function() {
        return this._isActive;
    },

    addView: function($super, view) {
        $super(view);
        view.onChangePage(this);
    },

    removeView: function($super, view) {
        $super(view);
        view.onChangePage(null);
    },

    onEnter: function(data) {
        this._isActive = true;
    },

    onResumeStart: function() {
        this._isActive = true;
    },

    onResumeFinish: function() {
    },

    onPauseStart: function() {
    },

    onPauseFinish: function() {
        this._isActive = false;
    },

    onExit: function() {
    },

    onResult: function(requestId, result) {
    },

    addTouchListener: function(viewId, listener) {
        var view = this.findView(viewId);
        this._touchListeners.push({view: view, listener: listener});
    },

    addTapListener: function(viewId, listener) {
        var tapListener = new Navy.Gesture.Tap(listener);
        this.addTouchListener(viewId, tapListener.getTouchListener());
    },

    getAbsoluteId: function() {
        return '';
    },

    /**
     * Navy.Rootから自動的に実行される
     */
    onTouch: function(event) {
        this._touchHandler.process(event, this._touchListeners);
    }
});

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
}
