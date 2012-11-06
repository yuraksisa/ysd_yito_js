define(['json2'], function() {

   /* Redefine JSON parse */

   var _origParse = JSON.parse;
 
   JSON.parse = function(text) {
      return _origParse(text, function(key, value) {
         var a;
 
         if (typeof value === 'string') {

            // UTC format
            a = /^(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)\sUTC$/.exec(value); 

            if (a) {
              return new Date(value); 	
            }
            
            // ISO 8601 format yyyy-mm-ddTHH:MM:ss.msZ (http://www.w3.org/TR/NOTE-datetime)
            
            a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)(Z|([+|-]\d{2}:\d{2}))$/.exec(value);
 
            if (a) {
                 return new Date(value) ;//Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
            }
            
            if (value.slice(0, 5) === 'Date(' && value.slice(-1) === ')') {
               var d = new Date(value.slice(5, -1));
 
               if (d)
                  return d;
            }
            
            
         }
 
         return value;
      });
   }

});