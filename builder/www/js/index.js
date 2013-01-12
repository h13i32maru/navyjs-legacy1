var Builder = {};

$(function(){
    $.fitsize();
    Navy.App.wakeup();

    Builder.Header.initialize();
    Builder.Layout.initialize();
    Builder.Code.initialize();
    Builder.Image.initialize();

    //Config
    Builder.Config.initialize();
    $.contextMenu({
        selector: '.n-config .n-filelist li',
        items: {
            save: {name: 'Save', callback: function(key, ev){ Builder.Config.save(key, ev); }}
        }
    });
    ko.applyBindings(Builder.Config, $('.n-config')[0]);
});
