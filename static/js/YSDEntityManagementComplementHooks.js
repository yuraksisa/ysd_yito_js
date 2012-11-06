define( function() {
	
  YSDEntityManagementComplementHooks = {

    complements : [],

    register : function (complement) {  	
      this.complements.push(complement);  	  	
    }
	
  }    	
  
  return YSDEntityManagementComplementHooks;
	
	
});