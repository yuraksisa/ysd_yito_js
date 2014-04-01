define(function() {

  FileUploaderController = function(model) {
    
    this.model = model;

    this.addNewFileClick = function() { /* The user clicks on the input file */
  	  var result = $(document.forms[this.model.formName][this.model.inputFileId]).click();
    }

  	this.fileSelected = function() { /* A file is selected to be uploaded */
  	  this.model.uploadFile();
  	}    

  }

  return FileUploaderController;

});