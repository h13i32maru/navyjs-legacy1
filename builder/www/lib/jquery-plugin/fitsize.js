(function($){
    $.fitsize = function() {
        $target = $('.fitsize-x').each(function(index, $e){
            var $this = $(this);
            var left          = parseInt($this.css('left'), 10);
            var marginLeft    = parseInt($this.css('margin-left'), 10);
            var marginRight   = parseInt($this.css('margin-right'), 10);
            var paddingLeft   = parseInt($this.css('padding-left'), 10);
            var paddingRight  = parseInt($this.css('padding-right'), 10);
            var borderLeft    = parseInt($this.css('border-left'), 10);
            var borderRight   = parseInt($this.css('border-right'), 10);
            var width         = $(document.body).width() - (left + marginLeft + marginRight + paddingLeft + paddingRight + borderLeft + borderRight);
            $this.width(width);
        });

        $target = $('.fitsize-y').each(function(index, $e){
            var $this = $(this);
            var top           = parseInt($this.css('top'), 10);
            var marginTop     = parseInt($this.css('margin-top'), 10);
            var marginBottom  = parseInt($this.css('margin-bottom'), 10);
            var paddingTop    = parseInt($this.css('padding-top'), 10);
            var paddingBottom = parseInt($this.css('padding-bottom'), 10);
            var borderTop     = parseInt($this.css('border-top'), 10);
            var borderBottom  = parseInt($this.css('border-bottom'), 10);
            var height        = $(document.body).height() - (top + marginTop + marginBottom + paddingTop + paddingBottom + borderTop + borderBottom);
            $this.height(height);
        });
    }
})(jQuery);
