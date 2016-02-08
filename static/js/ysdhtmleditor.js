define(['jquery','jquery.wysiwyg'], function($) {
	
  htmlEditor = function(selector) { /* Converts the selection in an html editor */
	
    $(selector).wysiwyg({
  	   autoSave: true,
       removeHeadings: true,
       initialContent: '',
       iFrameClass: 'html_editor',
       css: '/css/style.css',
       replaceDivWithP: false,
       controls:{
         h1: {visible: false},
         html: {visible: true}  // Show a control to 
       }
    });
  
  }
  
  return htmlEditor;
  
});