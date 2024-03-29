/**
 * 画面の管理を行うインスタンス.
 */
Navy.Screen = Navy.Core.instance({
    CLASS: 'Navy.Screen',

    //画面遷移の情報
    _transitionStack: null,

    initialize: function($super, mainPageId) {
        if (mainPageId) {
            Navy.Page.create(mainPageId, this._setMainPageOnCreatePage.bind(this));
        }
    },

    _setMainPageOnCreatePage: function(page) {
        Navy.Root.pushPage(page);

        page.onCreate();
        page.onResumeStart();
        page.onResumeFinish();

        this._transitionStack = [];
    },

    _setPageOnCreatePage: function(newPage) {
        var currentPage = Navy.Root.getPage(0);

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
     * 次のページに移動する.
     * @param {string} pageId 次のページのIDをpage.jsonに設定されているものか指定する.
     */
    next: function(pageId) {
        Navy.Page.create(pageId, this._setPageOnCreatePage.bind(this));
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
    },

    //TODO:jsdoc
    showLayout: function(layoutUrl, callback){
        this._showLayoutCallback = callback;
        return Navy.Page.createByLayoutUrl(layoutUrl, this._showLayout.bind(this));
    },

    //TODO:jsdoc
    _showLayout: function(newPage){
        Navy.Root.popPage();
        newPage.onCreate();
        Navy.Root.pushPage(newPage);

        this._showLayoutCallback(newPage);
    }
});
