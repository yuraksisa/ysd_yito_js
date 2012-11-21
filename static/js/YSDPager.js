define(['YSDPagerModel'], function(PagerModel) {
  
  /***************************************
   * The pager
   */
  function YSDPager(pageSize, currentPage, totalRecords, pagerController, pagerView) {

     this.model = new PagerModel(pageSize, currentPage, totalRecords);
     this.controller = pagerController;
     this.view = pagerView;

     this.model.setView(this.view);
     this.model.setController(this.controller);
     
     this.controller.setModel(this.model);
     this.controller.setView(this.view);  

     this.view.setModel(this.model);
     this.view.setController(this.controller);

     this.addListener = function(type, listener) {
       this.model.addListener(type, listener);
     }

     this.removeListener = function(type, listener) {
       this.model.removeListener(type, listener);
     }

     // Configure the view
     this.view.configGui();

  }

  return YSDPager;

});