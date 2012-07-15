Navy.View.Text = Navy.View.subclass({
    CLASS: 'Navy.View.Text',

    _textFont: null,
    _textColor: null,
    _textSize: null,
    _text: null,
    _textMeasureWidth: null,

    _setLayout: function($super, layout) {
        $super(layout);

        this._textColor = layout.extra.color;
        this._textSize = layout.extra.size;
        this._textFont = layout.extra.font;

        this.setText(layout.extra.text);
    },

    setText: function(text) {
        this._text = text;

        //textの幅を測定する
        var context = Navy.App.getContext();
        //context.save();
        this._prepareContext(context);
        this._textMeasureWidth = context.measureText(text).width;
        //context.restore();

        Navy.Loop.requestDraw();
    },

    getText: function() {
        return this._text;
    },

    //TODO:各プロパティのgetter/setter

    getTextWidth: function() {
        return this._textMeasureWidth;
    },

    getSize: function($super) {
        var size = $super();
        if (size[0] !== null && size[1] !== null) {
            return size;
        }

        return [this._textMeasureWidth, this._textSize];
    },

    _drawExtra: function($super, context) {
        $super(context);

        var pos = this.getPosition();

        this._prepareContext(context);
        context.fillText(this._text, pos[0], pos[1]);
    },

    _prepareContext: function(context) {
        context.textBaseline = 'top';
        //context.textAlign = 'center';

        context.font = this._textSize + 'px' + ' ' + this._textFont;
        context.fillStyle = this._textColor;
    }
});
