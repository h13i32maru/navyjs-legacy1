/**
 * 表示要素の基底クラス
 */
Navy.View = Navy.Core.subclass({
    CLASS: 'Navy.View',

    _isDestroy: false,
    _id: null,
    /** 親root */
    _root: null,
    /** 親page */
    _page: null,
    /** 親view */
    _parent: null,
    /** レイアウト情報のオブジェクト */
    _layout: null,
    /** 外から注入される任意のデータ */
    _data: null,
    _x: 0,
    _y: 0,
    _width: null,
    _height: null,
    _rotation: 0,
    _visible: true,
    _background: null,
    _border: null,
    _paddingTop: null,
    _paddingRight: null,
    _paddingBottom: null,
    _paddingLeft: null,
    /** タップ時に遷移するページのid */
    _link: null,
    /** リンクリスナーを登録したかどうか */
    _isAddLinkListener: false,

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

    /**
     * 親rootが変更された時に実行される.
     */
    onChangeRoot: function(root) {
        this._root = root;
    },

    /**
     * 親pageが変更された時に実行される.
     */
    onChangePage: function(page) {
        this._page = page;

        //linkが設定されているが、リスナが登録されていなければ登録する
        if (page && this._link && !this._isAddLinkListener) {
            page.addTapListener(this._id, this._linkListener.bind(this));
            this._isAddLinkListener = true;
        }
    },

    /**
     * 親viewが変更された時に実行される.
     */
    onChangeParent: function(parentView) {
        this._parent = parentView;
    },

    /**
     * rootを取得する.
     * @return {Navy.Root} root.
     */
    getRoot: function() {
        return this._root;
    },

    /**
     * pageを取得する.
     * @return {Navy.Page} page.
     */
    getPage: function() {
        return this._page;
    },

    /**
     * 親viewを取得する.
     * @return {Navy.ViewGroup} viewgroup.
     */
    getParent: function() {
        return this._parent;
    },

    /**
     * IDを取得する.
     * @return {string} ID.
     */
    getId: function() {
        return this._id;
    },

    /**
     * rootからの絶対IDを取得する.
     * @return {string} 絶対ID.
     */
    getAbsoluteId: function() {
        if (!this._parent) {
            //TODO:例外にする
            console.log('parent is not exist');
            return null;
        }

        if (!this._root) {
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

    /**
     * レイアウトを設定する.
     * 各viewはオーバーライドして独自の処理を実装すること.
     * @param {Object} layout レイアウト情報.
     */
    _setLayout: function(layout) {
        this._layout = layout;

        if ('pos' in layout) {
            var pos = layout.pos;
            this.setPosition(pos[0], pos[1]);
        }

        if ('visible' in layout) {
            this.setVisible(layout.visible);
        }

        if ('size' in layout) {
            var size = layout.size;
            this.setSize(size[0], size[1]);
        }

        if ('background' in layout) {
            this.setBackground(layout.background);
        }

        if ('border' in layout) {
            this.setBorder(layout.border);
        }

        if ('link' in layout) {
            this.setLink(layout.link);
        }

        if ('padding' in layout) {
            if (layout.padding instanceof Array) {
                this.setPaddingArray(layout.padding);
            }
            else {
                this.setPaddingOne(layout.padding);
            }
        }
    },

    //TODO:doc
    setPaddingOne: function(padding) {
        this.setPadding(padding, padding, padding, padding);
    },

    //TODO:doc
    setPaddingArray: function(padding) {
        this.setPadding(padding[0], padding[1], padding[2], padding[3]);
    },

    //TODO:doc
    setPadding: function(top, right, bottom, left) {
        this._paddingTop = top;
        this._paddingRight = right;
        this._paddingBottom = bottom;
        this._paddingLeft = left;
        Navy.Loop.requestDraw();
    },

    //TODO:doc
    getPadding: function() {
        return [this._paddingTop, this._paddingRight, this._paddingBottom, this._paddingLeft];
    },

    //TODO:doc
    setBorder: function(border) {
        this._border = border;
        Navy.Loop.requestDraw();
    },

    //TODO:doc
    getBorder: function() {
        //TODO:コピーして渡したほうが良い
        return this._border;
    },

    /**
     * タップ時の遷移先を設定する.
     * @param {string} link ページID.
     */
    setLink: function(link) {
        this._link = link;

        //linkが設定されているが、リスナが登録されていなければ登録する
        if (link && !this._isAddLinkListener && this._page) {
            this._page.addTapListener(this._id, this._linkListener.bind(this));
            this._isAddLinkListener = true;
        }
    },

    /**
     * 指定されたページに遷移する.
     * タップ時に実行される.
     * @param {Navy.Touch.Event} touchEvent タッチイベント.
     */
    _linkListener: function(touchEvent) {
        var _link = this._link;
        if (_link === '$back') {
            Navy.Screen.back();
        }
        else {
            Navy.Screen.next(this._link);
        }
    },

    /**
     * リンクを取得する.
     * @return {string} リンク.
     */
    getLink: function() {
        return this._link;
    },

    /*
     * レイアウトを取得する.
     * @return {Object} レイアウト情報.
     */
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

    /**
     * 要素の位置を設定する.
     * @param {Array.<number>} pos [x, y].
     */
    setPositionArray: function(pos) {
        this.setPosition(pos[0], pos[1]);
    },

    /**
     * 要素の位置を増減する.
     * @param {number} dx 増減量.
     * @param {number} dy 増減量.
     */
    addPosition: function(dx, dy) {
        var x = this._x + dx;
        var y = this._y + dy;
        this.setPosition(x, y);
    },

    /**
     * 要素の位置を増減する.
     * @param {Array.<number>} delta [dx, dy].
     */
    addPositionArray: function(delta) {
        this.addPosition(delta[0], delta[1]);
    },

    /**
     * 要素の位置を取得する.
     * @return {Array.<number>} 要素の位置[x, y].
     */
    getPosition: function() {
        return [this._x, this._y];
    },

    /**
     * 要素の絶対位置を設定する.
     * @param {number} absX x座標.
     * @param {number} absY y座標.
     */
    setAbsolutePosition: function(absX, absY) {
        var pos = this.getParent().getAbsolutePosition();
        var x = absX - pos[0];
        var y = absY - pos[1];

        this.setPosition(x, y);
    },

    /**
     * 要素の絶対位置を設定する.
     * @return {Array.<number>} 要素の位置[x, y].
     */
    setAbsolutePositionArray: function(abs) {
        this.setAbsolutePosition(abs[0], abs[1]);
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

    /**
     * 要素の矩形頂点座標を取得する.
     * @return {Array.<number>} [x0, y0, x1, y1].
     */
    getAbsoluteRect: function() {
        var size = this.getSize();
        var pos = this.getAbsolutePosition();
        var x0 = pos[0] - this._paddingLeft;
        var y0 = pos[1] - this._paddingTop;
        var x1 = x0 + size[0] + this._paddingLeft + this._paddingRight;
        var y1 = y0 + size[1] + this._paddingTop + this._paddingBottom;

        return [x0, y0, x1, y1];
    },

    /**
     * 背景を設定する.
     * @param {color: string} background 背景情報.colorは#ffffff形式.
     */
    setBackground: function(background) {
        this._background = background;
        Navy.Loop.requestDraw();
    },

    /**
     * 背景情報を取得する.
     * @param {color: string} background 背景情報. colorは#ffffff形式.
     */
    getBackground: function() {
        //TODO:コピーして渡したほうがいい?
        return this._background;
    },

    /**
     * 表示するかどうかを設定する.
     * @param {boolean} visible 表示非表示.
     */
    setVisible: function(visible) {
        this._visible = visible;
        Navy.Loop.requestDraw();
    },

    /**
     * 表示非表示を取得する.
     * @return {boolean} 表示非表示.
     */
    getVisible: function(visible) {
        return this._visible;
    },

    /**
     * 親をさかのぼって表示非表示を取得する.
     */
    getAbsoluteVisible: function() {
        if (this._visible) {
            return this._parent.getDeepVisible();
        }
        else {
            return false;
        }
    },

    /**
     * サイズを設定する.
     * @param {number} width 横幅px.
     * @param {number} height 縦幅px.
     */
    setSize: function(width, height) {
        this._width = width;
        this._height = height;
        Navy.Loop.requestDraw();
    },

    /**
     * サイズを設定する.
     * @param {Array.<number>} size [width, height].
     */
    setSizeArray: function(size) {
        this.setSize(size[0], size[1]);
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
     * 親要素から自身を削除する.
     */
    removeFromParent: function() {
        this._parent.removeView(this._id);
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

        var pos = this.getAbsolutePosition();
        var x = pos[0];
        var y = pos[1];

        var size = this.getSize();
        var width = size[0];
        var height = size[1];

        var px = x - this._paddingLeft;
        var py = y - this._paddingTop;
        var pwidth = width + this._paddingLeft + this._paddingRight;
        var pheight = height + this._paddingTop + this._paddingBottom;

        if (this._background) {
            if (this._background.color) {
                context.fillStyle = this._background.color;
                context.fillRect(px, py, pwidth, pheight);
            }
        }

        if (this._border) {
            context.fillStyle = this._border.color;
            context.lineWidth = this._border.width;
            context.strokeRect(px, py, pwidth, pheight);
        }

        this._drawExtra(context);
    },

    /**
     * 各view固有の描画をオーバーライドして実装する.
     */
    _drawExtra: function(context) {
    },

    /**
     * 自身を破棄する.
     */
    destroy: function() {
        if (this._parent) {
            this._parent.removeView(this._id);
        }

        this._parent = null;
        this._root = null;

        this._isDestroy = true;
    }
});
