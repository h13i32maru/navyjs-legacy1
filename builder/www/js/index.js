var Builder = {};

$(function(){
    $.fitsize();
    Navy.App.wakeup();

    Builder.Header.initialize();
    Builder.Config.initialize();
    Builder.Layout.initialize();
    Builder.Code.initialize();
    Builder.Image.initialize();
});
