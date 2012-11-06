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
  	
  	this.createEntityButtonClick = function() { /* Create button click */
  	  this.model.create();
  	};
  	
  	this.updateEntityButtonClick = function() { /* Update button click */
  	  this.model.update();
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
  	
  };
  
  return EntityController;
	
	
});