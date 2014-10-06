define(['YSDjson2'], function() {
  FileUploaderView = function(model, controller) {

    this.model = model;
    this.controller = controller;
    this.showingFileSelect = false;
    this.counter = 0;
    
    this.init = function() {
      
      var self = this;
      var controller = this.controller;
      var model = this.model;
     		
      $(document.forms[this.model.formName][this.model.inputFileId]).unbind('change');
      $(document.forms[this.model.formName][this.model.inputFileId]).bind('change', function(event) {
  	  	if ($(document.forms[self.model.formName][self.model.inputFileId]).val() != '') {
          model.fileName = $(document.forms[self.model.formName][self.model.inputFileId]).val();
          model.fileName += self.counter++;
  	  	  controller.fileSelected();
  	  	}
      });
      
      $(document.getElementById(this.model.iframeId)).unbind('load');   
      $(document.getElementById(this.model.iframeId)).bind('load', function(event){
        try 
        {
          if (model.state == 'uploading_file') { // Manages the event only when uploading the file
            model.data = JSON.parse(frames[model.iframeId].document.body.innerHTML);
         	  model.changeState('file_uploaded_ok');
          }                  	     
        }
        catch (e)
        { 
          model.changeState('file_uploaded_error', e);
        }      	
      	$(document.forms[self.model.formName][self.model.inputFileId]).val('');
      });
      
    }
    
    this.stateChanged = function(event) { /* State changed */
    	
    }
  }
  return FileUploaderView;
});
  