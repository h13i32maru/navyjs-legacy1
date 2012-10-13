/**
 * 表示要素の基底クラス
 */
Navy.View = Navy.Core.subclass({
    CLASS: 'Navy.View',

    _isDestroy: false,
    _class: null,
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
    _shadow: null,
    _paddingTop: null,
    _paddingRight: null,
    _paddingBottom: null,
    _paddingLeft: null,

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

        this._class = layout['class'];

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

        //TODO:refactor
        if (Navy.Builder.getEnable() && root) {
            var page = this.getPage();
            if (page) {
                page.addTapListener(this.getAbsoluteId(), function(){
                    //page直下の要素だけが選択対象になる
                    if (this.getPage() === this.getParent()) {
                        Navy.Builder.selectView(this);
                        return false;
                    }
                }.bind(this));
            }
        }
    },

    /**
     * 親pageが変更された時に実行される.
     */
    onChangePage: function(page) {
        this._page = page;
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

    //TODO:jsdoc
    getClass: function() {
        return this._class;
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

    _initLayout: function() {
        this._layout = null;
        this._x = 0;
        this._y = 0;
        this._z = 0;
        this._width = null;
        this._height = null;
        this._rotation = 0;
        this._visible = true;
        this._background = null;
        this._border = null;
        this._shadow = null;
        this._paddingTop = null;
        this._paddingRight = null;
        this._paddingBottom = null;
        this._paddingLeft = null;
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

        if ('shadow' in layout) {
            this.setShadow(layout.shadow);
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

    //TODO:jsdoc
    getAbsoluteZ: function() {
        if (this._parent) {
            var parentZ = this._parent.getAbsoluteZ();
            parentZ.push(this._z);
            return parentZ;
        } else {
            return [this._z];
        }
    },

    //TODO:jsdoc
    getOrderZ: function(view) {
        var myZ = this.getAbsoluteZ();
        var otherZ = view.getAbsoluteZ();

        var i = 0;
        while (true) {
            if (i >= myZ.length && i >= otherZ.length) {
                return 0;
            } else if (i >= myZ.length) {
                return -1;
            } else if (i >= otherZ.length) {
                return 1;
            }

            if (myZ[i] > otherZ[i]) {
                return 1;
            } else if (myZ[i] < otherZ[i]) {
                return -1;
            }

            i++;
        }

        return 0;
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

    //TODO:jsdoc
    setShadow: function(shadow) {
        this._shadow = shadow;
        Navy.Loop.requestDraw();
    },

    //TODO:jsdoc
    getShadow: function() {
        //TODO:コピーしたほうが良い?
        return this._shadow;
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

    //TODO:jsdoc
    getComputedPosition: function() {
        return this.getAbsolutePosition();
    },

    //TODO:jsdoc
    getComputedRect: function() {
        return this.getAbsoluteRect();
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

        context.save();

        var rect = this.getComputedRect();

        var clearShadowFlag = true;
        if (this._shadow) {
            //影の描画は背景もしくは枠線と一緒に行われる.
            //ただし、どちらかでしか行なってはいけない.
            //なぜなら、影が二重に描画されてしまうため.
            this._prepareShadow(context, this._shadow);
            clearShadowFlag = false;
        }

        if (this._background) {
            this._drawBackground(context, this._background, rect);
            this._clearShadow(context);
            clearShadowFlag = true;
        }

        context.restore();

        this._drawExtra(context);

        context.save();

        if (this._border) {
            this._drawBorder(context, this._border, rect);
            this._clearShadow(context);
            clearShadowFlag = true;
        }

        //影が描画されずに残っている場合
        if (!clearShadowFlag) {
            context.strokeRect(rect[0], rect[1], rect[2] - rect[0], rect[3] - rect[1]);
            this._clearShadow(context);
        }

        context.restore();
    },

    //TODO:jsdoc
    _drawBackground: function(context, background, rect) {
        if (!rect) {
            var rect = this.getComputedRect();
        }
        var x0 = rect[0];
        var y0 = rect[1];
        var x1 = rect[2];
        var y1 = rect[3];
        var width = x1 - x0;
        var height = y1 - y0;

        //garidnet or color
        if (this.pp(background, ['gradient', 'colorstop'])) {
            var gradient = background.gradient;
            var direction = gradient.direction;
            var gr = this._createLinearGradient(context, direction, rect);
            var colorstop = gradient.colorstop;
            var colorstoplen = colorstop.length;
            for (var i = 0; i < colorstoplen; i++) {
                gr.addColorStop(colorstop[i][0], this._convertColor(colorstop[i][1]));
            }
            context.fillStyle = gr;
        } else if (background.color) {
            context.fillStyle = this._convertColor(background.color);
        } else {
            return;
        }

        //round-angle or right-angle
        var radiuses = this._parseBoxProperty(background, 'radiuses', 'radius');
        if (radiuses) {
            var r0 = radiuses[0];
            var r1 = radiuses[1];
            var r2 = radiuses[2];
            var r3 = radiuses[3];
            //top -> right -> bottom -> left
            context.beginPath();
            context.arc(x1 - r0, y0 + r0, r0, (Math.PI/180) * 270, 0, false);
            context.arc(x1 - r1, y1 - r1, r1, 0, (Math.PI/180) * 90, false);
            context.arc(x0 + r2, y1 - r2, r2, (Math.PI/180) * 90, (Math.PI/180) * 180, false);
            context.arc(x0 + r3, y0 + r3, r3, (Math.PI/180) * 180, (Math.PI/180) * 270, false);
            context.closePath();
            context.fill();
        } else {
            context.fillRect(x0, y0, width, height);
        }

        if (background.src) {
            Navy.ImageHolder.getImage(background.src, function(image) {
                context.drawImage(image, x0, y0);
            });
        }
    },

    //TODO:jsdoc
    _drawBorder: function(context, border, rect) {
        if (!rect) {
            var rect = this.getComputedRect();
        }
        var x = rect[0];
        var y = rect[1];
        var width = rect[2] - x;
        var height = rect[3] - y;

        var x1 = rect[0];
        var y1 = rect[1];
        var x2 = rect[2];
        var y2 = rect[3];

        //枠線のそれぞれの座標
        var coordinates = [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];
        var colors = this._parseBoxProperty(border, 'colors', 'color');
        var widths = this._parseBoxProperty(border, 'widths', 'width');
        var radiuses = this._parseBoxProperty(border, 'radiuses', 'radius');
        var gradients = this._parseBoxProperty(border, 'gradients', 'gradient');

        if (!widths) { return; }

        for (var i = 0; i < 4; i++) {
            //width
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

            //gradient or single-color
            if (gradients && gradients[i]) {
                var gradient = gradients[i];
                var direction = gradient.direction;
                var gr = this._createLinearGradient(context, direction, rect);
                var colorstop = gradient.colorstop;
                var colorstoplen = colorstop.length;
                for (var j = 0; j < colorstoplen; j++) {
                    gr.addColorStop(colorstop[j][0], this._convertColor(colorstop[j][1]));
                }
                context.strokeStyle = gr;
            } else if (colors[i]) {
                context.strokeStyle = this._convertColor(colors[i]);
            } else {
                continue;
            }

            context.beginPath();
            //round-angle or right-angle
            if (radiuses && radiuses[i]) {
                context.lineCap = 'round';
                context.lineJoin = 'round';
                switch (i) {
                case 0: //top
                    var r0 = radiuses[0];
                    var r3 = radiuses[3];
                    context.arc(sx + r3, sy + r3, r3, (Math.PI/180) * (180 + 45), (Math.PI/180) * 270, false);
                    context.arc(ex - r0, ey + r0, r0, (Math.PI/180) * 270, (Math.PI/180) * (270 + 45), false);
                    break;
                case 1: //right
                    var r0 = radiuses[0];
                    var r1 = radiuses[1];
                    context.arc(sx - r0, sy + r0, r0, (Math.PI/180) * -45, (Math.PI/180) * 0, false);
                    context.arc(ex - r1, ey - r1, r1, (Math.PI/180) * 0, (Math.PI/180) * 45, false);
                    break;
                case 2: //bottom
                    var r1 = radiuses[1];
                    var r2 = radiuses[2];
                    context.arc(sx - r1, sy - r1, r1, (Math.PI/180) * 45, (Math.PI/180) * 90, false);
                    context.arc(ex + r2, ey - r2, r2, (Math.PI/180) * 90, (Math.PI/180) * (90 + 45), false);
                    break;
                case 3: //left
                    var r2 = radiuses[2];
                    var r3 = radiuses[3];
                    context.arc(sx + r2, sy - r2, r2, (Math.PI/180) * (90 + 45), (Math.PI/180) * 180, false);
                    context.arc(ex + r3, ey + r3, r3, (Math.PI/180) * 180, (Math.PI/180) * (180 + 45), false);
                    break;
                default:
                    //TODO:例外
                    console.log("error");
                }
            } else {
                context.lineCap = 'square';
                context.moveTo(sx, sy);
                context.lineTo(ex, ey);
            }
            context.stroke();
        }
    },

    //TODO:jsdco
    _prepareShadow: function(context, shadow) {
        context.shadowOffsetX = shadow.offset[0];
        context.shadowOffsetY = shadow.offset[1];
        context.shadowColor = this._convertColor(shadow.color);
        context.shadowBlur = shadow.blur;
    },

    //TODO:jsdoc
    _clearShadow: function(context) {
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowColor = "rgba(0, 0, 0, 0)";
        context.shadowBlur = 0;
    },

    //TODO:jsdco
    _createLinearGradient: function(context, direction, rect) {
        var x0 = rect[0];
        var y0 = rect[1];
        var x1 = rect[2];
        var y1 = rect[3];
        switch (direction) {
        case 'top':          var gr = context.createLinearGradient(x0, y0, x0, y1); break;
        case 'right':        var gr = context.createLinearGradient(x1, y1, x0, y1); break;
        case 'bottom':       var gr = context.createLinearGradient(x0, y1, x0, y0); break;
        case 'left':         var gr = context.createLinearGradient(x0, y0, x1, y0); break;
        case 'top-right':    //fall down
        case 'right-top':    var gr = context.createLinearGradient(x1, y0, x0, y1); break;
        case 'top-left':     //fall down
        case 'left-top':     var gr = context.createLinearGradient(x0, y0, x1, y1); break;
        case 'bottom-right': //fall down
        case 'right-bottom': var gr = context.createLinearGradient(x1, y1, x0, y0); break;
        case 'bottom-left':  //fall down
        case 'left-bottom':  var gr = context.createLinearGradient(x0, y1, x1, y0); break;
        default:
            //TODO:例外
            console.log('error');
        }

        return gr;
    },

    //TODO: jsdoc
    _parseBoxProperty: function(obj, quadruple, single) {
        if (quadruple in obj) {
            return obj[quadruple];
        } else if (single in obj) {
            return [obj[single], obj[single], obj[single], obj[single]];
        } else {
            return null;
        }
    },

    //TODO:jsdoc
    _convertColor: function(color) {
        if (color.charAt(0) === '#') {
            if (color.length === 7) {
                //#aabbcc
                return color;
            } else if (color.length === 9) {
                //#aabbccdd
                var red = parseInt(color.substr(1, 2), 16);
                var green = parseInt(color.substr(3, 2), 16);
                var blue = parseInt(color.substr(5, 2), 16);
                var alpha = Math.round(100 * parseInt(color.substr(7, 2), 16) / 255) / 100;
                var rgba = 'rgba(' + red + ',' + green + ',' + blue + ',' + alpha + ')';
                return rgba;
            } else {
                //TODO:例外
                console.log('error');
                return null;
            }
        } else {
            //rgb() or rgba()
            return color;
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
