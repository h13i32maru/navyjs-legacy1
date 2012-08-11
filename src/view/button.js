Navy.View.Button = Navy.View.subclass({
    CLASS: 'Navy.View.Button',

    /** ボタンを離した時に実行されるイベントを発火するかどうかの */
    _fireFlag: false,

    _listeners: null,

    initialize: function($super, layout) {
        $super(layout);

        this._listeners = [];
    },

    onChangeRoot: function($super, root) {
        $super(root);
        if (!root) {
            return;
        }

        var page = this.getPage();
        if (!page) {
            return;
        }

        page.addTouchListener(this.getAbsoluteId(), this._onTouch.bind(this));
    },

    addTapListener: function(listener) {
        this._listeners.push(listener);
    },

    removeTapListener: function(listener) {
        var removed = false;
        var listeners = this._listeners;
        var len = listeners.length;
        for (var i = 0; i < len; i++) {
            if (listeners[i] === listener) {
                listeners.splice(i, 1);
                removed = true;
            }
        }

        if (!removed) {
            //TODO:例外にする.
            console.log("error");
        }
    },

    _onTouch: function(touchEvent) {
        switch (touchEvent.action) {
        case 'start':
            this._fireFlag = true;
            break;
        case 'move':
            //領域に出てしまったら、指が離された時にイベントを発火しない.
            if (!this.checkAbosluteRect(touchEvent.x, touchEvent.y)) {
                this._fireFlag = false;
            }
            break;
        case 'end':
            if (!this._fireFlag) {
                return;
            }
            this._callListeners(touchEvent);
            break;
        }
    },

    _callListeners: function(touchEvent) {
        var listeners = this._listeners;
        var len = listeners.length;
        for (var i = 0; i < len; i++) {
            listeners[i](touchEvent);
        }
    }
});
