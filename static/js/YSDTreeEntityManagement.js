define(['YSDTreeDataModel', 'YSDEntityManagementModel', 'YSDEntityManagementController', 'YSDEntityManagementView', 'ysdtemplate'], 
       function(TreeDataModel, EntityModel, EntityController, EntityView, tmpl){
	
  function YSDTreeEntityManagement(urls, entity, pageSize, entityHooks, configuration) { /* Tree Entity Management constructor */

  	this.controller = new EntityController();
  	this.view       = new YSDTreeEntityView(this.controller);
  	this.model      = new EntityModel(urls, entity, pageSize, this.entityView, entityHooks, new TreeDataModel(), configuration);
  	
  	this.controller.setModel(this.model);
  	this.view.setModel(this.model);
  
    if (this.model.configuration.parentId && this.model.configuration.parentId.length > 0) {
      var parentId = '/' + this.model.configuration.parentId;
      this.model.urls.query_url  += parentId; 
    }
  
    this.configureHooks = function() { /* Set up the manager of the hooks */
      var hooks = this.model.entityHooks;
      var length = hooks.length;
      for (var idx=0;idx<length;idx++) {
        hooks[idx].manager = this;
      }

    }
     
    this.configureHooks();
  
    this.view.init();
  	
  }
	
  /* ---------------------------------------------------
     TreeEntityView
     --------------------------------------------------- */

  function YSDTreeEntityView(entityController) { /* Entity View constructor */
  
     EntityView.apply(this, arguments);
 
     this.renderEntitiesData = function(entities) { 
       
        var elementHtml = '';         
        var level = 0;
        this.index = 0;
             
        for (var idx=0; idx<entities.length; idx++) {
     
          elementHtml += this.renderEntityDataOneItem(entities[idx], level);
       
        }

        return elementHtml;
    
     }  
 
     this.renderEntityDataOneItem = function(entity, level) {
  	
  	   var elementHtml = tmpl('elements_list_template', {'entity':entity, 'level':level, 'index':this.index, 'self':this});
  	   this.index++;
  	  	
  	   if (entity.children.length > 0) {
  		
  	     for (var child in entity.children) {
  	       elementHtml += this.renderEntityDataOneItem(entity.children[child], level+1);
  	     }
  		
  	   }  	  
  	
  	   return elementHtml;
  	
     }
  
  }
  
  YSDTreeEntityView.prototype = new EntityView();
  	
	
  return YSDTreeEntityManagement;	
		
	
});