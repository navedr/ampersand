Popover = {
    create: function (linkId, title, content, container, placement) {
        title = title + "<button class='close' onclick=\"$$('#" + linkId + "').popover('hide');\">&times;</button>";
        $$('#' + linkId).popover({
            placement: (placement) ? placement : 'top',
            html: true,
            content: content,
            container: (container) ? container : false,
            title: title
        });
    },
    bindEvents: function () {
        $(".popover .close-popover").live("click", function (e) {
            var $btn = $(e.target);
            $btn.parents(".popover").hide();
            return false;
        });
        $(".popover-trigger").live("click", function (e) {
            var $el = $(e.target);
            if (!$el.hasClass("popover-trigger")) {
                $el = $el.parents(".popover-trigger");
            }
            if ($el.data("popoverId") != null) {
                $("#" + $el.data("popoverId")).toggle();
                return false;
            }            
        });
    },
    init: function(){
        this.bindEvents();
    }
}

$(document).ready(function () {
    Popover.init();
});