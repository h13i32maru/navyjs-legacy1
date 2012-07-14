Navy.Screen = Navy.Core.instance({
    CLASS: 'Navy.Screen',

    //画面遷移の情報
    _transitionStack: null,

    initialize: function($super, canvas) {
        var mainPageId = Navy.Config.App.mainPageId;
        
        var page = Navy.Page.create(mainPageId);
        Navy.Root.pushPage(page);

        page.onCreate();
        page.onResumeStart();
        page.onResumeFinish();

        this._transitionStack = [];
    },

    next: function(pageId) {
        var currentPage = Navy.Root.getPage(0);

        var newPage = Navy.Page.create(pageId);
        Navy.Root.pushPage(newPage);

        newPage.onCreate();
        newPage.onResumeStart();
        currentPage.onPauseStart();

        var transition = new Navy.Transition.Slide(currentPage, newPage);
        transition.addStartCompleteListener(function(currentPage, newPage) {
            currentPage.onPauseFinish();
            newPage.onResumeFinish();
        });

        transition.start();

        this._transitionStack.push({
            transition: transition,
            previousPage: currentPage,
            currentPage: newPage
        });
    },

    back: function() {
        var stack = this._transitionStack.pop();

        var previousPage = stack.previousPage;
        var currentPage = stack.currentPage;

        previousPage.onResumeStart();
        currentPage.onPauseStart();

        var transition = stack.transition;
        transition.addBackCompleteListener(function(previousPage, currentPage) {
            currentPage.onPauseFinish();
            currentPage.onDestroy();

            previousPage.onResumeFinish();

            Navy.Root.popPage();
        });
        transition.back();
    }
});
