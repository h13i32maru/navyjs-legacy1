Navy.PageFactory = Navy.Core.instance({
    CLASS: 'Navy.PageFactory',

    initialize: function($super) {
    },

    create: function(pageId) {
        var pageConfig = Navy.Config.Page[pageId];

        var pageClass = pageConfig['class'];
        var layoutId = pageConfig['layout'];

        var size = Navy.Root.getSize();
        var layout = {
            pos: [0, 0],
            size: [size[0], size[1]],
            extra: {
                ref: layoutId
            }
        };

        if ('background' in pageConfig) {
            layout.background = pageConfig.background;
        }
        
        var page = new window[pageClass](pageId, layout);

        return page;
    }
});
