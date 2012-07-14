/**
 * スライドして画面遷移するクラス
 */
Navy.Transition.Slide = Navy.Transition.subclass({
    CLASS: 'Navy.Transition.Slide',

    //画面遷移に必要とする時間msec
    TIME: 50,

    _timeCount: 0,

    /** next時に使用するタイマーリスナー */
    _forNext: null,

    /** back時に使用するタイマーリスナー */
    _forBack: null,

    /** @override */
    next: function($super) {
        $super();

        var size = Navy.Root.getSize();
        this._newPage.setPosition(size[0], 0);

        this._timeCount = 0;
        this._forNext = this._onUpdateForNext.bind(this);
        Navy.Timer.addListener(this._forNext);
    },

    /** nextで使用するタイマーリスナー */
    _onUpdateForNext: function(delta) {
        this._timeCount += delta;

        if (this.TIME <= this._timeCount) {
            var size = this._currentPage.getSize();
            this._currentPage.setPosition(-size[0], 0);
            this._newPage.setPosition(0, 0);
            Navy.Timer.removeListener(this._forNext);

            this._callNextCompleteListener();
        }
        else {
            var dx = -this._getDeltaX(delta);
            this._currentPage.addPosition(dx, 0);
            this._newPage.addPosition(dx, 0);
        }
    },

    /** @override */
    back: function($super) {
        $super();

        this._timeCount = 0;
        this._forBack = this._onUpdateForBack.bind(this);
        Navy.Timer.addListener(this._forBack);
    },

    /** backで使用するタイマーリスナー */
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

    /**
     * ページの移動量を取得する.
     * @return {number} 移動量px.
     */
    _getDeltaX: function(deltaTime) {
        var size = Navy.Root.getSize();
        var speed = size[0] / this.TIME;
        return ~~(deltaTime * speed);
    }
});
