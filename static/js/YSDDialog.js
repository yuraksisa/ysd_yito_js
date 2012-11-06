define(['jquery','jquery.ui'], function($){

 /*-------------------------------------------------
   YSDProcessingRequest
   -------------------------------------------------
   
  It uses jquery and jqueryui to show the dialog message 
   
  Class for creating status dialogs while an operation is performing
  
  Using it :
  
    > create an instance
    
    sending = new YSDProcessingRequest('my message');
    
    > to show the dialog
    
    sending.show
    
    > to hide the dialog
    
    sending.close

  --------------------------------------------------- */
  
  YSDProcessingRequest = function(message) { 
  	  
  	 this.id = 'sending-ajax-request';
  	 this.message = message;
  	  		
  	 this.show = function() {
   	   if (!document.getElementById(this.id) ) {
  	     createSendingElement.call(this);	
  	   } 	
  	   $('#'+this.id).dialog('open');	
  	 };
  	 
  	 this.close = function() {
  	   $('#'+this.id).dialog('close');	
  	 }
  	 
  	 // ------- private components ------------
  	 
  	 var createSendingElement = function() {
  	
  	    divSending = document.createElement('div');
  	    divSending.setAttribute('id', this.id);
        divSending.setAttribute('title', this.message);  	  
  	    imgSending = document.createElement('img');
  	    imgSending.setAttribute('src', '/img/ajax-loader_grande.gif');
  	    imgSending.style.margin = '0 auto';
  	    imgSending.style.display = 'block';
  	    imgSending.style.marginTop = '15px'; 
  	  
  	    divSending.appendChild(imgSending);
  	
  	    // Configure the dialog
        $(divSending).dialog({autoOpen: false, height: 160, modal: true,
           closeOnEscape: false,
           open: function(event, ui) { $(".ui-dialog-titlebar-close").hide(); },
           close: function(event, ui) { $(".ui-dialog-titlebar-close").show(); }
        });	  	
  	
  	  }  	 
  	
  }	

  return YSDProcessingRequest;

});