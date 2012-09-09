$(function(){
    $target = $('.fill-x').each(function(index, $e){
        var $this = $(this);
        var $parent = $this.parent();
        var width = $parent.width() - ($this.offset().left - $parent.offset().left);
        var paddingLeft = parseInt($this.css('padding-left'), 10);
        var paddingRight = parseInt($this.css('padding-right'), 10);
        $this.width(width - paddingLeft - paddingRight - 2);
    });

    $target = $('.fill-y').each(function(index, $e){
        var $this = $(this);
        var $parent = $this.parent();
        var height = $parent.height() - ($this.offset().top - $parent.offset().top);
        var paddingTop = parseInt($this.css('padding-top'), 10);
        var paddingBottom = parseInt($this.css('padding-bottom'), 10);
        $this.height(height - paddingTop - paddingBottom - 2);
    });
});
