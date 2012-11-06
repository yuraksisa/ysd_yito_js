define(['jquery'], function($){

  var YsdForms = {};

  /*
   * Limit the text area content size
   * 
   * @param textarea  The element that represents the textarea
   * @param maxlength Max length allowed
   * @param listener  Notify the remain content 
   */
  YsdForms.limit_text_area_content_size = function (textarea, maxlength, listener) {

    // First call to the listener, to notify the original size 
    if (listener) {
  	  listener.call(textarea, maxlength - textarea.value.length);	
    }

    $(textarea).bind('keydown', function(event) {
  	
  	  var content_length = event.target.value.length;
  	  	
  	  // 8.supr 46.backspace 37.left 38.up 39.right 40.down  	
  	  if (content_length == maxlength && (event.keyCode != 8 && event.keyCode != 46 && event.keyCode != 37 && event.keyCode != 38 && event.keyCode != 39 && event.keyCode != 40)) {
  	    return false;	
  	  }
  	
    });

    $(textarea).bind('keyup', function(event) {
  	
  	  // Manage paste from clipboard (remove all the characters above the maxlength allow)
  	  if (event.target.value.length > maxlength)
  	  {
  	    event.target.value = event.target.value.substring(0, maxlength);	
  	  }  
  	
  	  // Notify the listener with the new remainder  	
  	  if (listener) 
  	  {
  	    listener.call(event.target, maxlength - event.target.value.length);	
      }
  	
    });
    
    $(textarea).bind('change', function(event) {
    	
  	  // Notify the listener with the new remainder  	
  	  if (listener) 
  	  {
  	    listener.call(event.target, maxlength - event.target.value.length);	
      }
    	
    });
	
  };

  return YsdForms;
	
});
