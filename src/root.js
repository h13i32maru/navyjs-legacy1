/**
 * 描画のルート要素
 */
Navy.Root = Navy.Core.instance({
    CLASS: 'Navy.Root',

    _canvas: null,

    /** 保持している子要素 */
    _children: null,

    /** 登録されているリスナー全て */
    _touchListeners: null,

    /**
     * @constructor
     * @param {Canvas} canvas ルートとして使用するcanvas要素.
     */
    initialize: function(canvas) {
        this._canvas = canvas;
        this._children = [];
        this._touchListeners = [];

        this._setOnTouch();
    },

    /**
     * 子要素を追加する
     * @param {Navy.View} child 追加する子要素.
     */
    addChild: function(child) {
        this._children.push(child);
    },

    /**
     * 全ての子要素を取得する
     * @return {Array.<Navy.View>} 子要素の配列.
     */
    getChildren: function() {
        //TODO:新しい配列を作ってそれに内容をコピーしたほうがいい？
        //例えば [].concat(this._chidlren)的な。
        return this._children;
    },

    /**
     * タッチイベントを追加する
     * @param {View} view タッチイベントを取得する子要素.
     * @param {function({Navy.TouchEvent})} listener イベントリスナ.
     */
    addTouchListener: function(view, listener) {
        this._touchListeners.push({view: view, listener: listener});
    },

    /**
     * タッチイベントを取得するためのリスナを初期化する.
     */
    _setOnTouch: function() {
        Navy.TouchHandler.wakeup();
        this._canvas.addEventListener('mousedown', this._onTouch.bind(this), false);
        this._canvas.addEventListener('mousemove', this._onTouch.bind(this), false);
        this._canvas.addEventListener('mouseup', this._onTouch.bind(this), false);

        this._canvas.addEventListener('touchstart', this._onTouch.bind(this), false);
        this._canvas.addEventListener('touchmove', this._onTouch.bind(this), false);
        this._canvas.addEventListener('touchend', this._onTouch.bind(this), false);
    },

    /**
     * タッチイベントのリスナ
     * @param {Event} event DOMのイベント.
     */
    _onTouch: function(event) {
        event.preventDefault();
        Navy.TouchHandler.process(event, this._touchListeners);
    }

});
