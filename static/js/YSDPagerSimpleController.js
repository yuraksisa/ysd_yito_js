define(function() {
	
  function YSDPagerSimpleController() {

    this.model = null;
    this.view = null;

    this.setView = function(view) { /* Sets the view */
      this.view = view;
    }
    
    this.setModel = function(model) { /* Sets the model */
      this.model = model;
    }

    this.buttonNavigateNextPageClick = function() { /* The user clicks the navigate button */
      this.model.nextPage();
    }

    this.buttonNavigatePreviousPageClick = function() { /* The user clicks the previous page button */
      this.model.previousPage();
    }
  
  }
  
  return YSDPagerSimpleController;

});