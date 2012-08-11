Navy.View.Button = Navy.View.subclass({
    CLASS: 'Navy.View.Button',

    onChangePage: function($super, page) {
        $super(page);

        if (page) {
            page.addTouchListener(this.getAbsoluteId(), this._onTouch.bind(this));
        }
    },

    _onTouch: function(touchEvent) {
        console.log(touchEvent.action);
    }
});
