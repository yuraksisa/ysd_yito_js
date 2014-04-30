requirejs.config({
		
	paths: {
		"jquery"                  : "jquery-1.8.2", 
		"jquery.ui"               : "jquery-ui-1.9.0", 
		"jquery.ui.datepicker-es" : "jquery.ui.datepicker-es",
		"jquery.ui.timepicker"    : "jquery-ui-timepicker-addon",
		"jquery.fullcalendar"     : "jquery-fullcalendar-1.6.1",
		"jquery.tools"            : "jquery.tools.min", 
		"jquery.validate"         : "jquery.validate",
		"jquery.formparams"       : "jquery.formparams",
		"jquery.cookie"           : "jquery.cookie",
		"jquery.nivo.slider"      : "jquery.nivo.slider.pack", 
		"jquery.placeholder"      : "jquery.placeholder",
		"jquery.superscrollorama" : "jquery.superscrollorama",
		"jquery.lettering"        : "jquery.lettering",
		"bootstrap"               : "bootstrap",
		"jquery.bsAlerts"         : "jquery.bsAlerts",
		"json2"                   : "json2",
		"datejs"                  : "date-es-ES"
	},

	shim: {
        "jquery.tools" : ['jquery'],
        "jquery.ui"    : ['jquery'],
        "jquery.ui.datepicker-es" : ['jquery', 'jquery.ui'],
        "jquery.ui.timepicker" : ['jquery', 'jquery.ui'],
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
        "bootstrap" : {},
        "jquery.bsAlerts": ['jquery','bootstrap'],
        "json2" : { 
          "exports": 'JSON'
        },
        "datejs" : {},
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