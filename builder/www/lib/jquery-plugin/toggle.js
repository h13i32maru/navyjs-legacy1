$(function(){
    $('.toggle').on('click', '[data-toggle]', function() {
        var $this = $(this);
        $this.siblings().each(function() {
            var selector = $(this).removeClass('active').attr('data-toggle');
            $(selector).hide();
        });

        var selector = $this.attr('data-toggle');
        $(selector).show();
        $this.addClass('active');
    });

    $('.toggle .active').click();
});
