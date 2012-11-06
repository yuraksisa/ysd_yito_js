define(['YSDArrayDataModel', 'YSDHierachyListAdapter'], function(ArrayDataModel, HierachyListAdapter){
	
  /* -----------------------------------------------------------
     TreeDataModel
     -----------------------------------------------------------
     If the data is hierachical organized, you can use the 
     TreeDataModel to represent the model.
     
     It uses YSDHierarchyListData to adapt the data, which
     is usually retrieved as an array, to a tree structure
     ----------------------------------------------------------- */  
  
  function TreeDataModel() { /* TreeDataModel */
  	ArrayDataModel.apply(this, arguments);
  	
  	this.adaptedData  = [];
  	this.equivalenceTable = [];
  	this.adaptedIndex = -1;
  	
  	this.setData = function(data) { /* It sets all the objects */

      TreeDataModel.prototype.setData.call(this, data);
      this.adaptedData = new HierachyListAdapter(data);      
      this.equivalenceTable = [];
      this.addToEquivalenceTable(this.adaptedData);

  	}

    this.getData = function() { /* It returns all the objects */
    	
      return this.adaptedData;
      		
    }
    
    this.current = function() { /* It returns the current object for render */
    
      if (this.index < 0 || this.index >= this.count()) {
        return null;
      }    
    
      return this.equivalenceTable[this.index];
    	
    }
    
    this.currentForUpdate = function() { /* It returns the current object for update */

      if (this.index < 0 || this.index >= this.count()) {
        return null;
      }    
    
      return this.data[this.equivalenceTable[this.index].original_index];
    	    	
    }
    
    this.updateField = function(field, value) { /* It updates a field in the current object */
    
      this.current()[field] = value;
      this.currentForUpdate()[field] = value;
    	
    }
    
    this.addToEquivalenceTable = function (data) {
           
      for (var idx=0;idx<data.length;idx++) {
      	
        this.equivalenceTable.push(data[idx]);
        
        if (data[idx].children.length > 0) {
          this.addToEquivalenceTable(data[idx].children);	
        }	
         	
      }
    	
    }  	  	
  }
  
  TreeDataModel.prototype = new ArrayDataModel();
  TreeDataModel.constructor = TreeDataModel;

  return TreeDataModel;

});
