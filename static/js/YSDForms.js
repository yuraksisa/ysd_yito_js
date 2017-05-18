define(['jquery','ysdhtmleditor', 'jquery.placeholder', 'jquery.formparams', 
        'jquery.ui', 'bootstrap', 'jquery.bsAlerts', 'jquery.validate','datejs'], function($, htmlEditor){

  var YsdForms = {};

  YsdForms.improve = function() {

    // activate place holders
    $($('form').find('input[placeholder],textarea[placeholder]')).placeholder();

    // converts into html editor
    htmlEditor('.texteditor');

    // Ajax Submit
    $('form[data-remote="ajax"]').find('input[type="submit"]').bind('click', 
      function() {
         var form = $(this.form)[0];
         YsdForms.submitAjax(form);
         return false;
    });
 
    // Ajax autosubmit
    $('[data-autosubmit="true"]').bind('change', function() {
        var form = this.form;
        YsdForms.submitAjax(form);
    });

    $('.render-to-edit').bind('click', function() {
        var rel = $(this).attr('rel');
        $('.edit[rel="'+rel+'"]').show();
        $('.render[rel="'+rel+'"]').hide();
    });

    YsdForms.appendValidators();
   
  };

  YsdForms.appendValidators = function() {


    // time24
    $.validator.addMethod("time24", function(value, element) {
        if (!/^\d{2}:\d{2}$/.test(value)) {
          return false;
        } 
        var parts = value.split(':');
        if (parseInt(parts[0]) > 23 || parseInt(parts[1]) > 59) {
          return false;
        } 
        return true;
      });    

    // Regular expression
    $.validator.addMethod("regexp",
        function(value, element, regexp) {
           var re = new RegExp(regexp);
           return this.optional(element) || re.test(value);  
        });

    // Max date

    $.validator.addMethod("validDate",
        function(value, element) {
              if (value != '' && Date.parseExact(value,'d/M/yyyy')== null) {
                  return false;
              }
              return true;
        });    
    
    $.validator.addMethod("maxDate",
        function(value, element, maxDate) {
              var date = Date.parseExact(value,'d/M/yyyy');
              if (date != null && date > maxDate) {
                  return false;
              }
              return true;
        });

    $.validator.addMethod("minDate",
        function(value, element, minDate) {
              var date = Date.parseExact(value,'d/M/yyyy');
              if (date!= null && date < minDate) {
                  return false;
              }
              return true;
        });

  };

  YsdForms.submitAjax = function(form) {

    var data = encodeURIComponent(JSON.stringify($(form).formParams(true)));
    var method = $(form).attr('data-remote-method') || form.method;
    
    $.ajax({
            url  : form.action,
            data : data,    
            type : method,
            dataType : 'json',
            contentType : 'application/json; charset=utf-8',
            success : function(data, textStatus, jqXHR) {
              YsdForms.showAlert('done', 'success');
            },
            error : function(data, textStatus, jqXHR) {
              YsdForms.showAlert(textStatus, 'error');
            }
    });

  }

  YsdForms.showAlert = function(message, priority) {
    $(document).trigger("add-alerts", {
       message: message,
       priority: priority
    });
  }

  YsdForms.showModalDialogNotification = function(title, message) {

    $("<div title='" + title + "'>" + message + "</div>").dialog( 
       { height: 250, modal: true,        
         buttons: {
            Ok: function() {
              $( this ).dialog( "close" );
            }
        }
    });       

  }

  /*
   * Limit the text area content size
   * 
   * @param textarea  The element that represents the textarea
   * @param maxlength Max length allowed
   * @param listener  Notify the remain content 
   */
  YsdForms.limit_text_area_content_size = function (textarea, maxlength, listener) {

    // First call to the listener, to notify the original size 
    if (listener) {
  	  listener.call(textarea, maxlength - textarea.value.length);	
    }

    $(textarea).bind('keydown', function(event) {
  	
  	  var content_length = event.target.value.length;
  	  	
  	  // 8.supr 46.backspace 37.left 38.up 39.right 40.down  	
  	  if (content_length == maxlength && (event.keyCode != 8 && event.keyCode != 46 && event.keyCode != 37 && event.keyCode != 38 && event.keyCode != 39 && event.keyCode != 40)) {
  	    return false;	
  	  }
  	
    });

    $(textarea).bind('keyup', function(event) {
  	
  	  // Manage paste from clipboard (remove all the characters above the maxlength allow)
  	  if (event.target.value.length > maxlength)
  	  {
  	    event.target.value = event.target.value.substring(0, maxlength);	
  	  }  
  	
  	  // Notify the listener with the new remainder  	
  	  if (listener) 
  	  {
  	    listener.call(event.target, maxlength - event.target.value.length);	
      }
  	
    });
    
    $(textarea).bind('change', function(event) {
    	
  	  // Notify the listener with the new remainder  	
  	  if (listener) 
  	  {
  	    listener.call(event.target, maxlength - event.target.value.length);	
      }
    	
    });
	
  };

  return YsdForms;
	
});
