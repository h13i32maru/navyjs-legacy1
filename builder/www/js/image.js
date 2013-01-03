Builder.Image = nClass.instance(Builder.Core, {
    CLASS: 'Image',
    target: '.n-image',
    type: 'image',

    save: function($super) {
        //画像の保存は何もしない
    },

    onReadFilenames: function($super, data) {
        var sources = [];
        for (var i = 0; i < data.length; i++) {
            var src = Builder.Util.format('/data/%s/%s/%s', [this.project, this.type, data[i]]);
            sources.push(src);
        }
        this.filenames(sources);
    }
});
