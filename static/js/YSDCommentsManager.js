define(['YSDEventTarget', 'YSDGui', 'YSDForms', 'ysdtemplate', 'jquery', 'YSDPager','YSDPagerFactory', 'YSDjson2', 'datejs', 'time', 'jquery.formparams', 'jquery.validate', 'jquery.ui'],
       function(YSDEventTarget, YSDGui, YSDForms, tmpl, $, Pager, PagerFactory){
	
  YSDCommentsManager = function(comment_set_id, pageSize, pager) {
  	
  	this.model = new YSDCommentsModel(comment_set_id, pageSize);
  	this.controller = new YSDCommentsController(this.model);
  	this.view = new YSDCommentsView(this.model, this.controller, pager);
  	this.model.view = this.view;

  	this.view.render();
  	
  }
  
  YSDCommentsModel = function(comment_set_id, pageSize) { /* The Model */
  	
  	this.state = 'none';
  	this.comment_set_id = comment_set_id;
  	this.comments = [];
  	this.total = 0;
    this.pageSize = pageSize || 10;
    this.currentPage = 1; /* The current page */
  	this.events = new YSDEventTarget(); 
    this.view = null;

  	/* ------- Event listeners ---------- */
  	
  	this.addListener = function(type, listener) { /* addListener */
  	  this.events.addEventListener(type, listener);	
  	}
  	
  	this.removeListener = function(type, listener) { /* removeListener */
  	  this.events.removeEventListener(type, listener);  	  
  	}
  	
  	/* -------- Business methods ---------- */
  	
  	this.retrieve_comments = function(page) {
  	   
       this.currentPage = page || 1;

  	   if (this.comment_set_id == null) {
  	   	 return;
  	   }	
  		
  	   var self = this;
  		 var url = '/api/comments/' + this.comment_set_id + '/page/' + this.currentPage;
  		
  	   $.ajax({
  	   	       type: 'GET',
  	   	       url : url,
  		         dataType : 'json',
  		         contentType: 'json',
  		         cache: false,
  	   	       success: function(data, statusText, jqXHR) {
  	   	       	  console.log(data);
  	   	          self.comments = data.data;
  	   	          self.total = data.total;
  	   	          self.change_state('comments_retrieved_success');     	
  	   	       },
  	   	       error: function(data, statusText, jqXHR) {
  	   	       	  self.change_state('comments_retrieved_error');
  	   	       },
  	           complete : function(jqXHR, textStatus) {
  	              // none
  	          }
  	   });
  		
  	}
  	
  	this.post_comment = function(message) {

      if (!$($('.post-button')[0].form).valid()) {
        this.view.notify_user('Validation errors', 'Check the form. There are errors');
        return; 
      }

  	  delete message['post'];
  	   
  	  var self = this;
  	  
  	  if (message.comment_set.id == '') {
  	    delete message.comment_set.id;	
  	  }
  	    
  	  var json_request = encodeURIComponent(JSON.stringify(message));
  		
      YSDGui.lockBackground("#000000", false);
  		
  		$.ajax( {
  			type   : 'POST',
  			url    : '/api/comment',  			
  			data   : json_request,
 		    data_type : 'json',
  			success : function(data, textStatus, jqXHR) {
  			  if (!self.comment_set_id) {
  			    self.comment_set_id = data.comment_set_id;
  			  }
  			  self.add_comment(data);
  			  self.change_state('post_comment_success');	
  			},
  			error: function(data, textStatus, jqXHR) {
  			  self.response_status = textStatus;
  			  self.change_state('post_comment_error');
  			},
  	        complete : function(jqXHR, textStatus) {
  	              if (YSDGui.unLockBackground) {
  	                YSDGui.unLockBackground();	
  	              }	
  	        }
  			
  		});
  	
  		
  	}
  	
  	this.add_comment = function(comment) {
  	  	  
  	  this.comments.push(comment);
  	  this.total += 1;  
  	  
  	  this.events.fireEvent( {type: 'comments_updated', comments: this.comments} );	
  		
  		
  	}
  	
  	this.change_state = function(action) {
  	
  	  switch (action) {
  	  	
  	  	case 'comments_retrieved_success':
  	  	  
  	  	  this.state = 'comments_loaded';
  	  	  break;
  	  	
  	  	case 'comments_retrieved_error':
  	  	
  	  	  this.state = 'comments_loaded_error';
  	  	  break;
  	  	  
  	  	case 'post_comment_success':
  	  	  
  	  	  this.state = 'post_comment_sent';
  	  	  break;
  	  	  
  	  	case 'post_comment_error':
  	  	 
  	  	  this.state = 'post_comment_sent_error'
  	  	  break;
  	  	
  	  }
  	  
  	  this.events.fireEvent( {type:'state_changed', state: this.state});
  		
  	}
  	
  }
  
  YSDCommentsController = function(model) { /* The Controller */
  
    this.model = model;
  
    this.postButtonClick = function() {
      var message = $($('.post-button')[0].form).formParams(true);
      this.model.post_comment(message);	
    }
  	
  }
  
  YSDCommentsView = function(model, controller, pagerId) { /* The View */
  	
  	this.model = model;                     /* Reference to the model */
  	this.controller = controller;           /* Reference to the controller */
    this.pagerId = pagerId || 'page_list';  /* The pager id*/
    this.pager = null;                      /* The pager */
  	this.tmpl_comments_holder = null;       /* The template to render the comment set */
  	this.tmpl_comment = null;               /* The template to render a comment */
  	
  	this.configure_events = function() {
  	  var self = this;  	
  	  this.model.addListener('state_changed', 
  	                       function(event) { 
  	                       	 self.state_changed(event); 
  	                       });  	
  	}
  
    this.configure_post_form = function() {
    	
      var self = this;	
    	
      // Limit the text area length
      YSDForms.limit_text_area_content_size(document.getElementById('message'), 1024, 
          function (content_remain) {
           document.getElementById('message_length').innerHTML = '<strong>' + content_remain + '</strong>';
          }
      );       	
    	
  	  $('.post-button').bind('click', 
  	                        function(event) {
  	                          self.controller.postButtonClick();	
  	                        });    	
    	
    }
  
    this.configure_events();
  	
  	this.state_changed = function(event) {
  		
  	  switch (event.state) {	
  		
  	    case 'comments_loaded':
  	     this.load_comments(); 
  	     break;
  	   
  	    case 'comments_loaded_error':	
  	     this.notify_user('Error','Error retrieving comments');
  	     break;	
  	   
  	    case 'post_comment_sent':
  	     this.update_comments();
  	     this.reset_form();
         break;
  	   
  	    case 'reply_message_sent_error':
  	     this.notify_user('Error','Error posting message');
  	     break; 
  	     
  	  }
  	}
  	
  	this.render = function() { /* Show the conversation holder */
  	
  	  if (this.tmpl_comments_holder == null) {
  	  	this.tmpl_comments_holder = tmpl('comments_script');	
  	  }	 
  	  
  	  var comments_container = document.getElementById('comments-container');
  	  comments_container.innerHTML = this.tmpl_comments_holder({comment_set_id : this.model.comment_set_id, self: this }); 	  
  	  
  	  this.configure_post_form();

	    this.model.retrieve_comments(); // Order to retrieve the comments
  	    	
  	}
  	
  	this.load_comments = function () { /* Show the full conversation */
  	
  	  var comments = this.model.comments;
  		
  	  if (comments == null || comments.length == 0)
  	  {
  	    return;	
  	  }	
  		
  	  if (this.tmpl_comment == null) {
  	  	this.tmpl_comment = tmpl('comment_script');	
  	  }	
  	   
      this.configure_pager();

      // Render the comments
      var messageHtml = '';
  	  for (var index = 0; index < comments.length; index++){
  	    messageHtml += this.tmpl_comment({comment:comments[index], self:this, index: index});	
  	  }
      var comments_element = document.getElementById('comments_holder');
  	  comments_element.innerHTML = messageHtml;
  	  
  	},

    this.configure_pager = function() { /* Configure the pager */

      controller_class = PagerFactory.getPagerController(this.pagerId);
      view_class = PagerFactory.getPagerView(this.pagerId); 

      pagerController = new controller_class();
      pagerView = new view_class('comments_pagination');
      
      var self = this;

      $('#comments_pagination').empty();

      if (this.model.total > this.model.pageSize) {
        this.pager = new Pager(this.model.pageSize, this.model.currentPage, this.model.total, pagerController, pagerView);
        this.pager.addListener('navigate', function(data) {
          self.model.retrieve_comments(data.page);
        });
      }

    }
  	
  	this.update_comments = function () { /* Update the conversation with the last sent message */
  	  	  
  	  if (this.tmpl_comment == null) {
  	  	this.tmpl_comment = tmpl('comment_script');	
  	  }	
  	  
  	  var comments_element = document.getElementById('comments_holder');
  	    	  
  	  // Adds the last conversation message
  	  comments_element.innerHTML += this.tmpl_comment({comment:this.model.comments[this.model.comments.length-1], self:this, index:this.model.comments.length-1 });
  	    	  	
  	  // Clear the reply message
  	  var comment_message = document.getElementById('message');
  	  $(comment_message).val('');  	  	
  	    	  	
  	}
  	
    this.reset_form = function() {
      $('.post-button')[0].form.reset();
    }

  	this.notify_user = function(title, message) {
  		
        $("<div title='" + title + "'>" + message + "</div>").dialog( { height: 160, modal: true,     	 
       	        buttons: {
       	            Ok: function() 
       	            {
				   	  $( this ).dialog( "close" );
				    }
				}
           	  });   	 	
  		
  	}   	
    
    this.format_message_date_time = function(comment) { /* format the received date-time */

       if (comment == null || comment.date == null) {
       	 return '';
       }
       
       var today = Date.today();   
        
       var comment_date = comment.date;
       var cleartime_comment_date = null;
       
       if (comment_date instanceof String) {
         comment_date = new Date(comment_date);
         cleartime_comment_date = (new Date(comment_date)).clearTime();
       }
       else {
         cleartime_comment_date = (new Date(comment_date.getTime())).clearTime();
       } 
                  
       return Date.equals(cleartime_comment_date, today)?comment_date.toString("HH:mm"):comment_date.getFullYear()==today.getFullYear()?comment_date.toString("d MMM, HH:mm"):comment_date.toString("d.MM.yy, HH:mm");	
    
    }
    
    this.format_sender_url = function(comment) { /* Format the sender */
      
      if (comment.composer_username == null || comment.composer_username == '' || comment.composer_username == 'anonymous') {
        return comment.composer_name;
      }
      
      return comment.composer_username;   
    
    }
  
    this.format_message = function(comment) { /* Format the message */
    
      return comment.message.replace(/\n/gi,'<br/>'); /* .replace(/\s/gi,'&nbsp;');    */
    
    }

  	
  }	
	
  return YSDCommentsManager;	
	
});