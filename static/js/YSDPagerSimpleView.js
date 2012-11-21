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
      var previousButtonClass = 'form-button pager-navigation-button previous-page-button';
      if (this.model.isFirstPage()) {
        previousButtonClass += ' disabled-form-button';
        previousButton.setAttribute('disabled', 'disabled');
      }
      previousButton.setAttribute('class', previousButtonClass);
      previousButton.setAttribute('name', 'next-page-button');
      previousButton.text = previousButton.innerText = '<';

      var nextButton = document.createElement('button');
      var nextButtonClass = 'form-button pager-navigation-button next-page-button';
      if (this.model.isLastPage()) {
        nextButtonClass += ' disabled-form-button';
        nextButton.setAttribute('disabled', 'disabled');        
      }
      nextButton.setAttribute('class', nextButtonClass);
      nextButton.setAttribute('name', 'next-page-button');
      nextButton.text = nextButton.innerText = '>';

      container.appendChild(previousButton);
      container.appendChild(nextButton);
      
      // Configure the events
      var controller = this.controller;
      
      if (!this.model.isFirstPage()) {
        $(previousButton).bind('click', function(event){
         controller.buttonNavigatePreviousPageClick();
        });
      }
      
      if (!this.model.isLastPage()) {
        $(nextButton).bind('click', function(event){
         controller.buttonNavigateNextPageClick();
        });
      }

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