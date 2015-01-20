define(['datejs'], function(){

  var formatter = {

    /**
     * Format a date 
     */
  	formatDate: function(the_date, format) {
  			
  	  if (typeof format == 'undefined') {
  	    format = 'dd.MM.yyyy HH:mm';	
  	  }	
  		
      if (the_date instanceof Date) {
        return the_date.toString(format);	
      }
  	  else	
        if (!isNaN(new Date(the_date))) { 
          return new Date(the_date).toString(format);
        }
        else 
        {
          return '';	
        } 	
  		
  	},
  
    /**
     * Format a currency
     */
    formatCurrency: function(the_currency, format) {
    	
    	
    },

    /**
     * Format a pad number
     */
    formatPadNumber: function(num, length) {
      var r = "" + num;
      while (r.length < length) {
        r = "0" + r;
      }
      return r;
    }
  
  };

  return formatter;

});