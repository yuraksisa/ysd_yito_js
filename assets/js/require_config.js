// http://www.requirejs.org/jqueryui-amd/example/webapp/app.html

/* --------------------------
   Defines the modules
   --------------------------
*/
var cdn_paths = {
   "jquery" : "http://code.jquery.com/jquery-1.8.2.min.js"	
}

var require = {
	
	baseUrl: '/assets/js',
	
	paths: {
		"jquery"             : "/assets/js/jquery-1.8.2.min",
		"jquery.ui"          : "/assets/js/jquery-ui-1.8.13.custom.min",
		"jquery.tools"       : "/assets/js/jquery.tools.min",
		"jquery.validate"    : "/assets/js/jquery.validate",
		"jquery.formparams"  : "/assets/js/jquery.formparams",
		"jquery.cookie"      : "/assets/js/jquery.cookie",
		"jquery.nivo.slider" : "/assets/js/jquery.nivo.slider.pack",
		"jquery.placeholder" : "/assets/js/jquery.placeholder",
		"json2"              : "/assets/js/json2",
		"datejs"             : "/assets/js/date-es-ES"
	},

	shim: {
      "jquery.tools" : ['jquery'],
      "jquery.ui"    : ['jquery'],
      "jquery.validate" : ['jquery'],
      "jquery.formparams" : ['jquery'],
      "jquery.cookie" : ['jquery'],
      "jquery.ad-gallery" : ['jquery'],
      "jquery.wysiwyg" : ['jquery'],
      "jquery.nivo.slider": ['jquery'],
      "jquery.placeholder": ['jquery'],
      "json2" : { 
        "exports": 'JSON'
      },
      "datejs" : {}
      
	}
	
};


