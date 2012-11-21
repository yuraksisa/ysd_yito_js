define(['YSDListSelectorModel','YSDSelectSelectorController', 'YSDSelectSelectorView'],function(ListSelectorModel, SelectSelectorController, SelectSelectorView){

 /* ---------------------------
    SelectHierarchicalSelector
    ---------------------------
    A component to select a element or elements from a list using a html SELECT control
  
    It uses the ListSelectorModel as a model
    It creates a new View from the SelectSelectorView to represent the hierarchical components
  */ 

  YSDSelectHierarchicalSelector = function(selectControlId, dataSource, value, nullOption, nullOptionText) {
	
    this.model = new ListSelectorModel(dataSource, value);
    this.controller = new SelectSelectorController();
    this.view = new YSDSelectHierarchicalSelectorView(this.model, this.controller, selectControlId, nullOption, nullOptionText);	
  
    this.setValue = function(newValue) {
      this.model.setValue(newValue);	
    }
    
    this.controller.setView(this.view);
    this.model.setView(this.view);
  
    this.model.retrieveData(); /* Retrieve model data */
  	
  }

  /* ------------- The view -------------------- */

  YSDSelectHierarchicalSelectorView = function(model, controller, selectControlId, nullOption, nullOptionText) {

    SelectSelectorView.apply(this, arguments);

    this.model = model;
    this.controller = controller;
    this.selectControlId = selectControlId;
    this.nullOption = nullOption || false;
    if (nullOptionText) {
      this.nullOptionText = nullOptionText;
    }
    else {
      this.nullOptionText = '- No selection -';
    }

    this.notify = function(status) {
  	
      switch (status) {
    	
        case 'data_changed' :
          this.removeOptions();
          if (nullOption) {
   	        this.createNullOption();
          }         
          this.createOptions(this.model.data, 0);
          this.selectValues();
          break;
      
        case 'value_changed' :
          this.selectValues();
          break;	
      }
  	
    }
  
    this.removeOptions = function() {
  	
  	  var selectControl = document.getElementById(this.selectControlId);
  	
      // Remove the options
      if (selectControl.options.length > 0)
      {
         while (selectControl.hasChildNodes())
         {  
       	   selectControl.removeChild(selectControl.firstChild);	
         }
      }
 
  	
    }
  
    this.createOptions = function(data_options, level) { /* Create the options */
 
      for (var idx=0;idx<data_options.length;idx++) {
  	  
  	    var element = data_options[idx];
  	  
  	    this.createOption(element, level);
  	  
  	    if (element.children && element.children.length > 0) {
  	      this.createOptions(element.children, level+1);	
  	    }  
  	  
  	  }
  	
    }
  
    this.createOption = function(element, level) {
     
      var selectControl = document.getElementById(this.selectControlId);
      
      var levelStr = '';
      for (var i=0;i<level;i++) {
        levelStr += '-';
      }

  	  var option = document.createElement('option');
  	  option.setAttribute('value', element.id);
  	  option.text = option.innerText = levelStr + element.description;  	  
  	 
  	  selectControl.appendChild(option);
  	
    }
  		
  }

  YSDSelectHierarchicalSelectorView.prototype = new SelectSelectorView();
  YSDSelectHierarchicalSelectorView.constructor = YSDSelectHierarchicalSelectorView;

  return YSDSelectHierarchicalSelector;

});