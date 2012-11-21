/* JQuery plugins used: 
     - jqueryui  (dialog)
*/

define(['ysdtemplate', 'jquery', 'ysdhtmleditor', 'jquery.ui', 'datejs'], function(tmpl, $, htmlEditor){
	
  /* ------------------------------------------------------------------
     EntityView
     ------------------------------------------------------------------
     
     @param [EntityController] entityController
       The entity controller
       
     ------------------------------------------------------------------ */
  
  function EntityView(entityController) { /* Entity View constructor */
    
    this.templates = {};
    
    if (document.getElementById('elements_title')) {
      this.templates.tmpl_elements_title = tmpl('elements_title');
    }
    else {
      this.templates.tmpl_elements_title = null;
    }

    if (document.getElementById('elements_description')) {
      this.templates.tmpl_element_description = tmpl('elements_description');	
    }
  
    if (document.getElementById('elements_search')) {
      this.templates.tmpl_elements_search = tmpl('elements_search');
    }
    else
    {
      this.templates.tmpl_elements_search = null;
    }

    if (document.getElementById('elements_no_data')) {
  	  this.templates.tmpl_elements_no_data = tmpl('elements_no_data');
    } 
  
    if (document.getElementById('elements_container_template')) {
      this.templates.tmpl_element_list = tmpl('elements_container_template');
    }
  
    if (document.getElementById('elements_list_template')) {
      this.templates.tmpl_element_in_the_list = tmpl('elements_list_template');
    }
  
    if (document.getElementById('element_template')) {
      this.templates.tmpl_element = tmpl('element_template');
    }
  
    if (document.getElementById('element_template_form')) {
      this.templates.tmpl_element_form = tmpl('element_template_form');
    }
    

    this.navigationAction = null;
    this.controller = entityController;
    
    if (this.controller) {
      this.controller.setView(this);
    }
       
    this.setModel = function(model) { /* Sets the model */
      this.model = model;
      
      var view  = this;	

      this.model.addListener('state_changed', 
          function(event) { 
          	 view.state_changed(event); 
          });
          
      this.model.addListener('entity_selected', 
          function(event) { 
          	 view.renderEntity(event);
          	 // Process the Hooks
             for (var idx=0; idx < view.model.entityHooks.length; idx++) {        	
               if (view.model.entityHooks[idx].entitySelected) {
                 view.model.entityHooks[idx].entitySelected(view.model.currentEntity());	
               }	        	
             }          	   
          });
    };
    
    this.init = function() { /* Initialization */
      
      this.buildGui();
      this.configureEvents();
      this.configureAction();
    
    };
    
    this.configureEvents = function() { /* Configure the events */
      
      var view = this;
      var model = this.model;
      var controller = this.controller;
      
      // Navigation buttons
             
      $('.next-element-button').bind('click', 
        function(event) {
           view.update_status('');	  
      	   view.navigationAction = 'nextElement';     
      	   controller.nextElementButtonClick(); 
      	});
      $('.previous-element-button').bind('click', 
        function(event) { 
           view.update_status('');	
           view.navigationAction = 'previousElement'; 
           controller.previousElementButtonClick(); 
        });
      $('.next-page-button').bind('click', 
        function(event) { 
           view.update_status('');	 
           model.navigationMode = 'page'; 
           view.navigationAction = 'nextPage'; 
           controller.nextPageButtonClick(); 
        });
      $('.previous-page-button').bind('click', 
        function(event) { 
           view.update_status('');	
           model.navigationMode = 'page'; 
           view.navigationAction = 'previousPage'; 
           controller.previousPageButtonClick(); 
        });
      $('.page-navigation').bind('click', function(event) {
      	   view.update_status(''); 
      	   model.navigationMode = 'page'; 
           view.pageMode();
           if (model.configuration.action != 'list') {
       	     model.query();
           }                      
      });
      
      // Reload elements
      $('.reload-entities-button').bind('click',
         function(event) {
           view.update_status('');	
           model.query();
         }
      );
      
      // Remove all elements
      $('.delete-all-entities-button').bind('click',
         function(event) {
           view.update_status('');	
           controller.deleteAllEntitiesButtonClick();
         }
      );
      
      // Crud buttons
      $('.new-entity-button').bind('click',    
         function(event) {
         	view.update_status('<span class="entity-message">New '+ model.entity + ' </span>');  
         	controller.newEntityButtonClick(); 
         }
       );
      
      $('.edit-entity-button').bind('click',   
         function(event) { 
         	view.update_status('<span class="entity-message">Edit '+ model.entity + ' </span>');
         	controller.editEntityButtonClick();
         }
      );
      
      $('.delete-entity-button').bind('click', 
         function(event) { 
         	controller.deleteEntityButtonClick(); 
         }
      );
      
      // Search
      $('.search-entity-button').bind('click',
        function(event) {
           controller.searchButtonClick();	
        });
        
      $('.search-entity-input').bind('keyup',
        function(event) {
           controller.searchInputChange();
        });
      
    };
    
    this.configureAction = function() { /* Configure the action */

      switch (this.model.configuration.action) {
      
        case 'new':
           this.newEntity();
           break;
        
        case 'edit':
           this.model.get();           
           break;
           
        case 'view':
           this.model.get();
           break;
           
        case 'list':
           this.model.query();
           break;	
      	
      }
    	
    }
    
    this.configureElementEvents = function(selector) { /* Configure the element actions */

      var model = this.model;
      var controller = this.controller;
      var view = this;

      var actions_selector = selector || '.element-action-button';
      $(actions_selector).unbind('click');

      $(actions_selector).bind('click',

        function(event) {
      
          var actionMethod = $(event.currentTarget).attr('data-action-method');
          var actionUrl = $(event.currentTarget).attr('data-action-url');

          if (actionMethod && actionUrl) {

            event.preventDefault();

            var confirmMessage = $(event.currentTarget).attr('data-confirm-message');

            if (confirmMessage) {
              view.ask_for_confirmation('Confirm', 
                                        confirmMessage,
                                        function(){                                      
                                          model.action(actionMethod, actionUrl);
                                        });
            } 
            else {
               model.action(actionMethod, actionUrl);
            }
          
            return false;

          }

        }

      );

    }

    this.configureFormEvents = function() { /* Configure the form buttons */
    
      var model = this.model;
      var controller = this.controller;
      var view = this;
    
      $('.create-entity-button').bind('click', 
        function(event) { 
        	event.preventDefault();
        	controller.createEntityButtonClick(event.currentTarget); 
        	return false;
        }
      );
      $('.update-entity-button').bind('click', 
        function(event) { 
        	event.preventDefault();
        	controller.updateEntityButtonClick(event.currentTarget); 
        	return false;
        });
      $('.cancel-entity-button').bind('click', 
        function(event) { 
        	view.update_status('');
        	controller.cancelEntityButtonClick(); 
        });
    
    },
    
    this.state_changed = function(event) { /* State changed */
    	
      switch (event.state) {
      	
        case 'bulk_action_executed': /* bulk actions executed */
           this.renderEntities();
           break;

        case 'error_executing_bulk_action': /* error executing bulk action */
           this.notify_user('Error executing the process', 'Error executing the process');
           break;

        case 'action_executed':
           this.update_status('<span class="entity-message entity-message-ok">action executed successfully</span>');        
           break;

        case 'action_executed_error':
           this.notify_user('Error executing the process', 'Error executing the process');
           break;

      	case 'data_loaded': /* query executed */
      	  this.renderEntities();
 
      	  if (this.model.navigationMode == 'entity') {
      	  	this.model.setEntityIndex((this.navigationAction == 'nextElement')?0:this.model.entitiesCount()-1); 
      	  }
      	  break;  
      	  
      	case 'error_retrieving_data': /* query error */
      	 
      	  this.notify_user('Error retrieving data', 'Server error retrieving data');
      	  break;    	
      	  
      	case 'entity_loaded': /* get executed */
      	
      	  if (this.model.configuration.action == 'edit') {
      	  	this.editEntity(); 
      	  }
      	  else 
      	    if (this.model.configuration.action == 'view') {
      	      this.renderEntity();	
      	    }
      	  break;
      	  
      	case 'error_loading_entity': /* get error */
      	  
      	  this.notify_user('Error loading data', 'Server error loading data');
      	  break;
        
        case 'entity_created': /* entity created  */
          
          this.update_status('<span class="entity-message entity-message-ok">'+ this.model.entity + ' created successfully</span>');
          
          if (this.model.configuration.action == 'new') {
          	
          	  if (destination = this.model.configuration.search_params['destination']) {
          	    this.redirect_destination_or_base();
            	}
              else { 
                if (this.model.configuration.hold_form_after_action) {
                  this.editEntity();
                }
                else {
                  this.newEntity();
                }
              }
          	
          }
          else
            if (this.model.configuration.action == 'list') {
              this.model.forceReload = true;
              this.newEntity();
            }
          
          break; 
          
       case 'error_creating_entity': /* error creating entity */
          
          this.update_status('<span class="entity-message entity-message-error">Error creating '+ this.model.entity + '</span>');         
          this.notify_user('Error creating entity' , 'Server error creating entity');
          break;  
          
       case 'entity_updated': /* entity updated */
          
          this.update_status('<span class="entity-message entity-message-ok">'+ this.model.entity + ' updated successfully</span>');
          
          if (this.model.configuration.action == 'edit') {
            if (destination = this.model.configuration.search_params['destination']) {
          	  this.redirect_destination_or_base();
            }
            else {
              if (!this.model.configuration.hold_form_after_action) {
                this.renderEntity();
              }
            }
          }
          else
            if (this.model.configuration.action == 'list') {
              if (!this.model.configuration.hold_form_after_action) {
                this.renderEntity(this.model.currentEntity());
                this.updateEntityRow(this.model.currentEntity(), this.model.getEntityIndex());
                this.elementMode();
              }              	
            }
      	  break;
      	  
       case 'error_updating_entity': /* error creating entity */
          
          this.update_status('<span class="entity-message entity-message-error">Error updating '+ this.model.entity + '</span>');
          this.notify_user('Error updating entity' , 'Server error updating entity');
          break;       	  
          
       case 'all_entities_deleted': /* All entities deleted */
          this.model.query();
          break;
          
       case 'error_deleting_all_entities': /* Error deleting all entities */
          this.update_status('<span class="entity-message entity-message-error">Error deleting all '+ this.model.entity + '</span>');
          this.notify_user('Error deleting all entities' , 'Server error deleting all entities');          
          break;
          
       case 'entity_deleted' : /* Entity deleted */
          this.model.query();
          break;
          
       case 'error_deleting_entity': /* Error deleting entity */
          this.update_status('<span class="entity-message entity-message-error">Error deleting '+ this.model.entity + '</span>');
          this.notify_user('Error deleting entity' , 'Server error deleting entity');        
          break;   
          
      }
    	
    };
    
    /* -------------- Basic GUI -------------------------------------- */
    
    this.renderEntities = function() { /* Renders all the loaded entities */
    
     var entities = this.model.getEntities();
     
     $('.elements-list').hide();
  
     this.buildEntitiesDescription();
  
     if (entities.length > 0) {
       this.buildEntitiesList(entities);
     }
     else {
       $('.elements-list').html(this.templates.tmpl_elements_no_data({}));	
     }
      
     this.pageMode();
     
     // Process the Hooks
     for (var idx=0; idx < this.model.entityHooks.length; idx++) {        	
       if (this.model.entityHooks[idx].onRenderEntities) {
         this.model.entityHooks[idx].onRenderEntities(entities);	
       }	        	
     }       
       
     $('.elements-list').show();    
     $('.bottom-navigation-bar').show();
        
    };

    this.updateEntityRow = function(entity, element_index) {
  	  	
      var elementHtml = this.templates.tmpl_element_in_the_list( {'entity':entity,'index':element_index, 'self':this} );
  	
  	  $('#element_row_'+element_index).replaceWith(elementHtml);
  	
    };
    
    this.renderEntity = function(event) { /* Render the current entity */

      var entity = this.model.currentEntity();

      var elementContainer = document.getElementById('element-detail');
    
      $(elementContainer).html( this.templates.tmpl_element({'entity':entity,'self':this}) );
       
      this.elementMode();
     
      // Process the Hooks
      for (var idx=0; idx < this.model.entityHooks.length; idx++) {        	
        if (this.model.entityHooks[idx].onRender) {
          this.model.entityHooks[idx].onRender(entity);	
        }	        	
      }       

      $('.bottom-navigation-bar').show();
              
    };
  
    this.newEntity = function() { /* Prepares for create a new entity */
    
      var elementFormContainer = document.getElementById('element-form-detail');
     
      $(elementFormContainer).html( this.templates.tmpl_element_form({'entity':null,'self':this}));
      
      this.formElementMode();

      // Process the Hooks
      for (var idx=0; idx < this.model.entityHooks.length; idx++) {        	
        if (this.model.entityHooks[idx].onNew) {
          this.model.entityHooks[idx].onNew();	
        }	        	
      }       
        
    };
    
    this.editEntity = function() { /* Prepares for edit a new entity */
    
      var entity = this.model.currentEntity();
     
      var elementFormContainer = document.getElementById('element-form-detail');
     
      $(elementFormContainer).html( this.templates.tmpl_element_form({'entity':entity,'self':this}) );
      
      this.formElementMode();

      // Process the Hooks
      for (var idx=0; idx < this.model.entityHooks.length; idx++) {        	
        if (this.model.entityHooks[idx].onEdit) {
          this.model.entityHooks[idx].onEdit(entity);	
        }	        	
      }      
      
               
    };
  
    this.cancelEntity = function() { /* Cancels the entity edition */
    
      if (this.model.configuration.action == 'new' || this.model.configuration.action == 'edit') {

        if (destination = this.model.configuration.search_params['destination']) {
        	this.redirect_destination_or_base(); 
        }
      
      }
      else
        if (this.model.configuration.action == 'list') {    
        	
           if (this.model.navigationMode == 'page') {
             this.pageMode();	
           }
           else {
             this.elementMode();
           }         

           // Process the Hooks
           for (var idx=0; idx < this.model.entityHooks.length; idx++) {        	
             if (this.model.entityHooks[idx].onCancel) {
               this.model.entityHooks[idx].onCancel();	
             }	        	
           } 
          
          if (this.model.forceReload) {
            this.model.forceReload = false;
            this.model.query();	
          }
        }
       
    }
    
    /* ---------- Render entities ---------------------- */
    
    this.buildGui = function() { /* Renders the basic Gui */

      this.buildEntitiesTitle();
      this.buildEntitiesDescription();
      this.buildEntitiesSearch();

    }

    this.buildEntitiesTitle = function() { /* Renders the title */

      if (this.templates.tmpl_elements_title) {

         var titleContainer = $('.elements-title');
         var titleHtml = this.templates.tmpl_elements_title;
         $(titleContainer).html(titleHtml);

      }

    }

    this.buildEntitiesSearch = function() { /* Renders the search */

      if (this.templates.tmpl_elements_search) {

         var searchContainer = $('.elements-search');
         var searchHtml = this.templates.tmpl_elements_search;
         $(searchContainer).html(searchHtml);

         // Process the Hooks
         for (var idx=0; idx < this.model.entityHooks.length; idx++) {          
           if (this.model.entityHooks[idx].onRenderSearch) {
             this.model.entityHooks[idx].onRenderSearch();  
           }            
         }             

      }


    }

    this.buildEntitiesDescription = function() { /* Renders the description */
  
      if (this.templates.tmpl_element_description) {
  
        var descriptionContainer = $('.elements-description')[0];
        var descriptionHtml = this.templates.tmpl_element_description;
        $(descriptionContainer).html(descriptionHtml);	
  	
      }
    
    }
  
    this.buildEntitiesList = function(entities) { /* Renders the entities list */
        // Render the structure
      var elementContainer = $('.elements-list')[0];
      var listStructureHtml = this.templates.tmpl_element_list({});
      $(elementContainer).html(listStructureHtml);
     
      // Render the elements
      var elementsContainer = document.getElementById('elements_tbody');      
      var elementHtml = this.renderEntitiesData(entities);
      
      $(elementsContainer).html(elementHtml);
                  
      var view = this;
      var controller = this.controller;
                  
      $('.element-navigation-detail').bind('click',
               function() {               	  
               	  view.update_status('');
               	  controller.showEntityDetail(new Number($(this).attr('rel')));
               });            	  	
    }
    

    this.renderEntitiesData = function(entities) {

       var elementHtml = '';
            
       for (var element_index in entities) {      	
         elementHtml += this.templates.tmpl_element_in_the_list( {'entity':entities[element_index],'index':element_index, 'self':this});      	
       }
  	
  	   return elementHtml;
  	
    }
    
  
    /* ----------- Navigation modes -------------------- */
    
    this.pageMode = function() { /* Page Mode (show the list) */
       
       $('.element-form-container').hide();
       $('.element-container').hide(); 
       $('.elements-container').show(); 
     
       this.navigationBar();
    	
    };
        
    this.elementMode = function() { /* Element Mode (show the element) */
       
       $('.element-form-container').hide();	
       $('.elements-container').hide();
       $('.element-container').show();
       
       this.configureElementEvents();
       this.navigationBar();    	
    	
    };

    this.formElementMode = function() { /* Form Element Mode (edit/create new entity) */	
       $('.elements-container').hide();
       $('.element-container').hide();    
       $('.element-form-container').show();
       
       this.configureFormEvents();
       this.configureElementEvents();
       htmlEditor('.texteditor'); // Converts the editor into HTML editors
    };

    this.isPageMode = function() {
       return $('.elements-container').is(':visible');
    }

    this.isFormElementMode = function() {
      return $('.element-form-container').is(':visible');
    }

    /* ------------------------------------------------ */
    
    this.navigationBar = function() { /* Shows or hides the navigation bar */

       if (this.model.entitiesCount() > 0) {
         $('.elements-summary').html(this.model.summaryMessage());
         $('.navigation-bar-nav-buttons').show();
       }
       else {
         $('.navigation-bar-nav-buttons').hide();
       }
  	
    }
    
  
    /* ------------------------------------------------ */
  
    this.redirect_destination_or_base = function() {
    	
        if (destination = this.model.configuration.search_params['destination']) {
          window.location.href = destination;
        }
        else {
          window.location.href = this.model.configuration.url_base;
        }
            	
    }
    
    /* --------------- Notifications ----------------- */
    
  	this.notify_user = function(title, message) { /* Notifies a POPUP message to the user */
  		
        $("<div title='" + title + "'>" + message + "</div>").dialog( { height: 250, modal: true,     	 
       	        buttons: {
       	            Ok: function() 
       	            {
				   	  $( this ).dialog( "close" );
				    }
				}
           	  });   	 	
  		
  	}    
  	
  	this.ask_for_confirmation = function(title, message, callback) { /* Asks for confirmation */
  	
  	    var response = false;
  	
        $("<div title='" + title + "'>" + message + "</div>").dialog( { height: 160, modal: true,     	 
       	        buttons: {
       	          Ok: function() {
				     response = true;
				     $( this ).dialog( "close" );
				  },
				  Cancel: function() {
				     response = false;	
				     $( this ).dialog( "close" );
				  }
				},
				close : function(event, ui) {								    

                  if (response) {
                    callback();	
                  }
				  
				}
           	  }); 

  	
  	}
  	
  	this.update_status = function(title) { /* Update the status */
    	
    	$('.entity-status-bar').html(title);
    		
  	}
  	
  	/* ---- formatters ---- */
  	
  	this.formatDate = function(the_date, format) {
  			
  	  if (typeof format == 'undefined') {
  	    format = 'dd.MM.yyyy HH:mm';	
  	  }	
  		
      if (the_date instanceof Date) {
        return the_date.toString(format);	
      }
  	  else	
        if (!isNaN(new Date(the_date))) { 
          return new Date(the_date).toString(format);
        }
        else 
        {
          return '';	
        } 	
  		
  	}
  
    this.formatCurrency = function(the_currency, format) {
    	
    	
    }
  
  };

  return EntityView;	
	
});