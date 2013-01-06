Navy.View.Text = Navy.View.subclass({
    CLASS: 'Navy.View.Text',

    _context: null,
    _textLines: null,
    _textMeasureWidth: null,
    _textBoxSize: null,

    /**
     * テキストをセットする.
     * @param {string} text テキスト.
     */
    setText: function(text) {
        this._extra.text = text;
        this._update();
    },

    /**
     * テキストを取得する.
     * @return {string} テキスト.
     */
    getText: function() {
        return this._extra.text;
    },

    /**
     * テキストの色を設定する.
     * @param {string} color #000000形式.
     */
    setTextColor: function(color) {
        this._extra.text.color = color;
        Navy.Loop.requestDraw();
    },

    /**
     * テキストの色を取得する.
     * @return {string} #000000形式.
     */
    getTextColor: function() {
        return this._extra.text.color;
    },

    //TODO:jsdco
    setTextShadow: function(shadow) {
        this._extra.text.shadow = shadow;
        Navy.Loop.requestDraw();
    },

    //TODO:jsdco
    getTextShadow: function() {
        return this.clone(this._extra.text.shadow);
    },

    /**
     * テキストのフォントを設定する.
     * @param {string} font フォント名.
     */
    setTextFont: function(font) {
        this._extra.text.font = font;
        this._update();
    },

    /**
     * テキストのフェントを取得する.
     * @return {string} font名.
     */
    getTextFont: function() {
        return this._extra.text.font;
    },

    //TODO:jsdco
    setTextWeight: function(weight) {
        this._extra.text.weight = weight;
        this._update();
    },

    //TODO:jsdoc
    getTextWeight: function() {
        return this._extra.text.weight;
    },

    //TODO:jsdco
    setTextStyle: function(style) {
        this._extra.text.style = style;
        this._update();
    },

    //TODO:jsdco
    getTextStyle: function() {
        return this._extra.text.style;
    },

    /**
     * テキストの垂直位置を設定する.
     * @param {string} align top|middle|bottomを指定.
     */
    setTextVerticalAlign: function(align) {
        this._extra.text.valign = align;
        this._update();
    },

    /**
     * テキストの垂直位置を取得する.
     * @return {string} top|middle|bottomを取得する.
     */
    getTextVerticalAlign: function() {
        return this._extra.text.valign;
    },

    /**
     * テキストの水平位置を設定する.
     * @param {string} align left|center|rightを指定.
     */
    setTextHorizontalAlign: function(align) {
        this._extra.text.halign = align;
        this._update();
    },

    /**
     * テキストの水平位置を取得する.
     * @return {string} left|center|rightを取得する.
     */
    getTextHorizontalAlign: function() {
        return this._extra.text.halign;
    },

    /**
     * テキストの行間を指定する.
     * @param {number} space 行間を指定.
     */
    setTextLineSpace: function(space) {
        this._extra.text.linespace = space;
        this._update();
    },

    /**
     * テキストの行間を取得する.
     * @return {number} 行間を取得.
     */
    getTextLineSpace: function() {
        return this._extra.text.linespace;
    },

    /**
     * 行がボックスに収まらなかった時の終端文字を設定する.
     * @param {string} cutend 終端文字を指定.
     */
    setTextCutEnd: function(cutend) {
        this._extra.text.cutend = cutend;
        this._update();
    },

    /**
     * 行がボックスに収まらなかった時の終端文字を取得する.
     * @return {string} 終端文字.
     */
    getTextCutEnd: function() {
        return this._extra.text.cutend;
    },

    /**
     * 行がボックスの横幅に収まらなかった時に折り返して表示するかどうかを設定する.
     * @param {boolean} flag trueを指定すると折り返す.
     */
    setTextMultiLine: function(flag) {
        this._extra.text.multiline = flag;
        this._update();
    },

    /**
     * 行がボックスの横幅に収まらなかった時に折り返して表示するかどうかを取得する.
     * @return {boolean} 折り返す場合はtrueを取得する.
     */
    getTextMultiLine: function() {
        return this._extra.text.multiline;
    },

    /**
     * @override
     */
    setSize: function($super, width, height) {
        $super(width, height);
        this._update();
    },

    /**
     * @override
     */
    getSize: function() {
        return this.clone(this._textBoxSize);
    },

    /**
     * @override
     */
    setPosition: function($super, x, y) {
        $super(x, y);
        this._update();
    },

    /**
     * @override
     */
    _setLayout: function($super, layout) {
        this._context = Navy.App.getContext();

        if (layout.extra) {
            var e = layout.extra;
            e.text = e.text || '';
            e.color = e.color || '#000000';
            e.size = e.size || 24;
            e.font = e.font || 'sans-serif';
            e.weight = e.weight || 'normal';
            e.style = e.style || 'normal';
            e.valign = e.valign || 'left';
            e.halign = e.halign || 'top';
            e.linespace = e.linespace || 0;
            e.cutend = e.cutend || '';
            e.multiline = ('multiline' in e ? e.multiline : true);
        }

        $super(layout);

        this._update(true);
    },

    /**
     * @override
     */
    _drawExtra: function($super, context) {
        $super(context);

        this._prepareContext(context);

        var pos = this.getAbsolutePosition();

        var lines = this._textLines;
        var len = lines.length;
        for (var i = 0; i < len; i++) {
            var line = lines[i].line;
            var x = pos[0] + lines[i].dx;
            var y = pos[1] + lines[i].dy;
            context.fillText(line, x, y);
        }

        this._clearShadow(context);
    },

    /**
     * 描画コンテキストを設定する.
     * @param {CanvasContext} context canvas 2dコンテキスト.
     */
    _prepareContext: function(context) {
        var extra = this._extra;
        context.textBaseline = 'top';
        context.textAlign = 'left';
        context.font = extra.style + ' ' + extra.weight + ' ' + extra.size + 'px' + ' ' + extra.font;
        context.fillStyle = this._convertColor(extra.color);
        
        if (extra.shadow) {
            this._prepareShadow(context, extra.shadow);
        }
    },

    /**
     * 行の表示高さを取得する.
     * @return {number} 行の表示高さ.
     */
    _getLinesHeight: function() {
        var extra = this._extra;
        //一番上の行はline spaceを持たないので1つ引いておく
        return (this._textLines.length * (extra.size + extra.linespace)) - extra.linespace;
    },

    /**
     * 表示を更新する.
     * @param {boolean} noDrawFlag trueにした場合、内部の状態を更新するだけで、描画は行わない.
     */
    _update: function(noDrawFlag) {
        this._context.save();

        this._updateMeasure();
        this._updateLines();
        this._updateSize();
        this._updatePosition();

        this._context.restore();

        if (!noDrawFlag) {
            Navy.Loop.requestDraw();
        }
    },

    /**
     * テキストの表示幅を更新する.
     */
    _updateMeasure: function() {
        var context = Navy.App.getContext();
        this._prepareContext(context);
        this._textMeasureWidth = context.measureText(this._extra.text).width;
    },

    /**
     * テキストの折り返しを更新して、複数行を構成する.
     */
    _updateLines: function() {
        var extra = this._extra;
        var width = this._layout.size[0];
        var height = this._layout.size[1];
        var context = this._context;

        this._prepareContext(context);

        //横幅可変なので、一行になる
        //マルチラインがfalseの場合も一行になる
        if (!width) {
            var textWidth = context.measureText(extra.text).width;
            this._textLines = [{line:extra.text, width: textWidth}];
            return;
        }

        var lines = [];
        var tmp = '';
        var line = '';
        var words = Navy.Util.String.getWords(extra.text);
        var len = words.length;

        //単語をつなぎあわせて、横幅を超えないところを一行としていく
        for (var i = 0; i < len; i++) {
            if (words[i] === '\n') {
                var textWidth = context.measureText(line).width;
                lines.push({line: line, width: textWidth});
                line = '';
                tmp = '';
                continue;
            }
            else {
                tmp += words[i];

                if (context.measureText(tmp).width <= width) {
                    line = tmp;
                }
                else {
                    var textWidth = context.measureText(line).width;
                    lines.push({line: line, width: textWidth});
                    line = '';
                    tmp = '';
                    //一つ前の単語から捜査していく
                    i--;
                }
            }
        }

        //最後の行
        if (words[len - 1] === '\n') {
            var textWidth = context.measureText('').width;
            lines.push({line: '', width: textWidth});
        }
        else if (tmp !== '') {
            var textWidth = context.measureText(tmp).width;
            lines.push({line: tmp, width: textWidth});
        }

        //複数行禁止の場合、複数行あったらカットする必要がある
        if (!this._extra.multiline && lines.length > 1) {
            var firstLine = lines[0].line;
            var len = firstLine.length;
            var cutEnd = extra.cutend;
            var line;
            var tmp = '';
            for (var i = 0; i < len; i++) {
                tmp += firstLine.charAt(i);
                if (context.measureText(tmp + cutEnd).width <= width) {
                    line = tmp;
                }
                else {
                    break;
                }
            }
            line += extra.cutend;
            lines = [{line: line, width:context.measureText(line).width}];

        }

        this._textLines = lines;

        //高さ固定の場合はカットする必要がある
        var linesHeight = this._getLinesHeight();
        if (height && height < linesHeight) {
            var len = lines.length;
            for (var i = 0; i < len; i++) {
                linesHeight = this._getLinesHeight();
                if (height < linesHeight) {
                    lines.pop();
                }
                else {
                    break;
                }
            }

            //最後の行の末尾をcut endに置き換える
            var lastLine = lines.pop().line;
            var len = lastLine.length;
            var cutEnd = extra.cutend;
            var line;
            var tmp = '';
            for (var i = 0; i < len; i++) {
                tmp += lastLine.charAt(i);
                if (context.measureText(tmp + cutEnd).width <= width) {
                    line = tmp;
                }
                else {
                    break;
                }
            }
            line += extra.cutend;
            lines.push({line: line, width:context.measureText(line).width});
        }
    },

    /**
     * 指定されているwidth,heightとテキストにしたがって、ボックスの大きさを更新する.
     */
    _updateSize: function() {
        var width = this._layout.size[0];
        var height = this._layout.size[1];

        if (width !== null) {
            //横固定、縦固定[width, height]
            if (height !== null) {
                this._textBoxSize = [width, height];
                return;
            }
            //横固定、縦可変[width, null]
            else {
                var textHeight = this._getLinesHeight();
                this._textBoxSize = [width, textHeight];
                return;
            }
        }
        else {
            //横可変、縦固定[null, height]
            if(height !== null) {
                this._textBoxSize = [this._textMeasureWidth, height];
                return;
            }
            //横可変、横可変[null, null](テキストにちょうどのサイズ)
            else {
                var textHeight = this._getLinesHeight();
                this._textBoxSize = [this._textMeasureWidth, textHeight];
                return;
            }
        }
    },

    /**
     * テキストの水平、垂直位置を更新する.
     */
    _updatePosition: function() {
        var extra = this._extra;
        var size = this.getSize();
        var valign = extra.valign;
        var halign = extra.halign;
        var textSize = extra.size;
        var lineSpace = extra.linespace;
        var dx;
        var dy;
        var lines = this._textLines;
        var len = lines.length;

        switch (valign) {
        case 'top':
            dy = 0;
            break;
        case 'middle':
            dy = (size[1] - this._getLinesHeight()) / 2;
            break;
        case 'bottom':
            dy = (size[1] - this._getLinesHeight());
            break;
        }

        for (var i = 0; i < len; i++) {
            switch (halign) {
            case 'center':
                dx = (size[0] - lines[i].width) / 2;
                break;
            case 'left':
                dx = 0;
                break;
            case 'right':
                dx = size[0] - lines[i].width;
                break;
            }

            lines[i].dx = dx;
            lines[i].dy = dy + (i * (textSize + lineSpace));
        }
    }
});
