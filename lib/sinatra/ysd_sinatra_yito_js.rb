#
# Routes
#
module Sinatra
  module YSD
    module YitoJS
    
      def self.registered(app)
                     
        #
        # Serves static content from the extension
        #
        app.get "/assets/*" do
            
           serve_static_resource(request.path_info.gsub(/^\/assets/,''), File.join(File.dirname(__FILE__), '..', '..', 'static'), 'assets')
            
        end  
                       
       end
       
     end # YitoJS
  end #YSD
end # Sinatra