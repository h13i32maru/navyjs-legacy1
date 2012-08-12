//TODO:jsdoc
Navy.View.Button = Navy.View.Text.subclass({
    CLASS: 'Navy.View.Button',

    /** ボタンを離した時に実行されるイベントを発火するかどうかの */
    _fireFlag: false,

    _listeners: null,

    _state: 'normal',
    _stateNormalLayout: null,
    _stateTappedLayout: null,

    _link: null,

    initialize: function($super, layout) {
        $super(layout);

        this._listeners = [];
    },

    /**
     * タップ時の遷移先を設定する.
     * @param {string} link ページID.
     */
    setLink: function(link) {
        this._link = link;
    },

    /**
     * リンクを取得する.
     * @return {string} リンク.
     */
    getLink: function() {
        return this._link;
    },

    _setLayout: function($super, layout) {
        $super(layout);

        if (layout.extra.link) {
            this._link = layout.extra.link;
        }

        if (layout.extra.normal) {
            this._stateNormalLayout = layout.extra.normal;
        }

        if (layout.extra.tapped) {
            this._stateTappedLayout = layout.extra.tapped;
        }
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
            this._state = 'tapped';
            Navy.Loop.requestDraw();
            break;
        case 'move':
            //領域に出てしまったら、指が離された時にイベントを発火しない.
            if (!this.checkAbosluteRect(touchEvent.x, touchEvent.y)) {
                this._fireFlag = false;
                this._state = 'normal';
            }
            Navy.Loop.requestDraw();
            break;
        case 'end':
            this._state = 'normal';
            Navy.Loop.requestDraw();
            if (!this._fireFlag) {
                return;
            }
            this._callListeners(touchEvent);
            break;
        }
    },

    _callListeners: function(touchEvent) {
        if (this._link) {
            var _link = this._link;
            if (_link === '$back') {
                Navy.Screen.back();
            }
            else {
                Navy.Screen.next(this._link);
            }
        }

        var listeners = this._listeners;
        var len = listeners.length;
        for (var i = 0; i < len; i++) {
            listeners[i](touchEvent);
        }
    },

    _drawExtra: function($super, context) {
        $super(context);

        if (this._state === 'normal') {
            var layout = this._stateNormalLayout;
        } else if (this._state === 'tapped') {
            var layout = this._stateTappedLayout;
        } else {
            //TODO:例外なげる
        }

        if (layout.background) {
            this._drawBackground(context, layout.background);
        }
        if (layout.border) {
            this._drawBorder(context, layout.border);
        }
    }
});
