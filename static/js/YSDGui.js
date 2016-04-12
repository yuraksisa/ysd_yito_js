define(['YSDStyles', 'YSDEvents', 'jquery'], function(YSDStyles, YSDEvents, $){

  var YSDGui = {}
	
  /***
   * Function creates a background in front of all elements
   */
  YSDGui.createBackground = function(color) {

    var backgroundDiv = document.createElement('div');
  
    backgroundDiv.id = 'background';
    backgroundDiv.style.zIndex = 1000;
    backgroundDiv.style.backgroundColor = color;
    backgroundDiv.style.position = 'absolute';
    backgroundDiv.style.top  = 0;
    backgroundDiv.style.left = 0;

    var imgLoading = document.createElement('img');
    imgLoading.id = 'background_loading';
    imgLoading.src = '/img/loadinfo_net.gif';
    backgroundDiv.appendChild(imgLoading);
     
    YSDStyles.size(backgroundDiv, Math.max( window.screen.width || 0, document.width || 0, document.body.clientWidth || 0), Math.max(window.screen.height || 0, document.height || 0, document.body.clientHeight || 0));
    YSDStyles.opacity(backgroundDiv, 50);

    YSDEvents.addEvent(window, 'resize', function() {
  	  YSDStyles.size(backgroundDiv, Math.max( window.screen.width || 0, document.width || 0, document.body.clientWidth || 0), Math.max(window.screen.height || 0, document.height || 0, document.body.clientHeight || 0));
    });
  
    document.body.appendChild(backgroundDiv);

    var docHeight = $(document).height();
    var docWidth = $(document).width();
    $('#background').css({
      "height":docHeight,
      "width":docWidth
    });

    YSDStyles.center(imgLoading);

    return backgroundDiv;
	
  }

  /**
   * Function that blocks the background
   */
  YSDGui.lockBackground = function(color, unlockOnClick) {

    var backDiv = document.getElementById('background');

    if (backDiv) {
      YSDGui.unLockBackground();	
    }

    backDiv = YSDGui.createBackground(color);	
  
    return backDiv;
   
  }

  /**
   * Function that unblocks the background
   */
  YSDGui.unLockBackground = function () {
  
    var backDiv = document.getElementById('background');
  
    if (backDiv) 
    {
       backDiv.parentNode.removeChild(backDiv);
    }	
	
  }

  /**
   * Hide the element 
   */
  YSDGui.hideElement = function(element) {

    YSDStyles.hide(element);	
    YSDGui.unLockBackground();
    $(element).css('position','');
    $(element).removeAttr('top','');
    $(element).removeAttr('left','');
    $(element).removeAttr('z-index','');
	
  }

  /**
   * Show the element in front of all the other elements
   */
  YSDGui.showElement = function(element, unlockOnClick, callback) {

    // Lock the background
    var backDiv = YSDGui.lockBackground( '#000000', unlockOnClick );
    backDiv.style.zIndex = 1000;
  
    YSDEvents.removeEvent(backDiv, 'click', YSDGui.unLockBackground);
 
    if (unlockOnClick) 
    {
      YSDEvents.addEvent(backDiv, 
                 'click', 
                 function() { 
                    YSDGui.hideElement(element);
                    if (callback && typeof callback === 'function') {
                      callback();
                    }
                 } );
    }
 
    // Show the element (centered) 
    YSDStyles.show(element);

    // Center the element on the document
    element.style.zIndex = 1001;
    YSDStyles.center(element);
 
  }
	
  YSDGui.tabs = function(contentSelector, contentTabsSelector) {

      $(contentSelector + " > div").hide(); // Initially hide all content
      $(contentTabsSelector + " li:first").attr("id","current"); // Activate first tab
      $(contentSelector + " > div:first").fadeIn(); // Show first tab content
      $(contentTabsSelector + ' a').click(function(e) {
        e.preventDefault();
        if ($(this).closest("li").attr("id") == "current"){ //detection for current tab
         return;       
        }
        else{             
          $(contentSelector + " > div").hide(); //Hide all content
          $(contentTabsSelector + " li").attr("id",""); //Reset id's
          $(this).parent().attr("id","current"); // Activate this
          $('#' + $(this).attr('name')).fadeIn(); // Show content for current tab
        }
      });

  }

  return YSDGui;	
	
});