/* jquery plugins used :
     - formparams
 */
define(['jquery', 'YSDEventTarget','YSDGui', 'YSDjson2', 'jquery.formparams', 'jquery.validate'], function($,YSDEventTarget,YSDGui){
	
  /* ------------------------------------------------------------------
     EntityModel
     
     @param [Object] url
       The urls to access the REST API
     @param [String] entity
       The entity name
     @param [Numeric] pageSize
       The page size (for querying)
     @param [EntityView] entityView
       The entity view
     @param [Array] entityHook
       The hooks
     @param [dataModel]
       The data model (which holds the model's data)
     
     ------------------------------------------------------------------ */

  function EntityModel(urls, entity, pageSize, entityView, entityHooks, dataModel, model_configuration) { /* It represents the model */
  	
    this.urls = {};
    this.urls.query_url  = urls.query_url;
    this.urls.create_url = urls.create_url;
    this.urls.update_url = urls.update_url;
    this.urls.delete_url = urls.delete_url;
    if (typeof urls.delete_all_url != 'undefined') {
      this.urls.delete_all_url = urls.delete_all_url;
    }
    this.urls.get_url    = urls.get_url;  
    	
  	this.entityView = entityView;
  	this.entity = entity;
	
	  if (entityHooks == null) {
	    this.entityHooks = [];	
	  }
	  else if (entityHooks instanceof Array) {
	    this.entityHooks = entityHooks;
	  }
	  else {
	    this.entityHooks = new Array(entityHooks);	
	  }
	
    this.pageSize = pageSize; /* Number of elements shown in a page */
  	  	
  	this.state  = 'initial';
  	
  	this.navigationMode = 'page'; /* It represents the navigation mode : page or entity */
  	this.queryMode = 'page';      /* It represents the query mode : page or entity */
  	
  	this.dataModel = dataModel;   /* It represents the data model */
  	this.summary = null;          /* Represents the summary data (retrieved) */
  	this.page = 1;  	            /* It represents the current page */
  	this.lastError = null;        /* It represents the last error in Ajax request */
  	
  	this.events = new YSDEventTarget(); /* Manages the model events */
  	this.forceReload = false; /* In a massive data entry, forces reload elements when the user cancels insert after creating some elements */  	
    this.searchData = {};

  	/* ------- Event listeners ---------- */
  	
  	this.addListener = function(type, listener) { /* addListener */
  	  this.events.addEventListener(type, listener);	
  	}
  	
  	this.removeListener = function(type, listener) { /* removeListener */
  	  this.events.removeEventListener(type, listener);  	  
  	}
  	  	
  	/* ------- State Machine ------------ */  	
  	  	
    this.change_state = function(action) {
    
      switch (action) {
      	
      	case 'query_execution' :
      	   this.state = 'executing_query';
      	   break;      	   
      	case 'query_executed_successful' :
      	   this.state = 'data_loaded';
      	   break;      	
      	case 'query_executed_error' :
      	   this.state = 'error_retrieving_data';
      	   break;  

        case 'bulk_action':
           this.state = 'executing_bulk_action';
           break;
        case 'bulk_action_executed_successfully':
           this.state = 'bulk_action_executed';
           break;
        case 'bulk_action_executed_error':
           this.state = 'error_executing_bulk_action';
           break;

        case 'execute_action':
           this.state = 'executing_action';
           break;
        case 'action_executed_successfully':
           this.state = 'action_executed';
           break;
        case 'action_executed_error':
           this.state = 'error_executing_action';
           break;

        case 'entity_load':
           this.state = 'loading_entity';
           break;
        case 'entity_loaded_successfully':
           this.state = 'entity_loaded';
           break;
        case 'entity_loaded_error':
           this.state = 'error_loading_entity';
           break;

      	case 'entity_create':
      	   this.state = 'creating_entity';
      	   break;      	         	
      	case 'entity_created_successfully':
      	   this.state = 'entity_created';           
      	   break;
      	case 'entity_created_error':
      	   this.state = 'error_creating_entity';
      	   break;

      	case 'entity_update':
      	   this.state = 'updating_entity';
      	   break;      	
      	case 'entity_updated_successfully':
      	   this.state = 'entity_updated';
      	   break;      	
      	case 'entity_updated_error':
      	   this.state = 'error_updating_entity';
      	   break;
      	   
      	case 'entity_delete':
      	   this.state = 'deleting_entity';
      	   break;
      	case 'entity_deleted_successfully':
      	   this.state = 'entity_deleted';
      	   break;
      	case 'entity_deleted_error':
      	   this.state = 'error_deleting_entity';
      	   break;
      	   
      	case 'all_entities_delete':
      	   this.state = 'deleting_all_entities';
      	   break;
      	case 'all_entities_deleted_successfully':
      	   this.state = 'all_entities_deleted';
      	   break;
      	case 'all_entities_deleted_error':
      	   this.state = 'error_deleting_all_entities';
      	   break;
      	      	
      };
    
      this.events.fireEvent( {type:'state_changed', state: this.state});		
    	
    };
  	
  	/* ----- Getting information from URL and headers ------- */
  	  	  	
  	this.extractConfigurationFromURL = function() { /* Extract configuration attributes (url_base, action, id, parentId, search_params) from the URL */
  	  	
  	  var the_url = window.location.pathname;
      if (this.configuration.prefix) {
        the_url = the_url.replace(this.configuration.prefix, '');
      }
      var parts = the_url.split('/');

      // Removes the language from the parts before processing them
      if (['en','es','ca','fr'].indexOf(parts[parts.length-1]) >= 0) {
        parts.splice(parts.length-1,1);	
      }

      var action = null;
  	  
  	  if (this.configuration.parent_filtered) { 	  	
  	  	//  list:  /my-entity/parentId
        //  new :  /my-entity/parentId/new
        //  edit:  /my-entity/parentId/edit/id
        //  view:  /my-entity/parentId/id  
  	    if (parts.length == 3) {
  	  	    this.configuration.url_base = '/'+parts[1];	
  	  	    this.configuration.parentId = parts[2];
  	  	    this.configuration.action   = 'list';
  	  	    this.configuration.id       = null;	
    	}
   	    else if (parts.length > 3) {
  	  	  this.configuration.url_base = '/'+parts[1]; 
  	  	  this.configuration.parentId = parts[2];
  	  	  if (parts[3].match(/new|edit/)) {
  	  	    this.configuration.action = parts[3];
  	  	    if (parts.length >= 4){
   	          this.configuration.id = parts[4];
  	  	    }
  	  	  }
  	  	  else {
  	  	  	this.configuration.action = 'view';
  	  	  	this.configuration.id = parts[3]
  	  	  }
  	    }
  	  }
  	  else {
        //  list:  /my-entity
        //  new :  /my-entity/new         
        //  edit:  /my-entity/edit/id
        //  view:  /my-entity/id
        this.configuration.parentId = null;
  	    if (parts.length == 2) {
  	  	    this.configuration.url_base = '/'+parts[1];	
  	  	    this.configuration.action   = 'list';
  	  	    this.configuration.id       = null;	
    	}
   	    else if (parts.length > 2) {
  	  	  this.configuration.url_base = parts[1]; 
  	  	  if (parts[2].match(/new|edit/)) {
  	  	    this.configuration.action = parts[2];
  	  	    if (parts.length >= 3){
   	          this.configuration.id = parts[3];
  	  	    }
  	  	  }
  	  	  else {
  	  	  	this.configuration.action = 'view';
  	  	  	this.configuration.id = parts[2]
  	  	  }
  	    }

  	  }
  	           
  	};
  	
  	this.extractSearchParamsFromURL = function() { /* Extract the search params from the URL */
  		
      var urlParams = {};
      var e,
         a = /\+/g,  // Regex for replacing addition symbol with a space
         r = /([^&=]+)=?([^&]*)/g,
         d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
         q = window.location.search.substring(1);

      while (e = r.exec(q)) {
        urlParams[d(e[1])] = d(e[2]);
      }

      if (typeof this.configuration.search_params == 'undefined') {
        this.configuration.search_params = {};
      }

      for (var param in urlParams) {
        this.configuration.search_params[param] = urlParams[param];
      }
       		
  	}
  	
  	/* If the configuration is supplied */
  	  	
  	this.configuration = {};
  	  	
  	if (model_configuration) { 
  	  for (property in model_configuration) {
  	    this.configuration[property] = model_configuration[property];
  	  }
  	}
  	
  	if (!this.configuration.url_base || !this.configuration.action) { 	
  	  this.extractConfigurationFromURL();
  	}
    
    this.extractSearchParamsFromURL();
  	  	  	
  	/* ---------- Accessing elements -------- */
  	
  	this.setPage = function(newPage) {         /* Changes the current page */
  	  this.page = newPage;
      var count=0;
      for (var idx in this.searchData) {
        count++;
      }
      if (count == 0) {
        this.query();
      }
      else {
  	    this.query(this.searchData); // Retrieve more data
  	  }
    };
  	  	
  	this.setEntityIndex = function(newIndex) { /* Changes the current entity element */

  	  this.dataModel.setIndex(newIndex);
  	  
  	  if (this.navigationMode != 'entity') {
  	    this.navigationMode = 'entity';	
  	  }
  	  
  	  this.events.fireEvent( {type:'entity_selected'} );
  	}
  	
  	this.getEntityIndex = function() {         /* Gets the current index */
  	  
  	  return this.dataModel.index;
  	  	
  	}
  	
  	this.currentEntity = function() {          /* Retrieves the current entity */
 	  
      return this.dataModel.current();
  	  	
  	};

    this.getEntityId = function(object) { /* Get the entity id of the object */

      for (var idx=0; idx < this.entityHooks.length; idx++) {         
         if (this.entityHooks[idx].entityKey) {
           return this.entityHooks[idx].entityKey(object); 
         }           
      }

      return null;

    }

    this.getEntityIndexFromObject = function(object) { /* Search the entity in the list (by its key) and return it*/

      var entities = this.getEntities();
      var objectKey = this.getEntityId(object);

      for (var idx=0; idx < entities.length; idx++) {
         if (objectKey != null && objectKey == this.getEntityId(entities[idx])) {
           return idx;
         }
      }

      return -1;

    }

    this.synchronizeEntities = function(data) { /* Updates the entities with this data */
      
      var oldIndex = this.getEntityIndex();
      
      try {
        
        var entityIndex = null;

        for (var idx=0; idx < data.length; idx++) {
    
          entityIndex=getEntityIndexFromObject(data[idx]);

          if (entityIndex > -1) {
            this.setEntityIndex(entityIndex);
            this.synchronizeCurrentEntity(data[idx]);
          }

        }
      
      }
      finally {
        this.setEntityIndex(oldIndex);
      }

      return this.dataModel.getData();

    }  	

  	this.synchronizeCurrentEntity = function(new_data) { /* Updates the current entity with this data */
  	
  	  return this.dataModel.synchronize(new_data);
  	
  	}  	
  	
    this.appendEntity = function(new_data) { /* Adds a new entity with this data */
      
      this.dataModel.append(new_data);

      if (this.summary == null) {
        this.summary = {total:1};
      }

    }

  	this.entitiesCount = function() {        /* Returns the number of entities loaded */
  	
  	  return this.dataModel.count();
  	  
  	}
  	
  	this.setEntities = function(data) {
  	
  	  this.dataModel.setData(data);
  	  this.dataModel.setIndex(0);
  		
  	}
  	
  	this.getEntities = function() { /* Retrieves the entities (data) */
  	 
  	  return this.dataModel.getData();
  	 
  	}
  	
    this.reload = function() {
      var count=0;
      for (var idx in this.searchData) {
        count++;
      }
      if (count == 0) {
        this.query();
      }
      else {
        this.query(this.searchData); // Retrieve more data
      }     
    }
  	
  	/* -------- Query ------------ */
  	
  	this.queryParams = function() { /* Retrieve the query params */
  	
  	  var the_mode = this.queryMode;
  	
  	  var queryParam = '';
  	
  	  if (the_mode == 'page') {
  	  	queryParam = '/page/' + this.page;
  	  }
  	  else {
  	  	
  	  	// Process the Hooks
        for (var idx=0; idx < this.entityHooks.length; idx++) {        	
          if (this.entityHooks[idx].entityKey) {
            queryParam = '/' + this.entityHooks[idx].entityKey(this.currentEntity());	
            break;
          }	        	
        }
  	    	
  	  }
  	  
  	  return queryParam;
  	 	
  	};
  	
  	/* -------- Hash management ---------- */
  	
  	this.hash_page_expression = /^(\w+)\/page\/(\d+)$/;
    this.hash_element_expression = /^(\w+)\/(\d+)$/;
  	
  	this.setLocationHash = function(newHash) { /* stores the query params in window.location.hash */
  		
  	  if (newHash != window.location.hash.substring(window.location.hash.indexOf('#'))) {
  	    window.location.hash = newHash;
  	  }
  		
  	};  	
  	
  	/* -------- Summary information ------- */
  	
  	this.summaryPageMessage = function() { /* Get the summary block message */
 	  	return Math.max(((this.page-1) * this.pageSize + 1), 1) + ' - ' + Math.min(((this.page) * this.pageSize), this.summary.total) + ' de ' + this.summary.total;
 	  },
 	  
 	  this.summaryElementMessage = function() { /* Get the element block message */
 	  	return (((this.page-1) * this.pageSize) + this.getEntityIndex() + 1) + ' de ' + this.summary.total;
 	  }, 	  	

    this.summaryMessage = function() { /* Get the summary message */
    	return this.navigationMode == 'page'?this.summaryPageMessage():this.summaryElementMessage();
    }
  	
  	/* -------- Navigation ------- */
  	  	  	  	
  	this.nextPage = function() { /* Navigate to the next page */
  	  if (!this.isLastPage()) {
  	    this.setPage(this.page + 1);	
  	  }	
  	};
  	
  	this.previousPage = function() { /* Navigate to the previous page */
  	  if (!this.isFirstPage()) {
  	    this.setPage(this.page - 1);	
  	  }	
  	};
  		 	
  	this.nextElement = function () { /* Navigate to the next element */
  	  
  	  if (!this.isLastElement()) {
  	    this.setEntityIndex(this.getEntityIndex() + 1);	
  	  }
  	  else {
  	    this.nextPage();	
  	  }
  	  	
  	};
  	
  	this.previousElement = function() { /* Navigate to the previous element */
  	  
  	  if (!this.isFirstElement()) {
  	  	this.setEntityIndex(this.getEntityIndex() - 1);	
  	  }
  	  else {
  	    this.previousPage();	
  	  }
  	  	
  	};
  	
  	this.isFirstPage = function() { /* Check if we are in the first page */
       return this.page == 1;
    };
      
    this.isLastPage = function() { /* Check if we are in the last page */
       return (this.pageSize * this.page) >=  this.summary.total;
    };  
  	
  	this.isFirstElement = function() { /* Check if we are in the first element */ 
  	  return this.getEntityIndex() == 0;
  	};
  	  
  	this.isLastElement = function() { /* Check if we are in the last element */
  	  return this.getEntityIndex() == (this.entitiesCount() - 1)	
  	};  	
  	  	
  	/* -------- Business actions --------- */
  	
  	this.get = function() { /* Retrieves an instance */
  	
  	  this.change_state('entity_load');
  	  
  	  var the_model = this;
  	  var the_url = this.urls.get_url;
  	  if (this.configuration.id) {
  	  	the_url += ('/' + this.configuration.id);
  	  }
  	  
  	  if (YSDGui.lockBackground) {
  	  	YSDGui.lockBackground("#000000", false);
  	  }

      $.ajax( {
      	        url: the_url,
      	        type: 'GET',
      	        content_type: 'json',
      	        headers: {"Accept":"application/json"},
      	        dataType: 'json',
      	        success: function(data, textStatus, jqXHR) {
      	          if (data != null) {
      	          	if (data.data && data.summary) {
      	          	  the_model.setEntities(data.data);
      	          	  the_model.summary = data.summary;
      	          	}
      	          	else {
      	              the_model.setEntities(new Array(data));
      	              the_model.summary = {total : 1};
      	          	}
      	          }
      	          the_model.change_state('entity_loaded_successfully');	
      	        },
      	        error: function(data, textStatus, jqXHR) {
      	          the_model.change_state('entity_loaded_error');	
      	        },
      	        complete : function(jqXHR, textStatus) {
      	          if (YSDGui.unLockBackground) {
      	            YSDGui.unLockBackground();
      	          }	
      	        }
      });
  		 		
  	};
  		

  	this.create = function(createUrl, callback) {  /* Creates a new instance */

  	  this.change_state('entity_create');
  	  
  	  var the_model = this;
  	  var the_url = createUrl || this.urls.create_url;
  	  
  	  if (!$($('.create-entity-button')[0].form).valid()) {
  	  	this.entityView.notify_user('Validation errors', 'Check the form. There are errors');
  	    return;	
  	  }
  	  
  	  var the_data = $($('.create-entity-button')[0].form).formParams(true);
  	  
  	  // Pre-process the data before be sent to the backend (Hooks) 	  
      for (var idx=0; idx < this.entityHooks.length; idx++) {        	
        if (this.entityHooks[idx].adaptFormData) {
          the_data = this.entityHooks[idx].adaptFormData(the_data);	
        }	        	
      }
  	  
  	  the_data = encodeURIComponent(JSON.stringify(the_data));
  	    	
  	  if (!this.configuration.newInline) {
	      YSDGui.lockBackground("#000000", false);
  	  }
  	  
  	  $.ajax( {
  	  	        url  : the_url,
  	  	        data : the_data,    
  	            type : 'POST',
  	            /*crossDomain : true,*/
  	            data_type : 'json',
  	            content_type : 'json',
  	            success : function(data, textStatus, jqXHR) {
                  the_model.appendEntity(data);                      
                  for (var idx=0; idx < the_model.entityHooks.length; idx++) { // Notify the hooks that the element has been created         
                    if (the_model.entityHooks[idx].onCreate) {
                      the_model.entityHooks[idx].onCreate(data); 
                    }           
                  }
  	              the_model.change_state('entity_created_successfully');
                  if (callback) {
                    callback();
                  }  	            
                },
  	            error : function(data, textStatus, jqXHR) {
  	              the_model.change_state('entity_created_error');	
  	            },
  	            complete : function(jqXHR, textStatus) {
  	              if (!the_model.configuration.newInline) {
  	                YSDGui.unLockBackground();	
  	              }	
  	            }
  	  });

  		
  	};
  		
  	
  	this.update = function(updateUrl, callback, button) { /* Updates an existing instance */
  	  
  	  this.change_state('entity_update');
  	  
  	  var the_model = this;
  	  var the_url = updateUrl || this.urls.update_url;
  	  
      var the_button = button || $('.update-entity-button')[0];

  	  if (!$(the_button.form).valid()) {
  	  	this.entityView.notify_user('Validation errors', 'Check the form. There are errors');
  	    return;	
  	  }  	  
  	  
  	  var the_data = $(the_button.form).formParams(true);

  	  // Pre-process the data before be sent to the backend (Hooks)	  
      for (var idx=0; idx < this.entityHooks.length; idx++) {        	
        if (this.entityHooks[idx].adaptFormData) {
          the_data = this.entityHooks[idx].adaptFormData(the_data);	
        }	        	
      }
  	  
  	  /*the_data = this.synchronizeCurrentEntity(the_data);*/ /* 2013.02.02 Avoid updating not modified fields */
  	    	    	    	    	  
  	  the_data = encodeURIComponent(JSON.stringify(the_data));
  	  
  	  if (!this.configuration.editInline) {
	      YSDGui.lockBackground("#000000", false);
  	  }
  	  
  	  $.ajax( {
  	  	        url  : the_url,
  	  	        data : the_data,    
  	            type : 'PUT',
  	            /*crossDomain : true,*/
  	            data_type : 'json',
  	            content_type : 'json',
  	            success : function(data, textStatus, jqXHR) {
  	              the_model.synchronizeCurrentEntity(data);
  	              the_model.change_state('entity_updated_successfully');
                  if (callback) {
                    callback();
                  }   
  	            },
  	            error : function(data, textStatus, jqXHR) {
  	              the_model.change_state('entity_updated_error');	
  	            },
  	            complete : function(jqXHR, textStatus) {
  	              if (!the_model.configuration.editInline) {
  	                YSDGui.unLockBackground();	
  	              }	
  	            }
  	  });
  	   
  	  
  	};
  	
  	
  	this.deleteCurrent = function(callback) { /* Delete an existing instance */
  		
  	  this.change_state('entity_delete');
  	  
  	  var the_url = this.urls.delete_url;
  	  var the_model = this;
  	  var the_data = encodeURIComponent(JSON.stringify(this.currentEntity()));
  	  
  	  if (YSDGui.lockBackground) {
	    YSDGui.lockBackground("#000000", false);
  	  }
  	  
  	  $.ajax( {
  	  	        url  : the_url,
  	  	        data : the_data,    
  	            type : 'DELETE',
  	            /*crossDomain : true,*/
  	            data_type : 'json',
  	            content_type : 'json',
  	            success : function(data, textStatus, jqXHR) {
                  for (var idx=0; idx < the_model.entityHooks.length; idx++) { // Notify the hooks that the element has been deleted         
                    if (the_model.entityHooks[idx].onDelete) {
                      the_model.entityHooks[idx].onDelete(data); 
                    }           
                  }                  
  	              the_model.change_state('entity_deleted_successfully');
                  if (callback) {
                    callback();
                  }                  
  	            },
  	            error : function(data, textStatus, jqXHR) {
  	              the_model.change_state('entity_deleted_error');	
  	            },
  	            complete : function(jqXHR, textStatus) {
  	              if (YSDGui.unLockBackground) {
  	                YSDGui.unLockBackground();	
  	              }	
  	            }
  	  });  	  	
  		
  	};
  	
  	this.deleteAll = function(callback) { /* Deletes all entities */
  	
  	  this.change_state('all_entities_delete');
  	  var the_model = this;
  	  var the_url = this.urls.delete_all_url;
  	
  	  if (YSDGui.lockBackground) {
	    YSDGui.lockBackground("#000000", false);
  	  }
  	  	
  	  $.ajax( {url : the_url ,
  	          data : null,
  	          type : 'DELETE' ,
  	          /*crossDomain: true,*/
  		      data_type : 'json',
  		      content_type : 'json',
  		      success : function(data, textStatus, jqXHR) {
  		      	the_model.change_state('all_entities_deleted_successfully');
              if (callback) {
                callback();
              }              
  		      },
  		      error : function(data, textStatus, jqXHR) {
  		      	the_model.lastError = textStatus;
  		      	the_model.change_state('all_entities_deleted_error');
  		      },
  		      complete : function(jqXHR, textStatus) {
  		      	if (YSDGui.unLockBackground) {
  		          YSDGui.unLockBackground();
  		      	}	
  	          }
  	  });   	
  	
  	};
  	
    this.query = function(queryObject, callback) { /* Queries for data */
  	 	  	 	
  	  this.change_state('query_execution');	
        	  
  	  if (typeof queryObject != 'undefined') {
   	    queryObject = encodeURIComponent(JSON.stringify(queryObject));
  	  }

  	  var queryString = $('.search-entity-input').val();
  	  
  	  var the_url = this.urls.query_url + this.queryParams(); 	  	  
  	  var the_model = this;
  	
  	  this.setLocationHash(this.queryParams());
  	  
  	  if (YSDGui.lockBackground) {
	    YSDGui.lockBackground("#000000", false);
  	  }
  	  	
  	  $.ajax( {url : the_url ,
  	          data : queryObject || queryString,
  	          type : 'POST' ,
  	          /*crossDomain: true,*/
  		      data_type : 'json',
  		      content_type : 'json',
  		      success : function(data, textStatus, jqXHR) {
  		      	the_model.dataModel.setData(data.data);
  		      	the_model.summary = data.summary;
  		      	the_model.change_state('query_executed_successful');
              if (callback) {
                callback();
              }              
  		      },
  		      error : function(data, textStatus, jqXHR) {
  		      	the_model.lastError = textStatus;
  		      	the_model.change_state('query_executed_error');
  		      },
  		      complete : function(jqXHR, textStatus) {
  		      	if (YSDGui.unLockBackground) {
  		          YSDGui.unLockBackground();
  		      	}	
  	          }
  	  }); 
  	};

    this.navigateTo = function(url) { /* Navigate to the url */
      window.location.href = url;
    };
  	
    this.action = function(method, url, data, callback) { /* Execute the action on the selected entity */

     var the_data = null;
     var the_model = this;

     this.change_state('execute_action');

     YSDGui.lockBackground("#000000", false);

     if (typeof data != 'undefined') {
       the_data = encodeURIComponent(JSON.stringify(data));
     }

     $.ajax( {url: url,
              data: the_data,
              type: method,
              data_type: 'json',
              content_type: 'json',
              success: function(data, textStatus, jqXHR) {
                the_model.synchronizeCurrentEntity(data);
                  for (var idx=0; idx < the_model.entityHooks.length; idx++) { // Notify the hooks that the element has been created         
                    if (the_model.entityHooks[idx].onAction) {
                      the_model.entityHooks[idx].onAction(the_model, data); 
                    }           
                  }                
                the_model.change_state('action_executed_successfully');
                if (callback) {
                  callback();
                }                
              },
              error : function(data, textStatus, jqXHR) {
                the_model.lastError = textStatus;
                the_model.change_state('action_executed_error'); 
              },
              complete: function(jqXHR, textStatus) {
                YSDGui.unLockBackground();
              }

            });

    };

    this.bulkAction = function(method, url, callback) { /* Execute the bulk action on the selected items */
 
      var the_form_data = $($('.selectable-entity')[0].form).formParams(true);
      var the_model = this;

      this.change_state('bulk_action');

      YSDGui.lockBackground("#000000", false);

      $.ajax( { url: url,
              data: the_form_data,
              type: method,
              data_type: 'json',
              content_type: 'json',
              success: function(data, textStatus, jqXHR) {
                the_model.synchronizeEntities(data);
                the_model.change_state('bulk_action_executed_successfully');
                if (callback) {
                  callback();
                }                
              },
              error : function(data, textStatus, jqXHR) {
                the_model.lastError = textStatus;
                the_model.change_state('bulk_action_executed_error'); 
              },
              complete: function(jqXHR, textStatus) {
                YSDGui.unLockBackground();
              }              

      });

    };

    this.notifyHooks = function(data) {

      for (var idx=0; idx < this.entityHooks.length; idx++) { // Notify the hooks that the element has been created         
        if (this.entityHooks[idx].onNotify) {
          this.entityHooks[idx].onNotify(data); 
        }           
      }        

    };
  
  }
  
  return EntityModel;
  
});