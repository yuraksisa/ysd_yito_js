define(['YSDListSelectorModel','jquery'], function(ListSelectorModel, $) {

  /* 
   ----------------------------------
   ListSelector
   ----------------------------------
   
   A component to select a subset of elements from a list
   
   @param placement_id
     The id of the placement
   @param controlName
     The name of the controll which will be created
   @param dataSource
     The datasource to get the data from
   @param value
     The original value
  */
  YSDListSelector = function(placement_id, controlName, dataSource, value) {
	
    this.model = new YsdForms.ListSelectorModel(dataSource, value);
    this.controller = new YsdForms.ListSelectorController();
    this.view = new YsdForms.ListSelectorView(this.model, this.controller, controlName, placement_id);
   
    this.controller.setView(this.view);
    this.model.setView(this.view);
   
    this.model.retrieveData();
   	
  }

  /* ------- The controller ------ */

  YSDListSelectorController = function() {
	
	this.setView = function(view) {
	  this.view = view;	
	};
	
  }

  /* ------- The view ---------- */

  YSDListSelectorView = function(model, controller, controlName, placement_id) {
 
    this.model = model;
    this.controlName = controlName;
    this.placement_id = placement_id;
    this.container = null;
  
    this.notify = function(status) {
  	
      switch (status) {
        case 'data_changed' :
          this.createControls();
          this.selectValues();
          break;
        case 'value_changed' :
          this.selectValues();
          break;	
      }
  	
    }
    
    this.render = function() {
  	
      this.container = document.createElement('div');
      this.container.setAttribute('id', controlName + '_container');
  	  this.container.setAttribute('class', 'chooser_container');
  	  	  	
    };
  
    this.selectValues = function() {
  
      var choosers = document.getElementsByName(this.controlName);
  	  var chooser = null;
  	
  	  for (var idx=0; idx<choosers.length; idx++) {
  	    chooser = choosers[idx];	
  	    if (this.model.value.indexOf(chooser.getAttribute('value'))>=0) {
  	      chooser.setAttribute('checked', 'true');
  	    }
  	    else
  	    {
  	  	  chooser.removeAttribute('checked');
  	    }	
  	  }
  	
    }
  
    this.createControls = function()  {
  	
  	  var data = this.model.data;
      var row = null;
  	  var chooser = null;
  	  var label = null;
  
      $(this.container).empty();
    	
  	  for (idx in data) {

        row = document.createElement('div');
        row.setAttribute('class', 'chooser_row');

        chooser = document.createElement('input');
        chooser.setAttribute('type', 'checkbox');
        chooser.setAttribute('value', data[idx].id);
        chooser.setAttribute('class', 'chooser');
        chooser.setAttribute('name', controlName + []);

        label = document.createElement('label');
        label.setAttribute('for', controlName);
        label.setAttribute('class', 'chooser_label');
        label.appendChild(document.createTextNode(data[idx].description));
  	  
  	    row.appendChild(chooser);	
  	    row.appendChild(label);
  	  
  	    this.container.appendChild(row);
  	  
  	  }
  	
  	  var placement = document.getElementById(this.placement_id);
  	  $(placement).empty();  	    
      placement.appendChild(this.container);
  	
    };
  
    this.render();
	
  }
  
   
  return YSDListSelector;
  
});