Navy.View.Image = Navy.View.subclass({
    CLASS: "Navy.View.Image",
    _loaded: false,
    _image: null,
    initialize: function($super){
        $super();
        this._image = new Image();
    },
    setImage: function(src){
        this._loaded = false;
        this._image.addEventListener("load", this._onLoad.bind(this), false);
        this._image.src = src;
    },
    _onLoad: function(){
        this._loaded = true;
        Navy.Loop.requestDraw();
    },
    draw: function($super, context){
        $super(context);

        if(!this._loaded){
            return;
        }

        //context.save();
        //context.setTransform(1, 0, 0, 1, 0, 0);
        //context.translate(this._x + this._image.width/2, this._y + this._image.height/2);
        //context.rotate(this._rotation * Math.PI / 180);
        //context.drawImage(this._image, this._x - this._image.width / 2, this._y - this._image.height / 2);
        //context.restore();
        context.drawImage(this._image, this._x, this._y);
    }
});
