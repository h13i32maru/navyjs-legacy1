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
        view.setPage(this);
    },

    removeView: function($super, view) {
        $super(view);
        view.setPage(null);
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

Navy.Gesture = Navy.Core.subclass({
    CLASS: 'Navy.Gesture',

    _listener: null,

    initialize: function($super, listener) {
        this._listener = listener;
    },

    getTouchListener: function() {
        return this._onTouch.bind(this);
    },

    _callListener: function(touchEvent) {
        this._listener(touchEvent);
    },

    _onTouch: function(touchEvent) {
    }
});

Navy.Gesture.Tap = Navy.Gesture.subclass({
    CLASS: 'Navy.Gesture.Tap',

    _onTouch: function($super, touchEvent) {
        $super(touchEvent);

        if (touchEvent.action !== 'end') {
            return;
        }

        var view = touchEvent.target;
        var x = touchEvent.x;
        var y = touchEvent.y;
        var pos = view.getAbsolutePosition();
        var size = view.getSize();
        var x0 = pos[0];
        var y0 = pos[1];
        var x1 = x0 + size[0];
        var y1 = y0 + size[1];

        if (x0 <= x && x <= x1 && y0 <= y && y <= y1) {
            this._callListener(touchEvent);
        }
    }
});
