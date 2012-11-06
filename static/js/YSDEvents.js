define( function() {
	
  var YSDEvents = {};

  /**
   * Attach an Event to the element
   */
  YSDEvents.addEvent = function(elem, type, eventHandle) {
    if (elem == null || elem == undefined) {
     return;
    }    
    if ( elem.addEventListener ) {
      elem.addEventListener( type, eventHandle, false );
    } 
    else if ( elem.attachEvent ) {
      elem.attachEvent( "on" + type, eventHandle );
    }
  };

  /**
   * Remove an Event to the element
   */
  YSDEvents.removeEvent = function(elem, type, eventHandle) {

    if (elem == null || elem == undefined) {
      return;	
    }
    
    if (elem.removeEventListener) {
      elem.removeEventListener(type, eventHandle, false);	
    }
    else if (elem.detachEvent) {
      elem.detachEvent( "on" + type, eventHandle);	
    }
	
  }
  
  return YSDEvents;	
	
});