/**
 * author: h13i32maru
 * usage:
 * <input type="text" data-listfilter-target="+">
 * <ul>
 *  <li></li>
 *  <li></li>
 *  <li></li>
 * </ul>
 */
(function($){
    $(function(){ 
        $('[data-listfilter-target]').keyup(function(ev){
            var $this = $(this);
            var targetSelector = $this.attr('data-listfilter-target');
            var $target = $this.find(targetSelector);
            var query = $this.val().toLowerCase();

            if (query === '') {
                $target.find('li').show();
                return;
            }

            var $li = $target.find('li');
            var len = $li.size();
            var text;
            for (var i = 0; i < len; i++) {
                if ($li.eq(i).attr('data-listfilter-text')) {
                    text = $li.eq(i).attr('data-listfilter-text').toLowerCase();
                } else {
                    text = $li.eq(i).text().toLowerCase();
                }

                if (text.indexOf(query) === -1) {
                    $li.eq(i).hide();
                } else {
                    $li.eq(i).show();
                }
            }
        });
    });
})(jQuery);

