requirejs.config({
	
	//baseUrl: 'static/js',
	
	paths: {
		"jquery"              : "jquery-1.8.2.min",
		"jquery.ui"           : "jquery-ui-1.8.13.custom.min",
		"jquery.tools"        : "jquery.tools.min",
		"jquery.validate"     : "jquery.validate",
		"jquery.ui.datepicker.validation" : "jquery.ui.datepicker.validation",
		"jquery.formparams"   : "jquery.formparams",
		"jquery.cookie"       : "jquery.cookie",
		"jquery.nivo.slider"  : "jquery.nivo.slider.pack",
		"jquery.placeholder"  : "jquery.placeholder",
		"jquery.fcbkcomplete" : "jquery.fcbkcomplete",
		"json2"               : "json2",
		"datejs"              : "date-es-ES"
	},

	shim: {
      "jquery.tools" : ['jquery'],
      "jquery.ui"    : ['jquery'],
      "jquery.validate" : ['jquery'],
      'jquery.ui.datepicker.validation' : ['jquery', 'jquery.ui', 'jquery.validate']
      "jquery.formparams" : ['jquery'],
      "jquery.cookie" : ['jquery'],
      "jquery.ad-gallery" : ['jquery'],
      "jquery.wysiwyg" : ['jquery'],
      "jquery.nivo.slider": ['jquery'],
      "jquery.placeholder": ['jquery'],
      "jquery.fcbkcomplete": ['jquery'],
      "json2" : { 
        "exports": 'JSON'
      },
      "datejs" : {},
      "time" : ['datejs']
      
	}
	
});