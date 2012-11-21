define(function(){

  function YSDPagerPListController() {

    this.model = null;
    this.view = null;

    this.setView = function(view) { /* Sets the view */
      this.view = view;
    }
    
    this.setModel = function(model) { /* Sets the model */
      this.model = model;
    }

    this.buttonNavigatePageClick = function(newPage) { /* The user clicks the navigate button */
      this.model.setCurrentPage(newPage);
    }    


  }

  return YSDPagerPListController;

});