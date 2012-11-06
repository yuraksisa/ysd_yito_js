define(function() {

  /* 
   --------------------
   DataAdapter
   --------------------

   @param adaptee 
     The object that will adapt
   @param matchingProperties
     An object with the relationship
     Example :
     adaptee -> {group: 'mygroup', name: 'myname'}
     And we want to adapt to {id: 'mygroup', description : 'myname'}
     matchingProperties will be {id: 'group', description : 'name'}
     
   */
  YSDDataAdapter = function(adaptee, matchingProperties) {
	
	this.adaptee = adaptee;
	
	for (idx in matchingProperties) {
	 
	  this[idx] = adaptee[matchingProperties[idx]];
	 	
	}
	
  }
  
  return YSDDataAdapter;

});
