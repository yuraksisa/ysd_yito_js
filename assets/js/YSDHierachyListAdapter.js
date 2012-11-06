define(function() {
	
  /*
    --------------------
    HierarchyAdapter
    --------------------
    @param list
      A list of objects which will be adapte to a tree structure
    
      The properties it uses are id and parent_id
      Example:
      adaptee ->[{'id':'news', description:'News', parent_id:null},
                 {'id':'sports', description:'Sports', parent_id:'news'}]

  */

  YSDHierachyListAdapter = function(list) {
  
    Array.apply(this, arguments);
  
    var processed_items={}; // A temporary hash which hold all the elements processed
    var item = null;
    var idx= 0;
  
    var item_added_in_round = false; // check if an item has been added in the cycle
    var processed_items_count = 0;   // the total processed in the list
  
    var adaptItem = function(item, idx) {
      var new_item = {'children':[],
                      'original_index' : idx};
    
      for (property in item) {
        new_item[property] = item[property];	
      } 
      
      return new_item;     
    }
  
    if ((!(list instanceof Array)) || list.length == 0) {
      return;
    }
  
    while (true) {
  	
      item = list[idx];
    
      if (!processed_items[list[idx].id]) { // If the item has not been proccesed
    
        var new_item = adaptItem(item, idx);
  	
        if (list[idx].parent_id == null) { // It's a root node
          new_item.level = 0;
          this.push(new_item);	
          processed_items[list[idx].id]=new_item;
          item_added_in_round = true;
          processed_items_count++;
        }	
        else {                            // It's a child node
          var parent = processed_items[list[idx].parent_id];
          if (parent) {
            new_item.level = parent.level+1;
            parent.children.push(new_item);	
            processed_items[list[idx].id]=new_item;
            item_added_in_round = true;
            processed_items_count++;
          }
        }
    
      }
    
      if (idx < list.length - 1) {
        idx++;
      }
      else {
        if (item_added_in_round && processed_items_count < list.length) {
          idx = 0;
          item_added_in_round = false;	
        }
        else {
          break;      	
        }	
      }
  	  	
    }
  	
  }

  YSDHierachyListAdapter.prototype = new Array();
  YSDHierachyListAdapter.constructor = YSDHierachyListAdapter;

  return YSDHierachyListAdapter;

});	
