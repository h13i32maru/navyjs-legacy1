/**
 * スライドして画面遷移するクラス
 */
Navy.Transition.Slide = Navy.Transition.subclass({
    CLASS: 'Navy.Transition.Slide',

    //画面遷移に必要とする時間msec
    TIME: 50,

    _timeCount: 0,

    _forStart: null,
    _forBack: null,

    start: function($super) {
        $super();

        var size = Navy.Root.getSize();
        this._newPage.setPosition(size[0], 0);

        this._timeCount = 0;
        this._forStart = this._onUpdateForStart.bind(this);
        Navy.Timer.addListener(this._forStart);
    },

    _onUpdateForStart: function(delta) {
        this._timeCount += delta;

        if (this.TIME <= this._timeCount) {
            var size = this._currentPage.getSize();
            this._currentPage.setPosition(-size[0], 0);
            this._newPage.setPosition(0, 0);
            Navy.Timer.removeListener(this._forStart);

            this._callStartCompleteListener();
        }
        else {
            var dx = -this._getDeltaX(delta);
            this._currentPage.addPosition(dx, 0);
            this._newPage.addPosition(dx, 0);
        }
    },

    back: function($super) {
        $super();

        this._timeCount = 0;
        this._forBack = this._onUpdateForBack.bind(this);
        Navy.Timer.addListener(this._forBack);
    },

    _onUpdateForBack: function(delta) {
        this._timeCount += delta;

        if (this.TIME <= this._timeCount) {
            var size = Navy.Root.getSize();
            this._currentPage.setPosition(size[1], 0);
            this._previousPage.setPosition(0, 0);
            Navy.Timer.removeListener(this._forBack);

            this._callBackCompleteListener();
        }
        else {
            var dx = this._getDeltaX(delta);
            this._currentPage.addPosition(dx, 0);
            this._previousPage.addPosition(dx, 0);
        }
    },

    _getDeltaX: function(deltaTime) {
        var size = Navy.Root.getSize();
        var speed = size[0] / this.TIME;
        return ~~(deltaTime * speed);
    }
});
