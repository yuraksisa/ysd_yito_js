define(['jquery'], function($) {
  
  /* ----------------------------------------------------
   * Simple pager view
   *  
   */
  function YSDPagerSimpleView(containerElementId) {
    
    this.containerElementId = containerElementId;

    this.model = null;
    this.controller = null;

    this.setModel = function(model) {
      this.model = model;	
    }

    this.setController = function(controller) {
      this.controller = controller;
    }

    this.createButtons = function() {

      var container = document.getElementById(containerElementId);
           
      // Create the buttons
      var previousButton = document.createElement('button');  
      previousButton.setAttribute('class', 'form-button pager-navigation-button next-page-button');
      previousButton.setAttribute('value', '&gt;');
      previousButton.setAttribute('name', 'next-page-button');

      var nextButton = document.createElement('button');
      nextButton.setAttribute('class', 'form-button pager-navigation-button next-page-button');
      nextButton.setAttribute('value', '&gt;');
      nextButton.setAttribute('name', 'next-page-button');

      container.appendChild(previousButton);
      container.appendChild(nextButton);
      
      // Configure the events
      var controller = this.controller;

      $(previousButton).bind('click', function(event){
         controller.buttonNavigatePreviousPageClick();
      });
      $(nextButton).bind('click', function(event){
         controller.buttonNavigatePreviousPageClick();
      });

    }

    this.configEvents = function() {
      
      var controller = this.controller;

      $('.next-element-button').bind('click', function() {
        controller.buttonNavigateNextPageClick();  
      });

      $('.previous-element-button').bind('click', function() {
        controller.buttonNavigatePreviousPageClick();
      });

    }

    this.configGui = function() {

      if (this.containerElementId) {
        this.createButtons();	
      }
      else {
        this.configEvents();
      }
    }

  }

  return YSDPagerSimpleView;

});