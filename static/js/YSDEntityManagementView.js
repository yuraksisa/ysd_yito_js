/* JQuery plugins used: 
     - jqueryui  (dialog)
*/

define(['ysdtemplate', 'YSDStyles', 'YSDGui', 'YSDForms', 'jquery', 'ysdhtmleditor', 
        'jquery.ui', 'datejs', 'bootstrap', 'jquery.bsAlerts'], function(tmpl, YSDStyles, YSDGui, YsdForms, $, 
        htmlEditor){
	
  /* ------------------------------------------------------------------
     EntityView
     ------------------------------------------------------------------
     
     @param [EntityController] entityController
       The entity controller
       
     ------------------------------------------------------------------ */
  
  function EntityView(entityController) { /* Entity View constructor */
    
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
          	 view.editEntity();       	   
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
           if (model.configuration.action != 'list' || model.forceReload) {
       	     model.forceReload = false;
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
         	view.update_status('<div class="entity-message">New '+ model.entity + ' </div>');  
         	controller.newEntityButtonClick(); 
         }
       );
      
      $('.edit-entity-button').bind('click',   
         function(event) { 
           this.update_status('<div class="entity-message">Edit '+ this.model.entity + ' </div>');
           this.controller.editEntityButtonClick();
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

    this.configureBackLink = function() { /* Configure the back button */

      if (this.model.configuration.search_params['destination']) {
        $('#back').attr('href', this.model.configuration.search_params['destination']);
        $('.back-bar').show();
      }
      else {
        $('.back-bar').hide();
      }

    }

    this.configureTabs = function() { /* Configure the tabs */

      // Tabs above (vertical tabs)
      $('#tabs_above').tabs().addClass('ui-tabs-vertical ui-helper-clearfix');
      $('#tabs_above li').removeClass('ui-corner-top').addClass('ui-corner-left');
      
      if ($('#tabs_above ul').children().length) {
        
        if ($('#tabs_above ul').children().length == 1) {
          $('#tabs_above ul').hide();
          $('#tabs_above .ui-tabs-panel').css('width', 'auto');
          $('#tabs_above .ui-tabs-panel').css('float', 'none');
          $('#tabs_above .ui-tabs-panel').css('padding', '0');
          $('#tabs_above .ui-tabs-panel').css('border', 'none');
        }

        $('#tabs_above').show();

      }

      // Tabs below
      $('#tabs').tabs();

      if ($('#tabs ul').children().length) {

        if ($('#tabs ul').children().length == 1) {
          $('#tabs ul').hide();
        }

        $('#show_tabs').show();
  
        $('#show_tabs').toggle(function() {
           $('#tabs').show();
        }, function() {
           $('#tabs').hide();
        });
      }
      else {
        $('#show_tabs').hide();
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
           this.update_status('<div class="entity-message entity-message-ok">action executed successfully</div>');
           this.updateCurrentEntity();        
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
      	  this.editEntity();
      	  break;
      	  
      	case 'error_loading_entity': /* get error */
      	  
      	  this.notify_user('Error loading data', 'Server error loading data');
      	  break;
        
        case 'entity_created': /* entity created  */
          this.check_hide_inline('new');
          this.update_status('<div class="entity-message entity-message-ok">'+ this.model.entity + ' created successfully</div>');
          
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
              if (this.model.configuration.hold_form_after_action) {
                this.editEntity();
              }
              else {
                this.newEntity();
              }
            }
          
          break; 
          
       case 'entity_updated': /* entity updated */
          this.check_hide_inline('edit');
          this.update_status('<div class="entity-message entity-message-ok">'+ this.model.entity + ' updated successfully</div>');
          
          if (this.model.configuration.action == 'edit') {
            if (!this.model.configuration.hold_form_after_action) {
              if (destination = this.model.configuration.search_params['destination']) {
          	    this.redirect_destination_or_base();
                break;
              }
            }
          }
          else
            if (this.model.configuration.action == 'list') {
              if (!this.model.configuration.hold_form_after_action) {
                this.updateEntityRow(this.model.currentEntity(), this.model.getEntityIndex());
                this.pageMode();
                break;
              }              	
            }
          this.updateCurrentEntity();  
      	  break;
      	  
       case 'error_creating_entity': /* error creating entity */
          this.check_hide_inline('new');
          this.update_status('<div class="entity-message entity-message-error">Error creating '+ this.model.entity + '</div>');         
          this.notify_user('Error creating entity' , 'Server error creating entity');
          break;  

       case 'error_updating_entity': /* error updating entity */
          this.check_hide_inline('edit');
          this.update_status('<div class="entity-message entity-message-error">Error updating '+ this.model.entity + '</div>');
          this.notify_user('Error updating entity' , 'Server error updating entity');
          break;       	  
          
       case 'all_entities_deleted': /* All entities deleted */
          this.model.query();
          break;
          
       case 'error_deleting_all_entities': /* Error deleting all entities */
          this.update_status('<div class="entity-message entity-message-error">Error deleting all '+ this.model.entity + '</div>');
          this.notify_user('Error deleting all entities' , 'Server error deleting all entities');          
          break;
          
       case 'entity_deleted' : /* Entity deleted */
          this.model.query();
          break;
          
       case 'error_deleting_entity': /* Error deleting entity */
          this.update_status('<div class="entity-message entity-message-error">Error deleting '+ this.model.entity + '</div>');
          this.notify_user('Error deleting entity' , 'Server error deleting entity');        
          break;   
          
      }
    	
    };
    
    this.check_hide_inline = function(action) {

       var inline = (action == 'new' && this.model.configuration.newInline) ||
                    (action == 'edit' && this.model.configuration.editInline);

       if (inline) {
         YSDGui.hideElement($('.element-form-container')[0]);
         $('.element-form-container .top-navigation-bar').show();
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
       $('.elements-list').html(tmpl('elements_no_data', {}));	
     }
      
     this.pageMode();
     
     var self = this;
     $('.element-row-selector').bind('click',
               function() {                   
                 var index = new Number($(this).attr('rel'));
                 self.model.setEntityIndex(index);
                 //self.editEntity();
               });   

     // Process the Hooks
     for (var idx=0; idx < this.model.entityHooks.length; idx++) {        	
       if (this.model.entityHooks[idx].onRenderEntities) {
         this.model.entityHooks[idx].onRenderEntities(entities);	
       }	        	
     }       

    };
      
    this.newEntity = function() { /* Prepares for create a new entity */
     
      $("#element-form-detail").html(tmpl('element_template_form', {'entity':null,'self':this}));
      
      this.formElementMode('new');

      // Process the Hooks
      for (var idx=0; idx < this.model.entityHooks.length; idx++) {        	
        if (this.model.entityHooks[idx].onNew) {
          this.model.entityHooks[idx].onNew();	
        }	        	
      }       
        
    };
    
    this.editEntity = function() { /* Prepares for edit a new entity */
    
      var entity = this.model.currentEntity();
     
      $("#element-form-detail").html(tmpl('element_template_form', {'entity':entity,'self':this}) );
      
      this.formElementMode('edit');

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
    
    /* ----------- Update entity ----------------------- */

    this.updateCurrentEntity = function() {

      var entity = this.model.currentEntity();
     
      $("#element-form-detail").html(tmpl('element_template_form', {'entity':entity,'self':this}) );
      
      this.formElementMode('edit');

      // Process the Hooks
      for (var idx=0; idx < this.model.entityHooks.length; idx++) {         
        if (this.model.entityHooks[idx].onEdit) {
          this.model.entityHooks[idx].onEdit(entity); 
        }           
      }    

      this.updateEntityRow(entity, this.model.getEntityIndex());

    }

    this.updateEntityRow = function(entity, element_index) {

      var elementHtml = tmpl('elements_list_template', {'entity':entity,'index':element_index, 'self':this} );
    
      var elementId = '#element_row_' + element_index;
      $(elementId).replaceWith(elementHtml);    

      // Reactivate the navigation detail
      var controller = this.controller;
      var navigationDetail = elementId + '.element-navigation-detail, ' + elementId + '.element-navigation-detail';
      $(navigationDetail).bind('click',
               function() {    
                  controller.showEntityDetail(new Number($(this).attr('rel')));               
               }); 

    };

    /* ---------- Render entities ---------------------- */
    
    this.buildGui = function() { /* Renders the basic Gui */

      this.buildEntitiesTitle();
      this.buildEntitiesDescription();
      this.buildEntitiesSearch();

    }

    this.buildEntitiesTitle = function() { /* Renders the title */

      if (document.getElementById('elements_title')) {

         var titleContainer = $('.elements-title');
         var titleHtml = tmpl('elements_title');
         $(titleContainer).html(titleHtml);

      }

    }

    this.buildEntitiesSearch = function() { /* Renders the search */

      if (document.getElementById('elements_search')) {

         var searchContainer = $('.elements-search');
         var searchHtml = tmpl('elements_search');
         $(searchContainer).html(searchHtml);

         // Process the Hooks
         for (var idx=0; idx < this.model.entityHooks.length; idx++) {          
           if (this.model.entityHooks[idx].onRenderSearch) {
             this.model.entityHooks[idx].onRenderSearch();  
           }            
         }

         searchContainer.show();             

      }

      if (document.getElementById('advanced_search')) {

         var advancedSearchContainer = $('.advanced-search-container');
         var advancedSearch = $('.advanced-search');
         var advancedSearchHtml = tmpl('advanced_search');
         $(advancedSearch).html(advancedSearchHtml);

         // Process the Hooks
         for (var idx=0; idx < this.model.entityHooks.length; idx++) {          
           if (this.model.entityHooks[idx].onRenderAdvancedSearch) {
             this.model.entityHooks[idx].onRenderAdvancedSearch();  
           }            
         }

         advancedSearchContainer.show();        

      }


    }

    this.buildEntitiesDescription = function() { /* Renders the description */
  
      if (document.getElementById('elements_description')) {
  
        var descriptionContainer = $('.elements-description')[0];
        var descriptionHtml = tmpl('elements_description');
        $(descriptionContainer).html(descriptionHtml);	
  	
      }
    
    }
  
    this.buildEntitiesList = function(entities) { /* Renders the entities list */
        // Render the structure
      var elementContainer = $('.elements-list')[0];
      var listStructureHtml = tmpl('elements_container_template', {});
      $(elementContainer).html(listStructureHtml);
     
      // Render the elements
      var elementsContainer = document.getElementById('elements_tbody');      
      var elementHtml = this.renderEntitiesData(entities);
      
      $(elementsContainer).html(elementHtml);
                  
      var view = this;
      var controller = this.controller;
                  
      $('.element-navigation-detail').bind('click',
               function() {    
                  controller.showEntityDetail(new Number($(this).attr('rel')));           	  
               });            	  	
    }
    

    this.renderEntitiesData = function(entities) {

       var elementHtml = '';
            
       for (var element_index in entities) {      	
         elementHtml += tmpl('elements_list_template', {'entity':entities[element_index],'index':element_index, 'self':this});      	
       }
  	
  	   return elementHtml;
  	
    }
    
  
    /* ----------- Navigation modes -------------------- */
    
    this.pageMode = function() { /* Page Mode (show the list) */
       
       $('.element-form-container').hide();
       $('.element-container').hide(); 
       $('.elements-container').show(); 
       
       $('.element_actions').hide();
       $('.elements_actions').show();
     
       $('.elements-list').show();    
       $('.top-navigation-bar').show();
       $('.bottom-navigation-bar').show();     

       this.navigationBar('.elements-container');
    	
    };
        
    this.elementMode = function() { /* Element Mode (show the element) */
       
       $('.element-form-container').hide();	
       $('.elements-container').hide();
       $('.element-container').show();

       $('.element_actions').hide();
       $('.elements_actions').hide();
       
       this.configureElementEvents();
       this.navigationBar('.element-container');    	
    	
    };

    this.formElementMode = function(action) { /* Form Element Mode (edit/create new entity) */	
       
       var inline = (action == 'new' && this.model.configuration.newInline) ||
                    (action == 'edit' && this.model.configuration.editInline);

       if (inline) {
         $('.element-form-container .top-navigation-bar').hide();
         var self = this;
         YSDGui.showElement($('.element-form-container')[0], true, function() {
           self.cancelEntity();
         });
       }
       else {
         $('.elements-container').hide();
         $('.elements_actions').hide();
         $('.element-container').hide();    
         $('.element-form-container').show();
         if (this.model.configuration.action != 'list') {
           this.configureBackLink();
         }        
         if (action == 'new') {
           $('.element_actions').hide();
         } 
         else {
           $('.element_actions').show();
         }
         this.navigationBar('.element-form-container');
       }
      
       this.configureFormEvents();
       this.configureElementEvents();
       
       // Configure the form elements
       this.configureTabs();      // Tabs
       htmlEditor('.texteditor'); // HTML editor
       $('.alert-box').bsAlerts();
    };

    this.isPageMode = function() {
       return $('.elements-container').is(':visible');
    }

    this.isFormElementMode = function() {
      return $('.element-form-container').is(':visible');
    }

    /* ------------------------------------------------ */
    
    this.navigationBar = function(container) { /* Configure the navigation bar */

       if (this.model.entitiesCount() > 0) {
         $('.elements-summary').html(this.model.summaryMessage());
         $('.navigation-bar-nav-buttons').show();
       }
       else {
         $('.navigation-bar-nav-buttons').hide();
       }
  	  
      var barSelector = container + ' .top-navigation-bar';
      var topPosition = $(barSelector).offset().top;

      $(window).scroll(function(){
          if ($(this).scrollTop() > topPosition ) {
             var barWidth = parseInt($('.entity-management').css('width').replace('px','')) - 
                         parseInt($('.top-navigation-bar').css('padding-left').replace('px','')) - 
                         parseInt($('.top-navigation-bar').css('padding-right').replace('px',''));
             $(barSelector).css('width', new String(barWidth) + 'px');
             $(barSelector).css('position','fixed');
             $(barSelector).css('top','0px');
          }
          else {
             $(barSelector).css('position','static');
             $(barSelector).css('width', 'auto');
          }
        });

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
  		
      /*
        $("<div title='" + title + "'>" + message + "</div>").dialog( { height: 250, modal: true,     	 
       	        buttons: {
       	            Ok: function() 
       	            {
				   	  $( this ).dialog( "close" );
				    }
				}
           	  });   	 	
  		*/

      YsdForms.showAlert(message, 'error');

  	}    
  	
  	this.ask_for_confirmation = function(title, message, callback) { /* Asks for confirmation */
  	
  	    var response = false;
  	
        $("<div title='" + title + "'>" + message + "</div>").dialog( { height: 250, modal: true,     	 
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