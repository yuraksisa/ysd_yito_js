define(['YSDEventTarget', 'jquery', 'ysdtemplate'], function(YSDEventTarget, $, tmpl) {

  /* ----------------------------------
     ListViewer
     ----------------------------------
   
   A component to view a list of elements
   
   @param placement_id
     The id of the placement
   @param controlName
     The name of the controll which will be created
   @param dataSource
     The datasource to get the data from
   @param value
     The original value
  */

  YSDListViewer = function(placementId, controlName, dataSource) {

    this.model = new YSDListViewerModel(dataSource);
    this.controller = new YSDListViewerController(this.model);
    this.view = new YSDListViewerView(this.model, this.controller, placementId, controlName);
  
    this.view.createGui();
    this.model.retrieveData();

  }

  /****** The model ********/
  
  YSDListViewerModel = function(dataSource) {
	
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
	
    this.retrieveData = function() {	 /* Retrieve data */ 	 
      this.dataSource.retrieveData();	
    }
		
  }

  /****** The controller *******/

  YSDListViewerController = function(model) {

    this.model = model;	 
    this.model.setController(this);	 

    this.events = new YSDEventTarget();	

    this.setView = function(view) {
      this.view = view;	
    }	

  }

  /****** The view *********/

  YSDListViewerView = function(model, controller, placementId, controlName) {
   
    this.model = model;
    this.controller = controller;	
    this.placementId = placementId;
    this.controlName = controlName;
 
    this.controller.setView(this);
    this.model.setView(this);
 
    this.createGui = function() { /* Create the Gui */
 
      if (!this.container) { 	
    	
 	    this.container = document.createElement('div');
 	    this.container.setAttribute('id',controlName);
 	    this.container.setAttribute('class','list-viewer-container');
 	       	
 	    var holder = document.getElementById(placementId);
 	    holder.appendChild(this.container);
 	  
      }
    
    } 

    this.notify = function(status) { /* Events listener */
  	
      switch (status) {
    	
        case 'data_changed' :
          this.createRows();
          break;

      }
  	
    }
  
    this.createRows = function() { /* Create all elements */
 	 
      $(this.container).empty();
   
      var data = this.model.data;
   
      for (var idx=0;idx<data.length;idx++) {
   	    this.createRow(data[idx]);
      }
 	
    }
 
    this.createRow = function(element) { /* Create an element */
 
      var script = "<div class=\"list-management-item\" rel=\"<%=element.id%>\">"+
                  " <span class=\"list-management-item-description\"><span><%=element.description%></span></span>" +
                  "</div>";
                
      var template = tmpl(script);
   
      $(this.container).append(template({element:element}));
       	
    }
 	
  }
  
  return YSDListViewer;
  
});