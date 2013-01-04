//TODO:jsdoc
Navy.View.Button = Navy.View.Text.subclass({
    CLASS: 'Navy.View.Button',

    /** ボタンを離した時に実行されるイベントを発火するかどうかの */
    _fireFlag: false,

    _listeners: null,

    _state: 'normal',

    initialize: function($super, layout) {
        $super(layout);

        this._listeners = [];
    },

    /**
     * タップ時の遷移先を設定する.
     * @param {string} link ページID.
     */
    setLink: function(link) {
        this._extra.link = link;
    },

    /**
     * リンクを取得する.
     * @return {string} リンク.
     */
    getLink: function() {
        return this._extra.link;
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

        //ビルダー上で使う時はボタンのリスナーをセットしない
        if (!Navy.Builder.getEnable()) {
            page.addTouchListener(this.getAbsoluteId(), this._onTouch.bind(this));
        }
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
        if (this._extra.link) {
            var _link = this._extra.link;
            if (_link === '$back') {
                Navy.Screen.back();
            }
            else {
                Navy.Screen.next(this._extra.link);
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
            var layout = this._extra.normal;
        } else if (this._state === 'tapped') {
            var layout = this._extra.tapped;
        } else {
            //TODO:例外なげる
        }

        if (layout.alpha) {
            var origAlpha = context.globalAlpha;
            context.globalAlpha = layout.alpha;
        }

        if (layout.background) {
            this._drawBackground(context, layout.background);
        }

        if (layout.border) {
            this._drawBorder(context, layout.border);
        }

        if(layout.alpha) {
            context.globalAlpha = origAlpha;
        }
    }
});
