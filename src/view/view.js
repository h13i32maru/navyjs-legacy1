Navy.View = Navy.Core.subclass({
    CLASS: "Navy.View",
    _x: 0,
    _y: 0,
    _rotation: 0,
    setPosition: function(arg1, arg2){
        if(arguments.length === 1){
            this._x = arg1[0];
            this._y = arg1[1];
        }
        else{
            this._x = arg1;
            this._y = arg2;
        }

        Navy.Loop.requestDraw();
    },
    setRotation: function(rotation){
        this._rotation = rotation;
        Navy.Loop.requestDraw();
    },
    draw: function(context){
    }
});
