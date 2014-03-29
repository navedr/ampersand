var matched,browser;jQuery.uaMatch=function(ua){ua=ua.toLowerCase();var match=/(chrome)[ \/]([\w.]+)/.exec(ua)||/(webkit)[ \/]([\w.]+)/.exec(ua)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua)||/(msie) ([\w.]+)/.exec(ua)||ua.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)||[];return{browser:match[1]||"",version:match[2]||"0"}};matched=jQuery.uaMatch(navigator.userAgent);browser={};if(matched.browser){browser[matched.browser]=true;browser.version=matched.version}if(browser.chrome){browser.webkit=true}else if(browser.webkit){browser.safari=true}jQuery.browser=browser;if($.browser.mozilla||$.browser.opera){document.removeEventListener("DOMContentLoaded",$.ready,false);document.addEventListener("DOMContentLoaded",function(){$.ready()},false)}$.event.remove(window,"load",$.ready);$.event.add(window,"load",function(){$.ready()});$.extend({includeStates:{},include:function(url,callback,dependency){if(typeof callback!='function'&&!dependency){dependency=callback;callback=null}url=url.replace('\n','');$.includeStates[url]=false;var script=document.createElement('script');script.type='text/javascript';script.onload=function(){$.includeStates[url]=true;if(callback)callback.call(script)};script.onreadystatechange=function(){if(this.readyState!="complete"&&this.readyState!="loaded")return;$.includeStates[url]=true;if(callback)callback.call(script)};script.src=url;if(dependency){if(dependency.constructor!=Array)dependency=[dependency];setTimeout(function(){var valid=true;$.each(dependency,function(k,v){if(!v()){valid=false;return false}});if(valid)document.getElementsByTagName('head')[0].appendChild(script);else setTimeout(arguments.callee,10)},10)}else document.getElementsByTagName('head')[0].appendChild(script);return function(){return $.includeStates[url]}},readyOld:$.ready,ready:function(){if($.isReady)return;imReady=true;$.each($.includeStates,function(url,state){if(!state)return imReady=false});if(imReady){$.readyOld.apply($,arguments)}else{setTimeout(arguments.callee,10)}}});
var jsLibs = ['jquery/jquery.form.min.js', 'jquery-ui/js/jquery-ui.js', 'js/intro.min.js', 'bootstrap/js/bootstrap.min.js', 
              'js/tiny-pubsub.js', 'js/underscore-min.js'];
for(var x in jsLibs){
	$.include(jsLibs[x]);
}
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
};

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
					var visible = $content.is(":visible");
					if (visible) {
						if ($el.data("visible")) {
							$el.html($el.data("visible"));
						}
					}
					else {
						if ($el.data("hidden")) {
							$el.html($el.data("hidden"));
						}
					}
				}
			});
			return false;
		}
};

Validation = {
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
				isvalid = val.match(/[0-9]*/)[0].length == val.length;
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
};

$(document).ready(function () {
	TopBar.init();
	Popover.init();
	Validation.init();
});
