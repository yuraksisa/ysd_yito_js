define(['YSDFileUploaderModel', 'YSDFileUploaderController', 'YSDFileUploaderView'],
     function(FileUploaderModel, FileUploaderController, FileUploaderView){

  FileUploader = function(formName, inputFileId, iframeId) {

    this.model = new FileUploaderModel(formName, inputFileId, iframeId);
    this.controller = new FileUploaderController(this.model);
    this.view = new FileUploaderView(this.model, this.controller);

    this.model.setView(this.view);
    
    this.addListener = function(type, listener) { /* addListener */
      this.model.addListener(type, listener);	
    }

    this.removeListener = function(type, listener) { /* removeListener */
      this.model.removeListener(type, listener);  	  
    }

    this.uploadFile = function() {
      this.controller.addNewFileClick();
    }

    this.view.init();

  }

  return FileUploader;

});