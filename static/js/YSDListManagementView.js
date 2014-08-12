define(['jquery', 'ysdtemplate'], function($, tmpl){ 
	
  YSDListManagementView = function(model, controller, placementId, controlName, addElementTitle, itemClass) { /****** The view *********/
   
    this.model = model;
    this.controller = controller;	
    this.placementId = placementId;
    this.controlName = controlName;
    this.addElementTitle = addElementTitle;
    this.itemClass = itemClass;
 
    this.controller.setView(this);
    this.model.setView(this);
 
    this.createGui = function() { /* Create the Gui */
 
      if (!this.container) { 	
    	
 	    this.container = document.createElement('div');
 	    this.container.setAttribute('id',controlName);
 	    this.container.setAttribute('class','list-management-container');
 	
 	    this.actions = document.createElement('div');
 	    this.actions.setAttribute('id',controlName+'Actions');
 	    this.actions.setAttribute('class','list-management-container-actions clear-float');
 	
      var text = document.createTextNode(this.addElementTitle);
 	    this.appendAction = document.createElement('span');
 	    this.appendAction.setAttribute('class', 'list-management-add-action smaller_text as_link');
      this.appendAction.appendChild(text);
      this.actions.appendChild(this.appendAction);
       	
 	    var holder = document.getElementById(placementId);
 	    holder.appendChild(this.container);
 	    holder.appendChild(this.actions);
 	  
 	    var controller = this.controller;
 	  
 	    $('#'+controlName+'Actions .list-management-add-action').bind('click',
 	      function(event) {
 	        controller.addElementButtonClick();	
 	      });
 	   
 	  
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
 	
      this.controller.events.fireEvent('elements_updated');

    }
 
    this.createRow = function(element) { /* Create an element */
 
      var script = "<div class=\"list-management-item <%=item_class%>\" rel=\"<%=element.id%>\">"+
                   " <span class=\"list-management-item-description\"><span><%=element.description%></span></span>" +
                   " <span class=\"list-management-item-delete\"><span class=\"list-management-item-delete-img smaller_text\" rel=\"<%=element.id%>\" data-icon=\"&#xe01a\"/></span>" +
                   "</div>";
                
      var template = tmpl(script);
   
      $(this.container).append(template({element:element, item_class:this.itemClass}));
   
      var controller = this.controller;
   
      $('#'+controlName+' .list-management-item-delete-img[rel="' + element.id +'"]').bind('click', 
        function(event) {
   	      controller.deleteElementButtonClick($(this).attr('rel'));
        });
    	
    }
 	
  }
 
  return YSDListManagementView;
  
});