define(function() {
	 
  /* -----------------------------------------------------------
     ArrayDataModel
     -----------------------------------------------------------
     The default datamodel which holds the data
     ----------------------------------------------------------- */
     
  function ArrayDataModel() {
    
    this.data = [];
    this.index = -1;	
    
    this.setData = function(data) { /* Sets the data */
    
      this.data = data;
    	
    }
    
    this.getData = function() { /* Gets the data */
    
      return this.data;
      
    }
   
    this.setIndex = function(newIndex) { /* Sets the index (the current element) */
    
      if (newIndex >= 0 && newIndex < this.count()) {

        this.index = newIndex;
   
      }
     
    }
  
    this.count = function() { /* Returns the data count */
    
      return this.data.length;
    
    }
    
    this.current = function() { /* Returns the current entity */
    
      if (this.index < 0 || this.index >= this.count()) {
        return null;
      }
      
      return this.data[this.index];
    
    }
    
    this.currentForUpdate = function() { /* Returns the current entity for update */
    
      return this.current();
    
    }
 
    this.append = function(new_data) { /* Creates a new element with the information */

      this.data.push(new_data);
      this.setIndex(this.count()-1);

    }

    this.synchronize = function (updated_data) { /* Synchronizes the current element with the information */
        
  	  for (field in updated_data) {
        if (typeof updated_data[field] != 'function') // && updated_data[field]) 2012.07.03
        {
          this.updateField(field, updated_data[field]);	
        }        
      }
      
      return this.currentForUpdate();
      
    }

    this.updateField = function(field, value) { /* Updates the current element field value */
    
      this.current()[field] = value;	
     	
    }
   	
  }
  
  return ArrayDataModel;
  
});
