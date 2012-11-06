define(['YSDStyles', 'YSDEvents'], function(YSDStyles, YSDEvents){

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
	
  }

  /**
   * Show the element in front of all the other elements
   */
  YSDGui.showElement = function(element, unlockOnClick) {

    // Lock the background
    var backDiv = YSDGui.lockBackground( '#000000', unlockOnClick );
  
    YSDEvents.removeEvent(backDiv, 'click', YSDGui.unLockBackground);
 
    if (unlockOnClick) 
    {
      YSDEvents.addEvent(backDiv, 
                 'click', 
                 function() { YSDGui.hideElement(element) } );
    }
 
    // Show the element (centered) 
    YSDStyles.show(element);

    // Center the element on the document
    element.style.zIndex = 1001;
    YSDStyles.center(element);
 
  }
	
  return YSDGui;	
	
});