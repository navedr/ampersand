//Ajax helpers
var Ajax = {

    // Creates global ajax listener and displays page level loading icon
    bindListener: function (container, icon) {
        var overlay = $("<div class='page-overlay'/>");
        var iconHeightOffset = -(icon.outerHeight()) + "px";
        var iconWidthOffset = -(icon.outerWidth()) + "px";
        icon.css({
            marginTop: iconHeightOffset,
            marginLeft: iconWidthOffset
        });

        container.ajaxStart(function () {
            overlay.appendTo(container);
            overlay.on("click", function () {
                return false;
            });
            icon.show();

        });
        container.ajaxStop(function () {
            overlay.off('click');
            overlay.remove();
            icon.fadeOut();
        });
        container.ajaxError(function (event, xhr, ajaxOptions, thrownError) {
            console.log("XHR Response: " + JSON.stringify(xhr));
        });
    },

    // Ajax call wrapper (jQuery)
    callHandler: function (type, url, data, callback, isGlobal, async) {
        $.ajax({
            type: type,
            url: url,
            cache: false,
            global: isGlobal,
            data: data,
            success: callback,
            error: Ajax.errorHandler,
            async: (async != null) ? async : true
        });
    },

    // Ajax getJson wrapper (jQuery)
    getJson: function (url, data, callback, isGlobal, async) {
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            global: isGlobal,
            data: data,
            success: callback,
            error: Ajax.errorHandler,
            async: async
        });
    },

    // Ajax call wrapper with JSON response(jQuery)
    postForJSON: function (url, data, callback, isGlobal, async) {
        $.ajax({
            type: "POST",
            dataType: 'json',
            url: url,
            cache: false,
            global: isGlobal,
            data: data,
            success: callback,
            error: Ajax.errorHandler,
            async: async
        });
    },

    // Ajax error callback
    errorHandler: function (data, textStatus, jqXHR) {
        if (data.status != 0) {
            window.location.href = '500.aspx?reload=' + location.pathname;
            console.log(data);
        }
    },

    ajaxForm: function (id, success, beforeSubmit) {
        $(id).ajaxForm({
            success: success,
            beforeSubmit: beforeSubmit,
            error: Ajax.errorHandler
        });
    }
};

Templates = {
    get: function (template) {
        if ($("input[template='" + template + "']").size() > 0) {
            return $("input[template='" + template + "']").val();
        }
        Ajax.callHandler("GET", "/templates/" + template, null, function (data, textStatus, jqXHR) {
            templateHtml = data;
            $("body").append("<input type='hidden' template='" + template + "' />");
            $("input[template='" + template + "']").val(templateHtml);
        }, true, false);
        return templateHtml;
    }
};