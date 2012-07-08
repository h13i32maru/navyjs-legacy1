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
    },

    next: function(pageId) {
        if (pageId === '$back') {
            this.back();
            return;
        }

        var currentPage = Navy.Root.getPage(0);

        var page = Navy.PageFactory.create(pageId);
        Navy.Root.pushPage(page);



        //画面遷移
        page.onEnter();
        page.onResumeStart();
        currentPage.onPauseStart();

        var x = 0;
        page.setPosition(640, 0);
        var timerId = setInterval(function() {
            currentPage.addPosition(-40, 0);
            page.addPosition(-40, 0);
            x+=40;
            if (x >= 640) {
                page.onResumeFinish();
                currentPage.onPauseFinish();
                clearInterval(timerId);
            }

        }, Navy.Loop.INTERVAL);

    },

    back: function() {
        var currentPage = Navy.Root.getPage(0);
        var prevPage = Navy.Root.getPage(1);

        //画面遷移
        currentPage.onPauseStart();
        prevPage.onResumeStart();
        var x = 0;
        var timerId = setInterval(function() {
            currentPage.addPosition(10, 0);
            prevPage.addPosition(10, 0);
            x+=10;
            if (x === 640) {
                currentPage.onPauseFinish();
                currentPage.onExit();
                prevPage.onResumeFinish();
                clearInterval(timerId);
                Navy.Root.popPage();
            }

        }, Navy.Loop.INTERVAL);
    }
});
