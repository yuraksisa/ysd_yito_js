define(['YSDArrayDataModel', 'YSDEntityManagementModel', 'YSDEntityManagementController', 'YSDEntityManagementView'], function(ArrayDataModel, EntityModel, EntityController, EntityView) {
	
  /* ------------------------------------------------------------------
     EntityManagement
     ------------------------------------------------------------------
     
     It allows to create a CRUD interface to manage the elements of an
     entity (for example customers, documents, ....), simplifying the
     process of creating an application.
     
     It's a pure jScript library which only uses jQuery and John Resig's
     micro.templating library to render the GUI elements. 

     It's based on the conventions principle over the configuration 
     principle.
     
     It uses a REST API to access the server data
         
     Using it :
     ----------
     
       A. Create your own template file which will hold the management,
          for example contents_management.erb
       
       B. Include the basic structure, which is defined in entity-management.erb
       
          <%= include('entity-management') %>
     
       C. Create the templates to render the GUI :
     
          Each template is a script block with type text/template and the id
          represented
     
          > elements_description         : The module description
          > elements_no_data             : Message when there is no data
          > elements_container_template  : The entities list container
          > elements_list_template       : An entity view (in the list)
          > element_template             : An entity view (alone)
          > element_template_form        : An entity form for editing    
     
       D. Create the hook instance to implement the concrete functionality
     
          var my_hook = {};    
     
          An entity hook allows the following extensions:
   
           USED in the MODEL
           - entityKey(entity)
           - adaptFormData(data)
           
           USED in the VIEW
           - entitySelected(entity)     
           - onRenderEntities(entities) # When the entities have been rendered
           - onRender(entity)           # When the entity has been rendered
           - onNew()
           - onEdit(entity)
           - onCancel()
          
       E. Create an instance of the EntityManagement
                      
         urls = {query_url  : '/my-entities',
    	         create_url : '/my-entity',
  	             update_url : '/my-entity',
  	             delete_url : '/my-entity',
  	             get_url    : '/my-entity'};
         
         var contentsManager = new EntityManagement(urls, 'content', 12, my_hook);
     
     Design notes:
     -------------
     
     It allow two navigation modes:
     
       > page navigation 
       > entity navigation 
       > form 
     
     Buttons (events) :
       
       .previous-page-button
       .next-page-button
       .previous-element-button
       .next-element-button
       .page-navigation
       .reload-entities-button
     
     
     @param [String] entity   
       The entity name         
     
     @param [Numeric] pageSize
       The number of elements which are shown in any page
             
     @param [Array] entityHooks    
       It offers hooks to extend the functionality
     
     @param [Object] configuration
       It allow to set up the behaviour. If the configuration is not supplied, it's retrieved
       from the URL.
       
       configuration has the following attributes:
       
         hold_form_after_action : When the user updates/creates and entity, it holds the form (in edit/new action) 
         parent_filtered        : The entities are filtered by its parent
         
         Other configuration parameters (if not supplied they will be extract from the URL)
         
         url_base               : The base url
         action                 : The action to be performed, that is, list/new/edit/view
         parentId               : The parent identifier (list/new actions)
         id                     : The object identifier (edit/view actions)
         search_params          : A set of attribute name - value with the search configuration

         If we need to setup a custom behaviour, we can pass the configuration, and the URL information
         will be ignored
              
       The ulrs to access the contents are as follows:     

         list      /my-entity
         new       /my-entity/new         
         edit      /my-entity/edit/id
         view      /my-entity/id
              
       If parentFiltered the urls will be the following way
                  
         list      /my-entity/parentId
         new       /my-entity/parentId/new
         edit      /my-entity/parentId/edit/id
         view      /my-entity/parentId/id         
         


     ------------------------------------------------------------------*/
       
  function YSDEntityManagement(urls, entity, pageSize, entityHooks, configuration) { /* Entity Manager constructor */
  	
  	this.controller = new EntityController();
  	this.view       = new EntityView(this.controller);
  	this.model      = new EntityModel(urls, entity, pageSize, this.entityView, entityHooks, new ArrayDataModel(), configuration);
  	
  	this.controller.setModel(this.model);
  	this.view.setModel(this.model);
  
    if (this.model.configuration.parentId && this.model.configuration.parentId.length > 0) {
      var parentId = '/' + this.model.configuration.parentId;
      this.model.urls.query_url  += parentId; 
    }
  
    this.view.init();
       
  };
    
  return YSDEntityManagement;
  
});
