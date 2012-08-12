Navy.View.Text = Navy.View.subclass({
    CLASS: 'Navy.View.Text',

    _context: null,
    _text: null,
    _textFont: null,
    _textColor: null,
    _textShadow: null,
    _textSize: null,
    _textLineSpace: null,
    _textVerticalAlign: null,
    _textHorizontalAlign: null,
    _textLines: null,
    _textMeasureWidth: null,
    _textBoxSize: null,
    _textPosition: null,
    _textCutEnd: null,
    _textMultiLine: null,

    /**
     * テキストをセットする.
     * @param {string} text テキスト.
     */
    setText: function(text) {
        this._text = text;
        this._update();
    },

    /**
     * テキストを取得する.
     * @return {string} テキスト.
     */
    getText: function() {
        return this._text;
    },

    /**
     * テキストの色を設定する.
     * @param {string} color #000000形式.
     */
    setTextColor: function(color) {
        this._textColor = color;
        Navy.Loop.requestDraw();
    },

    /**
     * テキストの色を取得する.
     * @return {string} #000000形式.
     */
    getTextColor: function() {
        return this._textColor;
    },

    //TODO:jsdco
    setTextShadow: function(shadow) {
        this._textShadow = shadow;
        Navy.Loop.requestDraw();
    },

    //TODO:jsdco
    getTextShadow: function() {
        //TODO:コピーしたほうが良い?
        return this._textShadow;
    },

    /**
     * テキストのフォントを設定する.
     * @param {string} font フォント名.
     */
    setTextFont: function(font) {
        this._textFont = font;
        this._update();
    },

    /**
     * テキストのフェントを取得する.
     * @return {string} font名.
     */
    getTextFont: function() {
        return this._textFont;
    },

    /**
     * テキストの垂直位置を設定する.
     * @param {string} align top|middle|bottomを指定.
     */
    setTextVerticalAlign: function(align) {
        this._textVerticalAlign = align;
        this._update();
    },

    /**
     * テキストの垂直位置を取得する.
     * @return {string} top|middle|bottomを取得する.
     */
    getTextVerticalAlign: function() {
        return this._textVerticalAlign;
    },

    /**
     * テキストの水平位置を設定する.
     * @param {string} align left|center|rightを指定.
     */
    setTextHorizontalAlign: function(align) {
        this._textHorizontalAlign = align;
        this._update();
    },

    /**
     * テキストの水平位置を取得する.
     * @return {string} left|center|rightを取得する.
     */
    getTextHorizontalAlign: function() {
        return this._textHorizontalAlign;
    },

    /**
     * テキストの行間を指定する.
     * @param {number} space 行間を指定.
     */
    setTextLineSpace: function(space) {
        this._textLineSpace = space;
        this._update();
    },

    /**
     * テキストの行間を取得する.
     * @return {number} 行間を取得.
     */
    getTextLineSpace: function() {
        return this._textLineSpace;
    },

    /**
     * 行がボックスに収まらなかった時の終端文字を設定する.
     * @param {string} cutend 終端文字を指定.
     */
    setTextCutEnd: function(cutend) {
        this._textCutEnd = cutend;
        this._update();
    },

    /**
     * 行がボックスに収まらなかった時の終端文字を取得する.
     * @return {string} 終端文字.
     */
    getTextCutEnd: function() {
        return this._textCutEnd;
    },

    /**
     * 行がボックスの横幅に収まらなかった時に折り返して表示するかどうかを設定する.
     * @param {boolean} flag trueを指定すると折り返す.
     */
    setTextMultiLine: function(flag) {
        this._textMultiLine = flag;
        this._update();
    },

    /**
     * 行がボックスの横幅に収まらなかった時に折り返して表示するかどうかを取得する.
     * @return {boolean} 折り返す場合はtrueを取得する.
     */
    getTextMultiLine: function() {
        return this._textMultiLine;
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
        //TODO:コピー
        return this._textBoxSize;
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

        this._text = layout.extra.text || '';
        this._textColor = layout.extra.color || '#000000';
        this._textShadow = layout.extra.shadow;
        this._textSize = layout.extra.size || 24;
        this._textFont = layout.extra.font || 'sans-serif';
        this._textVerticalAlign = layout.extra.valign || 'left';
        this._textHorizontalAlign = layout.extra.halign || 'top';
        this._textLineSpace = layout.extra.linespace || 0;
        this._textCutEnd = layout.extra.cutend || '';
        this._textMultiLine = ('multiline' in layout.extra ? layout.extra.multiline : true);

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
        context.textBaseline = 'top';
        context.textAlign = 'left';
        context.font = this._textSize + 'px' + ' ' + this._textFont;
        context.fillStyle = this._convertColor(this._textColor);
        
        if (this._textShadow) {
            this._prepareShadow(context, this._textShadow);
        }
    },

    /**
     * 行の表示高さを取得する.
     * @return {number} 行の表示高さ.
     */
    _getLinesHeight: function() {
        //一番上の行はline spaceを持たないので1つ引いておく
        return (this._textLines.length * (this._textSize + this._textLineSpace)) - this._textLineSpace;
    },

    /**
     * 表示を更新する.
     * @param {boolean} noDrawFlag trueにした場合、内部の状態を更新するだけで、描画は行わない.
     */
    _update: function(noDrawFlag) {
        this._updateMeasure();
        this._updateLines();
        this._updateSize();
        this._updatePosition();
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
        this._textMeasureWidth = context.measureText(this._text).width;
    },

    /**
     * テキストの折り返しを更新して、複数行を構成する.
     */
    _updateLines: function() {
        var width = this._width;
        var height = this._height;
        var context = this._context;

        this._prepareContext(context);

        //横幅可変なので、一行になる
        //マルチラインがfalseの場合も一行になる
        if (!width) {
            var textWidth = context.measureText(this._text).width;
            this._textLines = [{line:this._text, width: textWidth}];
            return;
        }

        var lines = [];
        var tmp = '';
        var line = '';
        var words = Navy.Util.String.getWords(this._text);
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
        if (!this._textMultiLine && lines.length > 1) {
            var firstLine = lines[0].line;
            var len = firstLine.length;
            var cutEnd = this._textCutEnd;
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
            line += this._textCutEnd;
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
            var cutEnd = this._textCutEnd;
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
            line += this._textCutEnd;
            lines.push({line: line, width:context.measureText(line).width});
        }
    },

    /**
     * 指定されているwidth,heightとテキストにしたがって、ボックスの大きさを更新する.
     */
    _updateSize: function() {
        var width = this._width;
        var height = this._height;

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
        var size = this.getSize();
        var valign = this._textVerticalAlign;
        var halign = this._textHorizontalAlign;
        var textSize = this._textSize;
        var lineSpace = this._textLineSpace;
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
