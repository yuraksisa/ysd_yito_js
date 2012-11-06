define(function(){
  
  YSDListManagementModel = function(dataSource) { /****** The model ********/
	
   this.dataSource = dataSource;
   this.data = [];
	
   this.setController = function(controller) {
     this.controller = controller;	
   } 	
 
   this.setView = function(view) {
     this.view = view;	
   }
 
   var self = this;
	
   this.dataSource.addListener('data_available', 
      function(event) {
          switch (event.type) {
  	        case 'data_available' :
  	          self.data = event.data;
  	          self.view.notify('data_changed');
  	          break;
          }
      });	
	
   this.retrieveData = function() {	  	
     this.dataSource.retrieveData();	
   }
 
   this.addElement = function(element) { /* Adds and element */
 
     this.data.push(element);
     this.view.notify('data_changed');
 
   }
 
   this.deleteElement = function(id) { /* Deletes the element */
 	
 	 var elementToDelete = null;
 	
 	 for (var idx=0; idx < this.data.length; i++) {
 	   if (this.data[idx].id = id) {
 	     elementToDelete = idx;
 	     break;	
 	   } 	
 	 }
 	
 	 if (elementToDelete >= 0) {
 	   this.data.splice(elementToDelete,1);
 	 }
 	 	
 	 this.view.notify('data_changed');
 	
   }
		
  }
  
  return YSDListManagementModel;
  
});
