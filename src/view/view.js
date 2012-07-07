Navy.View = Navy.Core.subclass({
    CLASS: "Navy.View",

    _data: null,
    _x: 0,
    _y: 0,
    _width: 0,
    _height: 0,
    _rotation: 0,
    _touchListeners: null,

    initialize: function($super) {
        $super();

        this._data = {};
        this._touchListeners = [];

        Navy.Root.addTouchListener(this, this._onTouch.bind(this));
    },

    setData: function(key, value) {
        this._data[key] = value;
    },

    getData: function(key, defaultValue) {
        return this._data[key] || defaultValue;
    },

    setPosition: function(x, y){
        this._x = x;
        this._y = y;

        Navy.Loop.requestDraw();
    },

    getPosition: function() {
        return [this._x, this._y];
    },

    getSize: function() {
        return [this._width, this._height];
    },

    setRotation: function(rotation){
        this._rotation = rotation;
        Navy.Loop.requestDraw();
    },

    draw: function(context){
    },

    addTouchListener: function(listener){
        this._touchListeners.push(listener);
    },

    _onTouch: function(touchEvent){
        for (var i = 0; i < this._touchListeners.length; i++) {
            this._touchListeners[i](touchEvent);
        }
    }
});
