/**
 * 表示要素の基底クラス
 */
Navy.View = Navy.Core.subclass({
    CLASS: 'Navy.View',

    _data: null,
    _x: 0,
    _y: 0,
    _width: 0,
    _height: 0,
    _rotation: 0,
    _touchListeners: null,

    /**
     * @constructor
     */
    initialize: function($super) {
        $super();

        this._data = {};
        this._touchListeners = [];

        Navy.Root.addTouchListener(this, this._onTouch.bind(this));
    },

    /**
     * 任意のデータを保存する
     * @param {string} key キー名.
     * @param {Object} value 値.
     */
    setData: function(key, value) {
        this._data[key] = value;
    },

    /**
     * 保存したデータを取得する.
     * @param {string} key キー名.
     * @param {Object} defaultValue keyに対応するデータが無かった場合に取得する値.
     * @return {Object} keyに対応するデータ.
     */
    getData: function(key, defaultValue) {
        return this._data[key] || defaultValue;
    },

    /**
     * 要素の位置を設定する.
     * @param {number} x X座標.
     * @param {number} y Y座標.
     */
    setPosition: function(x, y) {
        this._x = x;
        this._y = y;

        Navy.Loop.requestDraw();
    },

    /**
     * 要素の位置を取得する.
     * @return {Array.<number>} 要素の位置[x, y].
     */
    getPosition: function() {
        return [this._x, this._y];
    },

    /**
     * 要素のサイズを取得する.
     * @return {Array.<number>} 要素のサイズ[width, height].
     */
    getSize: function() {
        return [this._width, this._height];
    },

    /**
     * 要素を回転させる.
     * @param {number} ratotaion 要素の回転角度.
     */
    setRotation: function(rotation) {
        this._rotation = rotation;
        Navy.Loop.requestDraw();
    },

    /**
     * 要素を描画する.
     * @param {Context} context コンテキスト要素.
     */
    draw: function(context) {
    },

    /**
     * タッチイベントを設定する
     * @param {Navy.TouchListener} listener タッチイベントのリスナ.
     */
    addTouchListener: function(listener) {
        this._touchListeners.push(listener);
    },

    /**
     * タッチリスナ
     * @param {Navy.TouchEvent} touchEvent タッチイベント.
     */
    _onTouch: function(touchEvent) {
        for (var i = 0; i < this._touchListeners.length; i++) {
            this._touchListeners[i](touchEvent);
        }
    }
});
