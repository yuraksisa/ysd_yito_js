define(['jquery'], function($) {
  
  /* ------------------------------------------
   * Pager list view
   *
   */
  function YSDPagerPListView(containerElementId, numberOfPages) {
  
    this.containerElementId = containerElementId; 
    this.numberOfPages = numberOfPages || 10;
  
    this.model = null;
    this.controller = null;

    this.setModel = function(model) {
      this.model = model;	
    }

    this.setController = function(controller) {
      this.controller = controller;
    }

    this.createButtons = function() {
      
      var buttonsSelector = '#' + this.containerElementId + ' .pager-navigation-button';
      var container = this.getContainer();
      
      $(container).empty();
      $(buttonsSelector).unbind('click');
     
      // Create the buttons
      var firstBlockPage = Math.max(this.model.currentPage - 2, 1);
      var lastBlockPage  = Math.min(this.model.currentPage + this.numberOfPages, this.model.getLastPage());

      for (var idx=firstBlockPage; idx<= lastBlockPage; idx++) {
        
        var button = document.createElement('button');
        var buttonClass = 'form-button pager-navigation-button'
        if (this.model.currentPage == idx) {
          buttonClass += ' current-page-button'
        }

        button.setAttribute('class', buttonClass);
        button.setAttribute('rel', idx);
        button.setAttribute('value', idx);
        button.setAttribute('name', 'navigation_button_' + idx);
        button.text = button.innerText = idx;

        container.appendChild(button);

      } 

      // Configure the events
      var controller = this.controller;
      $(buttonsSelector).bind('click', function(event){
         controller.buttonNavigatePageClick(new Number(event.currentTarget.getAttribute('rel')));
      });

    }

    this.getContainer = function() { /* Get the container */

      if (!this.container) {
      	this.container = document.getElementById(containerElementId);
      }
      
      return this.container;
 
    }

    this.configGui = function() { /* Configure the Gui */  
  
      this.createButtons();

    }

  }

  return YSDPagerPListView;

});