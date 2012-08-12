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
    _z: 0,
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
    initialize: function($super, layout) {
        $super();

        if (layout.id) {
            this._id = layout.id;
        } else {
            this._id = Navy.View.createUniqueId();
        }

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

        if ('z' in layout) {
            this.setZ(layout.z);
        }
        else {
            this.setZ(0);
        }
    },

    /*
     * z方向の順序を設定する.
     * @param {number} z z方向の順序.数値が大きいものほど上に表示される.
     */
    setZ: function(z) {
        this._z = z;
        Navy.Loop.requestDraw();
    },

    /**
     * z方向の順序を取得する.
     * @param {number} z方向の順序. 数値が大きいものほど上に表示される.
     */
    getZ: function() {
        return this._z;
    },

    /**
     * 4辺全てのパディングを同じ値に設定する.
     * @param {number} padding パッディングの値.
     */
    setPaddingOne: function(padding) {
        this.setPadding(padding, padding, padding, padding);
    },

    /**
     * 4辺のパディングをそれぞれ配列で設定する.
     * @param {Array<number>} padding padding[0]=上, padding[1]=右, padding[2]=下, padding[3]=左.
     */
    setPaddingArray: function(padding) {
        this.setPadding(padding[0], padding[1], padding[2], padding[3]);
    },

    /**
     * 4辺のパディングを設定する.
     * @param {number} top 上パッディング.
     * @param {number} right 右パッディング.
     * @param {number} bottom 下パッディング.
     * @param {number} left 左パッディング.
     */
    setPadding: function(top, right, bottom, left) {
        this._paddingTop = top;
        this._paddingRight = right;
        this._paddingBottom = bottom;
        this._paddingLeft = left;
        Navy.Loop.requestDraw();
    },

    /**
     * 4辺のパディングを配列で取得する.
     * @return {Array<number>} padding[0]=上, padding[1]=右, padding[2]=下, padding[3]=左.
     */
    getPadding: function() {
        return [this._paddingTop, this._paddingRight, this._paddingBottom, this._paddingLeft];
    },

    /**
     * 枠線を設定する.
     * @param {{color: string, width: number}} border 枠線の設定. color=#001122形式, width=枠線の幅.
     */
    setBorder: function(border) {
        this._border = border;
        Navy.Loop.requestDraw();
    },

    /**
     * 枠線を取得する.
     * @return {{color: string, width: number}} 枠線の設定.
     */
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
     * 指定された座標がviewの領域内かチェックする.
     * @param {number} x 絶対座標でのx.
     * @param {number} y 絶対座標でのy.
     * @return {boolean} 領域内の場合true.
     */
    checkAbosluteRect: function(x, y) {
        var rect = this.getAbsoluteRect();
        var x0 = rect[0];
        var y0 = rect[1];
        var x1 = rect[2];
        var y1 = rect[3];

        if (x0 <= x && x <= x1 && y0 <= y && y <= y1) {
            return true;
        }
        return false;
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

        var rect = this.getAbsoluteRect();
        if (this._background) {
            this._drawBackground(context, this._background, rect);
        }

        if (this._border) {
            this._drawBorder(context, this._border, rect);
        }

        this._drawExtra(context);
    },

    //TODO:jsdoc
    _drawBackground: function(context, background, rect) {
        if (!rect) {
            var rect = this.getAbsoluteRect();
        }
        var x = rect[0];
        var y = rect[1];
        var width = rect[2] - x;
        var height = rect[3] - y;

        if (background.alpha) {
            var origAlpha = context.globalAlpha;
            context.globalAlpha = background.alpha;
        }

        if (background.color) {
            context.fillStyle = background.color;
            context.fillRect(x, y, width, height);
        }

        if (background.image) {
            Navy.ImageHolder.getImage(background.image, function(image) {
                var origAlpha = context.globalAlpha;
                context.globalAlpha = background.alpha;
                context.drawImage(image, x, y);
                context.globalAlpha = origAlpha;
            });
        }

        context.globalAlpha = origAlpha;
    },

    //TODO:jsdoc
    _drawBorder: function(context, border, rect) {
        if (!rect) {
            var rect = this.getAbsoluteRect();
        }
        var x = rect[0];
        var y = rect[1];
        var width = rect[2] - x;
        var height = rect[3] - y;

        if (border.alpha) {
            var origAlpha = context.globalAlpha;
            context.globalAlpha = border.alpha;
        }

        var x1 = rect[0];
        var y1 = rect[1];
        var x2 = rect[2];
        var y2 = rect[3];

        var coordinates = [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];
        var colors = this._parseBoxProperty(border, 'colors', 'color');
        var widths = this._parseBoxProperty(border, 'widths', 'width');
        var gradients = this._parseBoxProperty(border, 'gradients', 'gradient');

        context.lineCap = 'square';
        for (var i = 0; i < 4; i++) {
            if (widths[i]) {
                context.lineWidth = widths[i];
            } else {
                continue;
            }

            var next = (i + 1) % 4;
            //startx, starty, endx, endy
            var sx = coordinates[i][0];
            var sy = coordinates[i][1];
            var ex = coordinates[next][0];
            var ey = coordinates[next][1];

            if (gradients[i]) {
                var gr = context.createLinearGradient(sx, sy, ex, ey);
                var gradient = gradients[i];
                var gradientlen = gradient.length;
                for (var j = 0; j < gradientlen; j++) {
                    gr.addColorStop(gradient[j][0], gradient[j][1]);
                }
                context.strokeStyle = gr;
            } else if (colors[i]) {
                context.strokeStyle = colors[i];
            } else {
                continue;
            }

            context.beginPath();
            context.moveTo(sx, sy);
            context.lineTo(ex, ey);
            context.stroke();
        }

        context.globalAlpha = origAlpha;
    },

    //TODO: jsdoc
    _parseBoxProperty: function(obj, quadruple, single) {
        if (obj[quadruple]) {
            return obj[quadruple];
        } else if (obj[single]) {
            return [obj[single], obj[single], obj[single], obj[single]];
        } else {
            return null;
        }
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

/**
 * ユニークIDを生成する.
 * @return {string} ユニークなID.
 */
Navy.View.createUniqueId = function() {
    var seq;
    if (this._idSequence) {
        seq = this._idSequence;
        this._idSequence++;
    } else {
        seq = 0;
        this._idSequence = 1;
    }

    return 'id_' + seq;
}
