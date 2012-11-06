define(['json2'], function() {

   /* Redefine JSON parse */

   var _origParse = JSON.parse;
 
   JSON.parse = function(text) {
      
      var parsedObject = _origParse(text, function(key, value) {
      	
         var a;
 
         if (typeof value === 'string') {

            // UTC format
            a = /^(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)\sUTC$/.exec(value); 

            if (a) {
              return new Date(value); 	
            }
            
            // ISO 8601 format yyyy-mm-ddTHH:MM:ss.msZ (http://www.w3.org/TR/NOTE-datetime)
            
            a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)(Z|((([+|-])\d{2}):\d{2}))$/.exec(value);
 
            if (a) {
            	
            	 var hour_difference = 0;
            	
            	 if (a[a.length-1] == '+' || a[a.length-1] == '-') {
            	   hour_difference = parseInt(a[a.length-2]) * -1;
            	 }
            	            	 
            	 var year = +a[1];
            	 var month = +a[2] - 1;
            	 var day = +a[3];
            	 var hour = +a[4] + hour_difference;
            	 var minutes = +a[5];
            	 var seconds = +a[6];
            	 
            	 var resultISO8601 = new Date(Date.UTC(year, month, day, hour, minutes, seconds));
            	 
            	 return resultISO8601;
            	 
                 //return Date.parseExact(value, format) ;//Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
            }
            
            if (value.slice(0, 5) === 'Date(' && value.slice(-1) === ')') {
               var d = new Date(value.slice(5, -1));
               if (d) {
                  return d;
               }
            }
            
            
         }
  
         return value;
      });
      
      return parsedObject;
   }

});