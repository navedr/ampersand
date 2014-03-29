Dialog = {
    dialogId: "generic-dialog",
    create: function (dialogId, dialogHtml, cssClass, width, hasTitleBar, zIndex, hasCloseButton, autoOpen, destroyOnClose, dialogTitle) {
        var self = this;
        this.$dialog = $("#" + dialogId);
        if (this.$dialog.size() > 0) {
            this.$dialog.remove();
        }
        this.$dialog = $("<div id='" + dialogId + "'></div>");
        if (hasCloseButton) {
            dialogHtml += "<p><center><button class='btn danger dialog-close-btn'>Close</button></center></p>";
        }
        this.$dialog.html(dialogHtml);
        $("body").append(this.$dialog);
        this.$dialog.dialog({
            autoOpen: autoOpen,
            show: "fade",
            hide: "fade",
            zIndex: (zIndex) ? zIndex : 10001,
            width: width,
            minHeight: 'auto',
            modal: true,
            resizable: false,
            closeOnEscape: false,
            dialogClass: (cssClass) ? cssClass : "",
            title: (dialogTitle) ? dialogTitle : ""
        });
        this.$dialog.find(".dialog-close-btn").click(function (e) {
            $("#" + dialogId).dialog('close');
            return false;
        });
        if (destroyOnClose) {
            this.$dialog.live("dialogclose", function (event, ui) {
                self.$dialog.remove();
            });
        }
        if (!hasTitleBar) {
            this.$dialog.parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
        }
    },
    show: function (dialogHtml, cssClass, width, hasTitleBar, zIndex, hasCloseButton, dialogTitle) {
        this.create(this.dialogId, dialogHtml, cssClass, width, hasTitleBar, zIndex, hasCloseButton, true, true, dialogTitle);
    },
    showAlert: function (alertHtml, customStyle) {
        alertHtml = (customStyle) ? alertHtml : "<h4 class='text-center mtop'>" + alertHtml + "</h4>";
        this.show(alertHtml, null, 400, false, null, true);
    },
    close: function () {
        this.$dialog.dialog('close');
    }
};