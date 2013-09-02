define (['YSDEventTarget'], function(YSDEventTarget) {

  YSDListManagementController = function(model) { /****** The controller *******/

    this.model = model;	 
    this.model.setController(this);	 

    this.events = new YSDEventTarget();	
  	
    this.addListener = function(type, listener) { /* addListener */
      this.events.addEventListener(type, listener);	
    }

    this.removeListener = function(type, listener) { /* removeListener */
      this.events.removeEventListener(type, listener);  	  
    }
	 
    this.setView = function(view) {
      this.view = view;	
    }	
 
    this.deleteElementButtonClick = function(id) {
      this.events.fireEvent({type: 'delete_element_button_click', data: id})
    }
 
    this.addElementButtonClick = function() {
      this.events.fireEvent('add_element_button_click');      
    }
	
  }
  
  return YSDListManagementController;
  
});
