/**
 * 表示要素の基底クラス
 */
Navy.View = Navy.Core.subclass({
    CLASS: 'Navy.View',

    _isDestroy: false,
    _id: null,
    _parent: null,
    _layout: null,
    _data: null,
    _x: 0,
    _y: 0,
    _width: 0,
    _height: 0,
    _rotation: 0,
    _visible: true,
    _isAttachedRoot: false,

    /**
     * @constructor
     */
    initialize: function($super, id, layout) {
        $super();

        this._id = id;

        if (layout) {
            this._setLayout(layout);
        }

        this._data = {};
    },

    attachedRoot: function(isAttached) {
        this._isAttachedRoot = isAttached;
    },

    isAttachedRoot: function() {
        return this._isAttachedRoot;
    },

    setParent: function(parentView) {
        this._parent = parentView;
    },

    getParent: function() {
        return this._parent;
    },

    getId: function() {
        return this._id;
    },

    getAbsoluteId: function() {
        if (!this._parent) {
            //TODO:例外にする
            console.log('parent is not exist');
            return null;
        }

        if (!this._isAttachedRoot) {
            //TODO:例外にする
            console.log('dont attached in root');
            return null;
        }

        var parentAbsId = this._parent.getAbsoluteId();
        if (parentAbsId) {
            return parentAbsId + '.' + this._id;
        }
        else {
            return this._id;
        }
    },

    _setLayout: function(layout) {
        this._layout = layout;

        if ('pos' in layout) {
            var pos = layout.pos;
            this.setPosition(pos[0], pos[1]);
        }

        if ('visible' in layout) {
            this.setVisible(layout.visible);
        }
    },

    getLayout: function() {
        return this._layout;
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

    addPosition: function(dx, dy) {
        var x = this._x + dx;
        var y = this._y + dy;
        this.setPosition(x, y);
    },

    /**
     * 要素の位置を取得する.
     * @return {Array.<number>} 要素の位置[x, y].
     */
    getPosition: function() {
        return [this._x, this._y];
    },

    /**
     * 原点からの位置を取得する.
     * @return {Array.<number>} 要素の位置[x, y].
     */
    getAbsolutePosition: function() {
        if (!this._parent) {
            //TODO:例外にカエル
            console.log('parent is not exist');
            return;
        }

        var pos = this._parent.getAbsolutePosition();
        return [pos[0] + this._x, pos[1] + this._y];
    },

    setVisible: function(visible) {
        this._visible = visible;
    },

    getVisible: function(visible) {
        return this._visible;
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
        if (this._isDestroy) {
            //TODO:例外にする
            console.log('already destroy: ' + this._id);
            return;
        }

        if (!this._visible) {
            return;
        }

        this._drawExtra(context);
    },

    _drawExtra: function(context) {
    },

    destroy: function() {
        if (this._parent) {
            this._parent.removeView(this._id);
        }

        this._parent = null;
        this._isAttachedRoot = false;

        this._isDestroy = true;
    }
});
