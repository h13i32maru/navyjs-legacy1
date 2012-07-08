Navy.Page = Navy.View.ViewGroup.subclass({
    CLASS: 'Navy.Page',

    _touchHandler: null,

    _touchListeners: null,

    initialize: function($super, id, layout) {
        $super(id, layout);

        this._touchHandler = new Navy.TouchHandler();
        this._touchListeners = [];
    },

    onEnter: function(data) {
    },

    onResumeStart: function() {
    },

    onResumeFinish: function() {
    },

    onPauseStart: function() {
    },

    onPauseFinish: function() {
    },

    onExit: function() {
    },

    onResult: function(requestId, result) {
    },

    addTouchListener: function(viewId, listener) {
        var view = this.findView(viewId);
        this._touchListeners.push({view: view, listener: listener});
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
