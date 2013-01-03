var Builder = {};

$(function(){
    $.fitsize();
    Navy.App.wakeup();

    Builder.Header.init();
    Builder.Config.init();
    Builder.Layout.init();
    Builder.Code.init();
    Builder.Image.init();
});
