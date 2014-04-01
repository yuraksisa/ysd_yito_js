define(['YSDjson2'], function() {
  FileUploaderView = function(model, controller) {

    this.model = model;
    this.controller = controller;
    this.showingFileSelect = false;
    
    this.init = function() {
      
      var self = this;
      var controller = this.controller;
      var model = this.model;
     		
      $(document.forms[this.model.formName][this.model.inputFileId]).bind('change', function(event) {
  	  	if ($(document.forms[self.model.formName][self.model.inputFileId]).val() != '') {
  	  	  controller.fileSelected();
  	  	}
      });
         
      $(document.getElementById(this.model.iframeId)).bind('load', function(event){
        try 
        {
          if (model.state == 'uploading_file') { // Manages the event only when uploading the image
            model.file = JSON.parse(frames[model.iframeId].document.body.innerHTML);
         	  model.changeState('file_uploaded_ok');
          }                  	     
        }
        catch (e)
        { 
          model.changeState('file_uploaded_error');
        }      	
      	
      });
      
    }
    
    this.stateChanged = function(event) { /* State changed */
    	
    }
  }
  return FileUploaderView;
});
  