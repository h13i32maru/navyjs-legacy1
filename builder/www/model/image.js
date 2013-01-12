Builder.Image = nClass.instance(Builder.Core, {
    CLASS: 'Image',
    type: 'image',

    onDoneReadFilenames: function($super, filenames) {
        var sources = [];
        for (var i = 0; i < filenames.length; i++) {
            var src = Builder.Util.format('/data/%s/%s/%s', [this.project, this.type, filenames[i]]);
            sources.push(src);
        }
        $super(sources);
    }
});
