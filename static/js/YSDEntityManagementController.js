define(function(){
	
	
  /* ------------------------------------------------------------------
     EntityController
     ------------------------------------------------------------------ */  
  
  function EntityController() { /* It represents the controller */
  	
  	this.setModel = function(entityModel) { /* Sets the model */
  	  this.model = entityModel;
  	};
  	
  	this.setView = function(entityView) { /* Sets the view */
  	  this.view = entityView;
  	};
  	
  	/* ========= Element detail ================= */
  	
  	this.showEntityDetail = function(entityIndex) {
  	  this.model.setEntityIndex(entityIndex);
  	};
  	
  	/* ========= Navigation buttons ============= */
  	
  	this.nextPageButtonClick = function() { /* Next page (navigation) button click */
  	  this.model.nextPage(); 
  	};
  	
  	this.previousPageButtonClick = function() { /* Previous page (navigation) button click */
  	  this.model.previousPage();
  	};
  	
  	this.nextElementButtonClick = function() { /* Next element (navigation) button click */
  	  this.model.nextElement();
  	};
  	
  	this.previousElementButtonClick = function() { /* Previous element (navigation) button click */
  	  this.model.previousElement();
  	};
  	
  	/* ============= CRUD buttons =============== */
  	  	
  	this.newEntityButtonClick = function() { /* New button click */
  	  this.view.newEntity();		
  	};
  	
  	this.editEntityButtonClick = function() { /* Edit button click */
  	  this.view.editEntity();
  	};
  	
  	this.createEntityButtonClick = function(target) { /* Create button click */
      var createUrl = $(target).attr('data-create-url');
  	  this.model.create(createUrl);
  	};
  	
  	this.updateEntityButtonClick = function(target) { /* Update button click */
      var updateUrl = $(target).attr('data-update-url');
  	  this.model.update(updateUrl);
  	};
  	
  	this.cancelEntityButtonClick = function() { /* Cancel creation/update process click */
  	  this.view.cancelEntity();
  	};
  	
  	this.deleteEntityButtonClick = function() { /* Delete button click */
  	  var model = this.model;
  	  this.view.ask_for_confirmation('Delete entity', 
  	                                 'Are you sure you want to delete this entity? This process can not be undone.',
  	                                 function(){
  	                                 	model.delete();
  	                                 });
  	};
  	
  	this.deleteAllEntitiesButtonClick = function() { /* Delete all entities click */
  	  var model = this.model;
  	  
  	  this.view.ask_for_confirmation('Delete all entities', 
  	                                 'Are you sure you want to delete all entities? This process can not be undone.', 
  	                                 function(){
  	                                 	model.deleteAll();
  	                                 });
  	};
  	
  	/* ----------- Searching ---------------- */
  	
  	this.searchButtonClick = function() { /* Search */
  	
      var search_data = $($('.search-entity-button')[0].form).formParams(true);

      // Pre-process the data before be sent to the backend (Hooks)     
      for (var idx=0; idx < this.model.entityHooks.length; idx++) {         
        if (this.model.entityHooks[idx].adaptSearchFormData) {
          search_data = this.model.entityHooks[idx].adaptSearchFormData(search_data); 
        }           
      }

      this.model.query(search_data);  	

    }
  	
  	this.searchInputChange = function() { /* Search */
  	  this.model.query();
  	}
  	
  };
  
  return EntityController;
	
	
});