Navy.PageFactory = Navy.Core.instance({
    CLASS: 'Navy.PageFactory',

    initialize: function($super) {
    },

    create: function(pageId) {
        var pageConfig = Navy.Config.Page[pageId];

        var pageClass = pageConfig['class'];
        var layoutId = pageConfig['layout'];

        var layout = {
            pos: [0, 0],
            extra: {
                ref: layoutId
            }
        };
        
        var page = new window[pageClass](pageId, layout);

        return page;
    }
});
