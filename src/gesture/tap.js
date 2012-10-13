/**
 * タップイベント
 */
Navy.Gesture.Tap = Navy.Gesture.subclass({
    CLASS: 'Navy.Gesture.Tap',

    /**
     * タッチイベントをタップイベントに変換する.
     * @override
     */
    _onTouch: function($super, touchEvent) {
        $super(touchEvent);

        if (touchEvent.action !== 'end') {
            return;
        }

        var view = touchEvent.target;
        var x = touchEvent.x;
        var y = touchEvent.y;
        var rect = view.getComputedRect();
        var x0 = rect[0];
        var y0 = rect[1];
        var x1 = rect[2];
        var y1 = rect[3];

        if (x0 <= x && x <= x1 && y0 <= y && y <= y1) {
            return this._callListener(touchEvent);
        }
    }
});
