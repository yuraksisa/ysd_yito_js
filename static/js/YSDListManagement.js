define(['YSDListManagementModel', 'YSDListManagementController', 'YSDListManagementView'], 
       function(YSDListManagementModel, YSDListManagementController, YSDListManagementView) {

  /* ----------------------------------
     ListManagement
     ----------------------------------
   
   A component to manage a list of elements
   
   @param placement_id
     The id of the placement
   @param controlName
     The name of the controll which will be created
   @param dataSource
     The datasource to get the data from
   @param value
     The original value
  ------------------------------------------------- */
  YSDListManagement = function(placementId, controlName, dataSource, addElementTitle) {

    this.model = new YSDListManagementModel(dataSource);
    this.controller = new YSDListManagementController(this.model);
    this.view = new YSDListManagementView(this.model, this.controller, placementId, controlName, addElementTitle || 'upload');
  
    this.view.createGui();
    this.model.retrieveData();
  
    this.getData = function() {
      return this.model.data;	
    }

    this.addElement = function(element) { /* Adds a new element */
      this.model.addElement(element);	
    }

    this.deleteElement = function(id) { /* Removes an element */
      this.model.deleteElement(id);
    }
  
    this.addListener = function(type, listener) { /* Adds a listener */
  	  this.controller.addListener(type, listener);
    }

    this.removeListener = function(type, listener) { /* Removes a listener */
      this.controller.removeListener(type, listener);	
    }

  }
 
  return YSDListManagement;
  
});