define(['datejs'], function(){
	
  var YSDDateFormatter = {
  	
    formatISODate : function(the_date) {
    	
    	var d=new Date(the_date);
    	
    	var strDate =  d.toISOString("yyyy-MM-ddTHH:mm:ss");
    	    	
    	if (typeof d.getTimezoneOffset() == 'undefined' || d.getTimezoneOffset() == 0) {
    	  strDate += 'Z';	
    	}
    	else { 
    	  strDate += this.extractTimeZone(d);
    	} 
    	
    	return strDate;
    	   	
    },
    
    extractTimeZone: function(the_date) {
    	
		  var off = the_date.getTimezoneOffset() * -1,
		  	  minutes = off % 60,
			  hours = (off - minutes) / 60;

		  return (off >= 0 ? '+' : '-') + ('0' + (hours * 101).toString()).substr(-2) + ':' + ('0' + (minutes * 101).toString()).substr(-2);
    	
    }
    
  	
  }

  return YSDDateFormatter;
	
});
