define(['YSDEventTarget'], function(EventTarget) {

  FileUploaderModel = function(formName, inputFileId, iframeId) {
    
    this.formName = formName;
    this.inputFileId = inputFileId;
    this.iframeId = iframeId;

    this.events = new EventTarget();  
    this.state = 'initial';
    this.file = null;

    this.addListener = function(type, listener) { /* addListener */
      this.events.addEventListener(type, listener); 
    }

    this.removeListener = function(type, listener) { /* removeListener */
      this.events.removeEventListener(type, listener);      
    }

    this.setView = function(view) {
      this.view = view; 
    }
    
    this.changeState = function(action) { /* change state */
      
      switch (action) {
      
        case 'send_request':
          this.state = 'uploading_file'
          break;
                
        case 'file_uploaded_ok':
          this.state = 'file_uploaded';
          this.events.fireEvent({type:'file_uploaded', data: {file: this.file}});
          break;
          
        case 'file_uploaded_error':
          this.state = 'error_uploading_file';
          break;
      }
      
      this.view.stateChanged(this.state);
      
    }
    
    this.uploadFile = function(file) { /* Upload the attachment */
      
      this.changeState('send_request');
      document.forms[this.formName].submit(); // Submits the form to upload the file
    
    }
    
  };


  return FileUploaderModel;
});
