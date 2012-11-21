define(['YSDPagerSimpleController', 'YSDPagerPListController', 'YSDPagerSimpleView', 'YSDPagerPListView'],
       function(YSDPagerSimpleController, YSDPagerPListController, YSDPagerSimpleView, YSDPagerPListView) {
	
  PagerFactory = {};

  PagerFactory.getPagerController = function(id) {
    
    var the_class = null;

    switch (id) {

      case 'simple':
        the_class = YSDPagerSimpleController;
        break;

      case 'page_list':
        the_class = YSDPagerPListController;
        break;

      default:
        the_class = YSDPagerSimpleController;
        break;
     
    }

    return the_class;

  }

  PagerFactory.getPagerView = function(id) {

    var the_class = null;

    switch (id) {

      case 'simple':
        the_class = YSDPagerSimpleView;
        break;

      case 'page_list':
        the_class = YSDPagerPListView;
        break;

      default:
        the_class = YSDPagerSimpleView;
        break;
     
    }

    return the_class;


  }

  return PagerFactory;

});