var Builder = {};

$(function(){
    $.fitsize();
    Navy.App.wakeup();

    Builder.Header.initialize();
    Builder.Layout.initialize();

    //Config
    Builder.Config.initialize();
    $.contextMenu({
        selector: '.n-config .n-filelist li',
        items: {
            save: {name: 'Save', callback: function(key, ev){ Builder.Config.onClickSave(key, ev); }}
        }
    });
    Builder.Config.koVisible(true);
    ko.applyBindings(Builder.Config, $('.n-config')[0]);

    //Code
    parentElm = $('.n-code .n-textarea')[0];
    var makeEditor = function(text) {
        return CodeMirror(parentElm, {lineNumbers: true, mode: 'javascript', value: text});
    }
    Builder.Code.initialize(makeEditor);
    $.contextMenu({
        selector: '.n-code .n-filelist li',
        items: {
            save: {name: 'Save', callback: function(key, ev){ Builder.Code.onClickSave(key, ev); }}
        }
    });
    ko.applyBindings(Builder.Code, $('.n-code')[0]);

    //Image
    Builder.Image.initialize();
    ko.applyBindings(Builder.Image, $('.n-image')[0]);
});
