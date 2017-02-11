requirejs.config({
		
	paths: {
		"jquery"                  : "jquery-1.9.1", 
        "jquery.migrate"          : "jquery-migrate-1.3.0",
		"jquery.ui"               : "jquery-ui-1.9.0", 
		"jquery.ui.datepicker-es" : "jquery.ui.datepicker-es",
        "jquery.ui.datepicker-ca" : "jquery.ui.datepicker-ca",        
		"jquery.ui.timepicker"    : "jquery-ui-timepicker-addon",
        "jquery.ui.timepicker-es" : "jquery-ui-timepicker-es",
        "jquery.ui.timepicker-ca" : "jquery-ui-timepicker-ca",
        "jquery.colourPicker"     : "jquery-colourPicker",        
		"jquery.fullcalendar"     : "jquery-fullcalendar-1.6.1",
		"jquery.tools"            : "jquery.tools.min", 
		"jquery.validate"         : "jquery.validate",
		"jquery.formparams"       : "jquery.formparams",
		"jquery.cookie"           : "jquery.cookie",
		"jquery.nivo.slider"      : "jquery.nivo.slider.pack", 
		"jquery.placeholder"      : "jquery.placeholder",
		"jquery.superscrollorama" : "jquery.superscrollorama",
		"jquery.lettering"        : "jquery.lettering",
        "jquery.sidr"             : "jquery.sidr.min",
        "jquery.calendar"         : "jquery.calendar",
		"bootstrap"               : "bootstrap-3.3.4",
		"jquery.bsAlerts"         : "jquery.bsAlerts",
        "jquery.combo.select"     : "jquery.combo.select",
        "jquery.dropdown"         : "jquery.dropdown",
        "jquery.fixedtable"       : "jquery.fixedtable",
        // rentit theme
        "jquery.easing"           : "jquery.easing.min",
        "jquery.smoothscroll"     : "jquery.smoothscroll.min",
        // rentit theme ends
		"json2"                   : "json2",
		"datejs"                  : "date-es-ES"
	},

	shim: {
        "jquery.migrate": ['jquery'],
        "jquery.tools" : ['jquery'],
        "jquery.ui"    : ['jquery'],
        "jquery.ui.datepicker-es" : ['jquery', 'jquery.ui'],
        "jquery.ui.datepicker-ca" : ['jquery', 'jquery.ui'],        
        "jquery.ui.timepicker" : ['jquery', 'jquery.ui'],
        "jquery.ui.timepicker-es" : ["jquery.ui.timepicker"],
        "jquery.ui.timepicker-ca" : ["jquery.ui.timepicker"],   
        "jquery.colourPicker" : ["jquery"],             
        "jquery.fullcalendar" : ['jquery', 'jquery.ui'],
        "jquery.validate" : ['jquery'],
        "jquery.formparams" : ['jquery'],
        "jquery.cookie" : ['jquery'],
        "jquery.ad-gallery" : ['jquery'],
        "jquery.wysiwyg" : ['jquery'],
        "jquery.nivo.slider": ['jquery'],
        "jquery.placeholder": ['jquery'],
        "jquery.superscrollorama" : ['jquery'],
        "jquery.lettering": ['jquery'],
        "jquery.sidr": ['jquery'],
        "jquery.calendar": ['jquery'],
        "jquery-wysiwyg": ['jquery'],
        "autonumeric": ['jquery'],
        'jquery.plugin': ['jquery'],
        "jquery.timeentry":['jquery','jquery.plugin'],        
        "bootstrap" : {},
        "jquery.bsAlerts": ['jquery','bootstrap'],
        "jquery.combo.select": ['jquery'],
        "jquery.dropdown": ['jquery'],
        "jquery.fixedtable": ['jquery'],
        // rentit theme
        "superfish": ['jquery'],
        "jquery.prettyPhoto": ['jquery'],
        "owl.carousel": ['jquery'],
        "jquery.sticky": ['jquery'],
        "jquery.easing": ['jquery'],
        "jquery.smoothscroll" : ['jquery'],
        "swiper.jquery": ['jquery'],
        "bootstrap.select": ['bootstrap'],
        // rentit theme end
        "json2" : { 
          "exports": 'JSON'
        },
        "datejs" : {},
        "modernizr" : {
          "exports": 'Modernizr'
        },
        "underscore" : {
            exports: '_'
        },     // Underscore.js library (functions for old browsers)
        "TimelineMax.min": {}, // greensock
        "TweenMax.min" : {},   // greensock
        "time" : ['datejs'],
        "charts" : {
            exports: 'Chart'
        }          // charts
      
	}
	
});