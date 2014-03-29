TopBar = {
    init: function () {
        this.bindEvents();
    },
    bindEvents: function () {
        $(".top-bar .top-bar-toggle").live("click", $.proxy(this.toggleTopBar, this));
    },
    toggleTopBar: function (e) {
        var $el = $(e.target);
        if (!$el.hasClass("top-bar-toggle")) {
            $el = $el.parents(".top-bar-toggle");
        }
        var $content = $el.parents(".top-bar").find(".top-bar-content");
        $content.slideToggle({
            duration: 300,
            easing: 'easeInOutBack',
            complete: function () {
                var visible = $content.is(":visible")
                if (visible) {
                    if ($el.data("visible")) {
                        $el.html($el.data("visible"))
                    }
                }
                else {
                    if ($el.data("hidden")) {
                        $el.html($el.data("hidden"))
                    }
                }
            }
        });
        return false;
    }
};

$(document).ready(function () {
    TopBar.init();
});