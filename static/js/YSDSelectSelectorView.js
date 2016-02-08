define(function() {
  
  /* ------------- The view -------------------- */

  YSDSelectSelectorView = function(model, controller, selectControlId, nullOption, nullOptionText) {

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
          this.createOptions();
          this.selectValues();
          break;
      
        case 'value_changed' :
          this.selectValues();
          break;  
      }
    
    }
  
    this.createNullOption = function() {
      var selectControl = document.getElementById(selectControlId);
      var  option = document.createElement('option');
      option.setAttribute('value', '');
      option.text = option.innerText = this.nullOptionText;
      selectControl.appendChild(option);    
    }
  
    this.createOptions = function() { /* Create the options */
    
      var data_options = this.model.data;
      var option = null;
      var selectControl = document.getElementById(selectControlId);
    
      if (selectControl != null) {
        // Remove the options
        if (selectControl.options.length > 0)
        {
           while (selectControl.hasChildNodes())
           {
             selectControl.removeChild(selectControl.firstChild); 
           }
        }

        if (nullOption) {
          this.createNullOption();
        }

        for (idx in data_options) {
      
          option = document.createElement('option');
          option.setAttribute('value', data_options[idx].id);
          option.text = option.innerText = data_options[idx].description;
      
          selectControl.appendChild(option);
      
        }
      }
    }
  
    this.selectValues = function() { /* Select the values */
  
      var the_value = this.model.value;
      var selectControl = document.getElementById(selectControlId);
      var option = selectControl.firstElementChild;    
    
      while (option) {
      
        if (the_value instanceof Array) {
          for (idx in the_value) {
            if (the_value[idx] instanceof Object && option.getAttribute('value') == the_value[idx].id) {
              option.selected = true; 
            }
            else 
              if (option.getAttribute('value') == the_value[idx])
              {
                option.selected = true;
              }
          }
        }
        else
        {
          if (the_value instanceof Object && option.getAttribute('value') == the_value.id) {
            option.selected = true; 
          }
          else if (option.getAttribute('value') == the_value) {
            option.selected = true;
          }
        }
      
        option = option.nextElementSibling;  
      }
    
    }
  
  
  }
  
  return YSDSelectSelectorView;
  
});