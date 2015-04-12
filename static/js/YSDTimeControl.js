define(['jquery'], function($){
	
  /******************************************************************
   * Constructor for DateControl
   *
   * @param comboHours The combo where hours are represented
   * @param comboMinutes The combo where minutes are represented
   * @param hiddenTime the input hidden where time is stored
   */
  YSDTimeControl = function(comboHours, comboMinutes, hiddenTime) {
  	
    // Creates the model
    var theModel = new YSDTimeControlModel();
  
    // Creates the controller
    var theController = new YSDTimeControlController(theModel);
  
    // Creates the view
    var theView = new YSDTimeControlView(theController, theModel, comboHours, comboMinutes, hiddenTime);

    // Associates the view with the model and the controller
    theModel.setView(theView);
    theController.setView(theView);
  
    this.setTime = function(time) { /* Sets the date */
  	
      theModel.setTime(time);
  	
    }
  			
  };

  /* ------------- The Model -------------------- */

  YSDTimeControlModel = function () {

    this.time = "00:00";
    this.hours = "00";
    this.minutes = "00";
    this.hoursList = ["00","01","02","03","04","05","06","07","08","09","10","11",
                      "12","13","14","15","16","17","18","19","20","21","22","23"];
    this.minutesList = ["00","15","30","45"];
       
    this.setView = function(view) {
   	  this.view = view;
    };
   
    this.setTime = function(time) { /* Assign the time */
   	  this.time = time;
      var timeParts = this.time.split(":");
      if (timeParts.length == 2) {
        this.hours = timeParts[0];
        this.minutes = timeParts[1];
      }
      this.view.data_changed('time');
    }
   
    this.setHours = function(hours) { /* Assign the hours */
   	  this.hours = hours;
      this.time = this.hours + ":" + this.minutes;
   	  this.view.data_changed('hours');
     }
   
    this.setMinutes = function(minutes) { /* Assign the minutes */
      this.minutes = minutes;
      this.time = this.hours + ":" + this.minutes;
      this.view.data_changed('minutes');
    }
	
  }

  /* ------------ The controller ---------------- */

  YSDTimeControlController = function(model) {
	
	  this.model = model;
	
	  this.setView = function(view) {
   	  this.view = view;
    };
	
  	this.hours_changed = function(hours) { /* The user changes the hours */
			 		 			 		
	    this.model.setHours(hours);		
			
	  };
	
	  this.minutes_changed = function(minutes) { /* The user changes the minutes */   

      this.model.setMinutes(minutes);
		
	  };
				
  }

  /* ------------------ The view --------------------- */
  
  YSDTimeControlView = function(controller, model, comboHours, comboMinutes, hiddenTime)
  {
    this.controller = controller;
    this.model = model;
  
    this.comboHours = comboHours;     
    this.comboMinutes = comboMinutes;  	
    this.hiddenTime = hiddenTime; 
		
    /* The view is notified of changes in the model */
  	
    this.data_changed = function (information) { 

  	  switch (information) {
  	 	  	     
  	    case 'time' : /* full time */
  	     
  	      comboHours.selectedIndex = model.hoursList.indexOf(model.hours); 
  	      comboMinutes.selectedIndex = model.minutesList.indexOf(model.minutes); 
  	 	
  	    case 'hours' : /* hours */
  	    case 'minutes': /* minutes */
  	   
          hiddenTime.value = model.time;
  	     
  	      break; 	
  	 	
  	   }
  	 
  	
    };
		
    /* Builds the control */	
	
    this.render = function() { 
  	
  	   var hours = model.hoursList;
  	   for (var idxHour = 0; idxHour < hours.length; idxHour++)
  	   {
  	     var optionHour = document.createElement('option');
  	     optionHour.setAttribute('value', hours[idxHour]);	
  	     optionHour.text = optionHour.innerText = hours[idxHour];
  	     comboHours.appendChild(optionHour);
  	   }  	

       var minutes = model.minutesList;
       for (var idxMinutes = 0; idxMinutes < minutes.length; idxMinutes++)
       {
         var optionMinute = document.createElement('option');
         optionMinute.setAttribute('value', minutes[idxMinutes]);  
         optionMinute.text = optionMinute.innerText = minutes[idxMinutes];
         comboMinutes.appendChild(optionMinute);
       }    
  	   	   	 
  	   // Configure the events
  	 
  	   $(comboHours).bind('change',
  	     function(event) {	
           controller.hours_changed(this.value);
         });
  	 
  	   $(comboMinutes).bind('change', 
  	     function(event) {
  	       controller.minutes_changed(this.value);
  	     });
  	      	    
    }
	
    this.render();	
	
  }

  return YSDTimeControl;

});


