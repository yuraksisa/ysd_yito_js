define(function(){

  var YSDStyles = {};
  	
  /**
   * Sets the element opacity
   * @param element
   * @param value
   */
  YSDStyles.opacity = function(element, value) {
	
    element.style.opacity = value / 100;
    element.style.filter = 'alpha(opacity='+value+')';	
	
  }

  /**
   * Resize the element to the dimensions
   * @param element The element to be resized
   * @param width The width
   * @param height The height
   */
  YSDStyles.size = function(element, width, height) {
    element.style.width = width +'px';
    element.style.height =height + 'px';	
  }

  /**
   * Hide an element
   *
   * @param element The element to hide
   */
  YSDStyles.hide = function(element) {
    element.style.display = 'none';	
  }

  /**
   * Show an elementhttps://github.com/jquerytools/jquerytools/tree/master/lib
   *
   * @param element The element to show
   */
  YSDStyles.show = function(element) {
    element.style.display = 'block';	
  }

  /**
   * Center the element on the document
   */
  YSDStyles.center = function(element) {
	
    element.style.position = 'fixed';
  
    var the_height = window.innerHeight || Math.min(document.body.clientHeight, window.screen.height);
    var the_width = window.innerWidth || Math.min(document.body.clientWidth, window.screen.width);
  
    element.style.top  = new Number(Math.max((the_height - element.clientHeight) / 2, 20)).toFixed(0) + 'px'; 	
    element.style.left = new Number(Math.max((the_width - element.clientWidth) / 2,10)).toFixed(0)+ 'px';
  	
  }

  /**
   * Center the element in its container
   */
  YSDStyles.centerAbsolute = function(element, topAdjust, leftAdjust) {
    
    element.style.position = 'absolute';

    var the_height = document.body.clientHeight; /*window.innerHeight ||  Math.min(document.body.clientHeight, window.screen.height);*/
    var the_width = document.body.clientWidth; /*window.innerWidth || Math.min(document.body.clientWidth, window.screen.width);*/
  
    element.style.top  = new Number(Math.max((the_height - element.clientHeight - topAdjust*2) / 2, 20)).toFixed(0) + 'px';   
    element.style.left = new Number(Math.max((the_width - element.clientWidth - leftAdjust*2) / 2,10)).toFixed(0)+ 'px';    

  }

  /**
   * Center container
   */ 
  YSDStyles.center_container = function(element) {

    element.style.marginTop  = new Number((element.parentNode.clientHeight-element.clientHeight) / 2).toFixed(0) + 'px'; 
    element.style.marginLeft = new Number((element.parentNode.clientWidth-element.clientWidth) / 2).toFixed(0) + 'px';	
	
  }
	
  return YSDStyles;	
	
});