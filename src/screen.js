/**
 * 画面の管理を行うインスタンス.
 */
Navy.Screen = Navy.Core.instance({
    CLASS: 'Navy.Screen',

    //画面遷移の情報
    _transitionStack: null,

    initialize: function($super, mainPageId) {
        var page = Navy.Page.create(mainPageId);
        Navy.Root.pushPage(page);

        page.onCreate();
        page.onResumeStart();
        page.onResumeFinish();

        this._transitionStack = [];
    },

    /**
     * 次のページに移動する.
     * @param {string} pageId 次のページのIDをpage.jsonに設定されているものか指定する.
     */
    next: function(pageId) {
        var currentPage = Navy.Root.getPage(0);

        var newPage = Navy.Page.create(pageId);
        Navy.Root.pushPage(newPage);

        newPage.onCreate();
        newPage.onResumeStart();
        currentPage.onPauseStart();

        var transition = new Navy.Transition.Slide(currentPage, newPage);
        transition.addNextCompleteListener(function(currentPage, newPage) {
            currentPage.onPauseFinish();
            newPage.onResumeFinish();
        });

        transition.next();

        this._transitionStack.push({
            transition: transition,
            previousPage: currentPage,
            currentPage: newPage
        });
    },

    /**
     * 前のページに戻る.
     */
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
            currentPage.destroy();

            previousPage.onResumeFinish();

            Navy.Root.popPage();
        });
        transition.back();
    }
});
