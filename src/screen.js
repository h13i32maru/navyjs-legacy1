Navy.Screen = Navy.Core.instance({
    CLASS: 'Navy.Screen',

    initialize: function($super, canvas) {
        Navy.Root.wakeup(canvas);

        var mainPageId = Navy.Config.App.mainPageId;
        
        Navy.PageFactory.wakeup();
        var page = Navy.PageFactory.create(mainPageId);
        Navy.Root.pushPage(page);

        page.onEnter();
        page.onResumeStart();
        page.onResumeFinish();
    }
});
