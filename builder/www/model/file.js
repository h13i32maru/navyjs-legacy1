Builder.File = nClass({
    CLASS: 'File',
    filename: '',
    text: null,
    changed: false,
    selected: null,

    initialize: function(filename, text) {
        this.filename = filename;
        this.text = text;
        this.selected = ko.observable(false);
        this.changed = ko.observable(false);
    },

    getFilename: function() {
        return this.filename;
    },

    setText: function(text) {
        if (this.text !== null && this.text !== text) {
            this.changed(true);
        }
        this.text = text;
    },

    getText: function() {
        return this.text;
    },

    toString: function() {
        return this.text;
    }
});
