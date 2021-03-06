ampersand
=========

What is ampersand?
------------------
ampersand is a collection of javascript and css libraries which tries to simplify common tasks while doing web development like creating dialogs, 
fixed bars on top of window, making ajax calls, using templates by providing re-usable methods which reduce lots of coding effort.

What is ampersand built of?
---------------------------
ampersand is built using the popular libraries out there. The libraries used in ampersand are as follows:
* jQuery
* jQuery UI
* jQuery Forms
* jQuery pubsub
* Intro JS
* Twitter Bootstrap
* Font Awesome
* Underscore
* and some custom libraries...

How do I use ampersand?
-----------------------
Just download this library and embed the following in the `<head>` tag of your page:  
	`<script type="text/javascript" src="ampersand/jquery/jquery-1.10.2.min.js"></script>`  
	`<script type="text/javascript" src="ampersand/js/ampersand.min.js"></script>`  
and thats all you will ever need.

Are there any prerequisites?
----------------------------
The only other library which you will need to add before adding ampersand is `jQuery` but it is already included in the download. 
If you are already using `jQuery` just add it to your page before adding ampersand. jQuery 1.9+ is recommended. 

Can you show me some examples?
------------------------------
Why not. Here you go!!

#### Creating dialogs ####
-----
1. To create a dialog alert on the page just use `Dialog.showAlert(message)`. 
If you want to do custom styling in that message, change it to `Dialog.showAlert(message, true)`.
2. To show a custom dialog use `Dialog.show(dialogHtml, cssClass, width, hasTitleBar, zIndex, hasCloseButton, dialogTitle)`.
If you set hasCloseButton to 'true' it will add a close button at bottom center of dialog. If you want your custom dialog close button
just add the class 'dialog-close-btn' to your custom button and the close action will be automatically assigned to it.

#### Adding sticky bar on top of page ####
-----
##### Example #####
	<div class="top-bar">
	    <div class="top-bar-content">
	        Content section
	    </div>
	    <div class="top-bar-footer">
	        <a href="#" class="top-bar-toggle" data-hidden="Show Bar" data-visible="Hide Bar">Hide Bar</a>
	    </div>
	</div>

P.S. Since **ampersand** is built using the jQuery and other libraries listed above you can use all the functions available with those libraries directly.
You don't have to install those libraries in your web page. **ampersand** has already done it for you!!
 
## I like it. But where can I see more? ##
See `index.html` for more examples.