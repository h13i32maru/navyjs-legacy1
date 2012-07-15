Navy.View.Text = Navy.View.subclass({
    CLASS: 'Navy.View.Text',

    _context: null,
    _text: null,
    _textFont: null,
    _textColor: null,
    _textSize: null,
    _textVerticalAlign: null,
    _textHorizontalAlign: null,
    _textLines: null,
    _textMeasureWidth: null,
    _textBoxSize: null,
    _textPosition: null,

    setText: function(text) {
        this._text = text;
        this._update();
    },

    getText: function() {
        return this._text;
    },

    setColor: function(color) {
        this._textColor = color;
    },

    getColor: function() {
        return this._textColor;
    },

    setFont: function(font) {
        this._textFont = font;
        this._update();
    },

    getFont: function() {
        return this._textFont;
    },

    //left, center, right
    setVerticalAlign: function(align) {
        this._textVerticalAlign = align;
        this._update();
    },

    getVerticalAlign: function() {
        return this._textVerticalAlign;
    },

    //top, middle, bottom
    setHorizontalAlign: function(align) {
        this._textHorizontalAlign = align;
        this._update();
    },

    getHorizontalAlign: function() {
        return this._textHorizontalAlign;
    },

    setSize: function($super, width, height) {
        $super(width, height);
        this._update();
    },

    getSize: function() {
        //TODO:コピー
        return this._textBoxSize;
    },

    setPosition: function($super, x, y) {
        $super(x, y);
        this._update();
    },

    _setLayout: function($super, layout) {
        this._context = Navy.App.getContext();

        this._text = layout.extra.text || '';
        this._textColor = layout.extra.color || '#000000';
        this._textSize = layout.extra.size || 24;
        this._textFont = layout.extra.font || 'sans-serif';
        this._textVerticalAlign = layout.extra.valign || 'left';
        this._textHorizontalAlign = layout.extra.halign || 'top';

        $super(layout);

        this._update(true);
    },

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
    },

    _prepareContext: function(context) {
        context.textBaseline = 'top';
        context.textAlign = 'left';
        context.font = this._textSize + 'px' + ' ' + this._textFont;
        context.fillStyle = this._textColor;
    },

    _update: function(noDrawFlag) {
        this._updateMeasure();
        this._updateLines();
        this._updateSize();
        this._updatePosition();
        if (!noDrawFlag) {
            Navy.Loop.requestDraw();
        }
    },

    _updateMeasure: function() {
        var context = Navy.App.getContext();
        this._prepareContext(context);
        this._textMeasureWidth = context.measureText(this._text).width;
    },

    _updateLines: function() {
        var width = this._width;
        var context = this._context;

        this._prepareContext(context);

        //横幅可変なので、一行になる
        if (!width) {
            var measureWidth = context.measureText(this._text).width;
            this._textLines = [{line:this._text, width: measureWidth}];
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
                var measureWidth = context.measureText(line).width;
                lines.push({line: line, width: measureWidth});
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
                    var measureWidth = context.measureText(line).width;
                    lines.push({line: line, width: measureWidth});
                    line = '';
                    tmp = '';
                    i--;
                }
            }
        }

        //最後の行
        if (words[len - 1] === '\n') {
            var measureWidth = context.measureText('').width;
            lines.push({line: '', width: measureWidth});
        }
        else if (tmp !== '') {
            var measureWidth = context.measureText(tmp).width;
            lines.push({line: tmp, width: measureWidth});
        }

        this._textLines = lines;
    },

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
                //TODO:line space考慮
                this._textBoxSize = [width, this._textLines.length * this._textSize];
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
                this._textBoxSize = [this._textMeasureWidth, this._textSize];
                return;
            }
        }
    },

    _updatePosition: function() {
        var size = this.getSize();
        var valign = this._textVerticalAlign;
        var halign = this._textHorizontalAlign;
        var textSize = this._textSize;
        var dx;
        var dy;
        var lines = this._textLines;
        var len = lines.length;

        switch (halign) {
        case 'top':
            dy = 0;
            break;
        case 'middle':
            //TODO:linespace考慮
            dy = (size[1] - (textSize * len)) / 2;
            break;
        case 'bottom':
            //TODO:linespace考慮
            dy = (size[1] - (textSize * len));
            break;
        }

        for (var i = 0; i < len; i++) {
            switch (valign) {
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
            lines[i].dy = dy + (i * textSize);
        }
    }
});
