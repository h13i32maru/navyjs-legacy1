/**
 * 描画のルート要素
 */
Navy.Root = Navy.Core.instance({
    CLASS: 'Navy.Root',

    _canvas: null,
    _children: null,
    /** 登録されているリスナー全て */
    _touchListeners: null,

    initialize: function(canvas) {
        this._canvas = canvas;
        this._children = [];
        this._touchListeners = [];

        this._setOnTouch();
    },

    addChild: function(child) {
        this._children.push(child);
    },

    getChildren: function() {
        //TODO:新しい配列を作ってそれに内容をコピーしたほうがいい？
        //例えば [].concat(this._chidlren)的な。
        return this._children;
    },

    addTouchListener: function(view, listener) {
        this._touchListeners.push({view: view, listener: listener});
    },

    _setOnTouch: function() {
        Navy.TouchHandler.wakeup();
        this._canvas.addEventListener('mousedown', this._onTouch.bind(this), false);
        this._canvas.addEventListener('mousemove', this._onTouch.bind(this), false);
        this._canvas.addEventListener('mouseup', this._onTouch.bind(this), false);

        this._canvas.addEventListener('touchstart', this._onTouch.bind(this), false);
        this._canvas.addEventListener('touchmove', this._onTouch.bind(this), false);
        this._canvas.addEventListener('touchend', this._onTouch.bind(this), false);
    },

    _onTouch: function(event) {
        event.preventDefault();
        Navy.TouchHandler.process(event, this._touchListeners);
    }

});
