define(['YSDEventTarget'], function(EventTarget) {
	
  function YSDPagerModel(pageSize) {

    this.pageSize = pageSize; /* The page size, the number of elements shown on a page */
    this.total = 0;           /* The total number of elements */
    this.currentPage = 1;     /* The current page */
    
    this.events = new EventTarget(); /* Manages the model events */

    this.view = null;
    this.controller = null;

  	/* ------- Event listeners ---------- */
  	
  	this.addListener = function(type, listener) { /* addListener */
  	  this.events.addEventListener(type, listener);	
  	}
  	
  	this.removeListener = function(type, listener) { /* removeListener */
  	  this.events.removeEventListener(type, listener);  	  
  	}

  	/* ------- Setters ------------------ */

    this.setView = function(view) { /* Sets the view */
      this.view = view;
    }

    this.setController = function(controller) { /* Sets the controller */
      this.controller = controller;
    }

    this.setTotal = function(total) { /* Set the number of elements */
      this.total = total;
    }

    this.setCurrentPage = function(page) { /* Sets the current page */
      
      if (page >= 1 && page <= this.getLastPage()) {
        this.currentPage = currentPage;
        this.events.fireEvent( {type:'navigate', page: this.currentPage});
      }
    
    }

    this.nextPage = function() { /* Go to the next page */ 

      if (this.currentPage < this.getLastPage()) {
        this.setCurrentPage(this.currentPage + 1);
      }

    }

    this.previousPage = function() { /* Go to the previous page */

      if (this.currentPage > 1) {
      	this.setCurrentPage(this.currentPage - 1);
      }

    }

    this.getLastPage = function() { /* Gets the last page number */
      return Math.ceil(this.total / pageSize);
    }

  }


  return YSDPagerModel;	
});