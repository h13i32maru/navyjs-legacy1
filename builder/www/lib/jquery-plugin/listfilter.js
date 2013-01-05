// e.g ('ul').listFilter('input.search');
// e.g ('ul').listFilter($('input.search'));
(function($){
    $.fn.listFilter = function(input) {
        this.find('li').each(function(index, elm){
            $(elm).attr('data-list-filter', $(elm).text().toLowerCase());
        });

        var $this = this;
        if (typeof input === 'string') {
            var $input = $(inputSelector);
        } else {
            var $input = input;
        }
        $input.keyup(function(e){
            var text = $input.val();
            if (text === '') {
                $this.find('li').show();
                return;
            }

            $this.find('li').hide();
            $this.find('li[data-list-filter*="' + text + '"]').each(function(index, elm){
                $(elm).show();
            });
        });
    };
})(jQuery);
