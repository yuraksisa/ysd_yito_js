define(['YSDEventTarget','async!https://maps.google.com/maps/api/js?sensor=false!callback'], function(YSDEventTarget){
	
  // http://www.svennerberg.com/2009/07/google-maps-api-3-markers/
  // https://gist.github.com/882682
  
  /* -----------------------
     YSDLocationViewer
     ----------------------- */
  YSDLocationViewer = function(element) {

    this.model = new YSDLocationViewerModel();
    this.controller = new YSDLocationViewerController(this.model);
    this.view = new YSDLocationViewerView(element, this.model, this.controller);
  
    this.controller.setView(this.view);
    this.model.setView(this.view);
  
    this.setCenter = function(location) {
      this.model.setCenter(location);	
    }
    
    this.addLocation = function(location) { // Location is an object with this properties: address, title, description
  
  	  this.model.addLocation(location);
  	
    }
    
  }

  YSDLocationViewerModel = function() { /* The MODEL */
  	
    this.locations = [];
  
    this.geocoder = null;
    this.region = 'yes';
    this.options = null;
  
    this.events = new YSDEventTarget();
  
    this.setView = function(view) {
      this.view = view;	
    }
                        	
    this.addListener = function(type, listener) { /* addListener */
      this.events.addEventListener(type, listener);	
    }
  	
    this.removeListener = function(type, listener) { /* removeListener */
      this.events.removeEventListener(type, listener);  	  
    }
  
    this.getMapOptions = function() {
  	
  	  if (this.options == null) {
  	    this.options = { zoom: 16,
                         center: this.locations[0].latlng,
                         mapTypeId: google.maps.MapTypeId.ROADMAP };	
  	  }
  	
  	  return this.options;  	
  	
    }
  
    this.setCenter = function(location) {

      if (this.geocoder == null) {
        this.geocoder = new google.maps.Geocoder();	
      }
     
      var self = this; 
      
      if (location.latlng) {
        this.locations.push(location);
        this.events.fireEvent({type:'set_center', location: location});
      }
      else {
        this.geocoder.geocode( { 
  	                           address : location.address,
                               region  : this.region,
                             },
                            function(result, status) {                    
                              location.latlng = new google.maps.LatLng(result[0].geometry.location.lat(), result[0].geometry.location.lng());
                              self.locations.push(location);                            
                              self.events.fireEvent({type:'set_center', location: location});   	
                            }); 	
      }
    	
    }
      
    this.addLocation = function(location) {
  
      if (this.geocoder == null) {
        this.geocoder = new google.maps.Geocoder();	
      }
     
      var self = this; 
      
      
      if (location.latlng) {
        self.locations.push(location); 
        this.events.fireEvent({type:'add_location', location: location});
      }
      else {
        this.geocoder.geocode( { 
  	                           address : location.address,
                               region  : this.region,
                             },
                             function(result, status) {                    
                               location.latlng = new google.maps.LatLng(result[0].geometry.location.lat(), result[0].geometry.location.lng());
                               self.locations.push(location);                            
                               self.events.fireEvent({type:'add_location', location: location});   	
                             }); 	
  	 	}
    }
 	
  }

  YSDLocationViewerController = function(model) { /* THE CONTROLLER */

    this.model = model;
  
    this.setView = function(view) {
  	  this.view = view;
    };

    this.infoClick = function(map, marker, location) {   
      var infowindow = new google.maps.InfoWindow( { // Creating an InfoWindow object
         content: location.description
      });
    
      infowindow.open(map, marker);	
    }
	
  }

  YSDLocationViewerView = function(element, model, controller) { /* THE VIEW */
	
	this.element = element;
	this.model = model;
	this.controller = controller;
	this.map =  null;
	
	var self = this;
	
    this.model.addListener('add_location', function(event) { self.addLocation(event.location) });
    this.model.addListener('set_center', function(event) { self.setCenter(event.location.latlng) });
    
    this.setCenter = function(latlng) { /* Sets the center of the map */
       
      var map_options = this.model.getMapOptions();
      map_options.center = latlng;
      
      if (this.map == null) {
        this.map = new google.maps.Map(document.getElementById(element), map_options);      	
      }
      else
      {
        this.map.options.center = latlong;	
      }	
    	
    }
    
    this.addLocation = function(theLocation) { /* Add location (marker) to the map */
     
      if (this.map == null) {     
        this.map = new google.maps.Map(document.getElementById(element), this.model.getMapOptions());
      }
      
      // Create the marker
      var marker = new google.maps.Marker({
          position: theLocation.latlng,
          map: this.map,
          title: theLocation.title
      });  


      google.maps.event.addListener(marker, 'click', function() {
         self.controller.infoClick(self.map, marker, theLocation);
      });      
             	
    }
	
  }

  return YSDLocationViewer;	
		
});