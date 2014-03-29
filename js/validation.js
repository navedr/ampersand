$(function () {
    Validation.init();
});

var Validation = {
    init: function () {
        if (jQuery.isFunction(jQuery.fn.live)) {
            //$(".validate").live("blur", function (event) {
            //    Validation.validateInput($(event.target));
            //});
            $(".validate").live("change", function (event) {
                Validation.validateInput($(event.target));
            });
        }
        else if (jQuery.isFunction(jQuery.fn.on)) {
            //$(".validate").on("blur", function (event) {
            //    Validation.validateInput($(event.target));
            //});
            $(".validate").on("change", function (event) {
                Validation.validateInput($(event.target));
            });
        }
    },
    validateInput: function (control) {
        var val = control.val();
        var isvalid = true;
        var errormsg = "";
        //Optional: data-required-message
        if (control.hasClass("validate-required") && isvalid) {
            isvalid = (val != "");
            if (control.data("requiredMessage") != null)
                errormsg = control.data("requiredMessage");
            else
                errormsg = "This field is required";
        }
        //Optional: data-number-message
        if (control.hasClass("validate-number") && isvalid) {
            isvalid = !isNaN(val);
            if (control.data("numberMessage") != null)
                errormsg = control.data("numberMessage");
            else
                errormsg = "Please enter a valid number";
        }
        //Optional: data-money-message
        if (control.hasClass("validate-money") && isvalid) {
            isvalid = !isNaN(val);
            if (isvalid) isvalid = (val >= 0);
            if (control.data("moneyMessage") != null)
                errormsg = control.data("moneyMessage");
            else
                errormsg = "Please enter a valid amount";
        }
        //Optional: data-positive-number-message
        if (control.hasClass("validate-positive-number") && isvalid) {
            isvalid = !isNaN(val);
            if (isvalid) isvalid = (val >= 0);
            if (control.data("positiveNumberMessage") != null)
                errormsg = control.data("positiveNumberMessage");
            else
                errormsg = "Please enter a valid positive number";
        }
        //Optional: data-email-message
        if (control.hasClass("validate-email") && isvalid) {
            var emailRegEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
            isvalid = (val.search(emailRegEx) != -1);
            if (control.data("emailMessage") != null)
                errormsg = control.data("emailMessage");
            else
                errormsg = "Please enter Email in correct format";
        }
        //Optional: data-digits-message
        if (control.hasClass("validate-digits") && isvalid) {
            isvalid = val.match(/[0-9]*/)[0].length == val.length
            if (control.data("digitsMessage") != null)
                errormsg = control.data("digitsMessage");
            else
                errormsg = "Only digits allowed";
        }
        //Required: data-compare-id attribute to the field and specify the ID of the input to compare with
        //Optional: data-compare-message
        if (control.hasClass("validate-compare") && isvalid) {
            if (control.data("compareId") != null) {
                var compareTo = $("#" + control.data("compareId")).val();
                isvalid = (compareTo == val);
                if (control.data("compareMessage") != null)
                    errormsg = control.data("compareMessage");
                else
                    errormsg = "Values do not match";
            }
        }
        //Required: data-min-length to the field and specify the minimum length required
        //Optional: data-minlength-message
        if (control.hasClass("validate-minlength") && isvalid) {
            if (control.data("minLength") != null) {
                var minlength = parseInt(control.data("minLength"));
                isvalid = (val.length >= minlength);
                if (control.data("minlengthMessage") != null)
                    errormsg = control.data("minlengthMessage");
                else
                    errormsg = "Minimum " + minlength + " characters required.";
            }
        }
        //Required: data-max-length to the field and specify the maximum length allowed
        //Optional: data-maxlength-message
        if (control.hasClass("validate-maxlength") && isvalid) {
            if (control.data("maxLength") != null) {
                var maxlength = parseInt(control.data("maxLength"));
                isvalid = (val.length <= maxlength);
                if (control.data("maxlengthMessage") != null)
                    errormsg = control.data("maxlengthMessage");
                else
                    errormsg = "Maximum " + maxlength + " characters allowed.";
            }
        }

        if (control.next().hasClass("error-message"))
            control.next().remove();
        //Checking if control is valid and performing necessary action
        if (isvalid) {
            control.removeClass("error-background");
            return true;
        }
        else {
            if (errormsg != "") {
                control.after("<div class='error-message'>" + errormsg + "</div>");
            }            
            control.addClass("error-background");
            return false;
        }
    },
    validateForm: function (formid) {
        var validation_fields = $("#" + formid + " .validate");
        var isFormValid = true;
        $.each(validation_fields, function () {
            var control = $(this);
            if (control.is(":visible")) {
                var isControlValid = Validation.validateInput(control);
                isFormValid = isFormValid & isControlValid;
            }
        });
        return isFormValid;
    }
}