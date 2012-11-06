require 'ysd-plugins_viewlistener' unless defined?Plugins::ViewListener

#
# UI Base
#
# The base plugin to create GUI
#
module Huasi
  
  #
  # http://jqueryui.com/
  #
  class YitoJSExtension < Plugins::ViewListener
  
    # ========= Installation =================

    # 
    # Install the plugin
    #
    def install(context={})
            
        SystemConfiguration::Variable.first_or_create({:name => 'site.js_lib'}, 
                                                      {:value => 'full_library', :description => 'full_library', :module => :yito}) 
    
    end

    # ========= Page Building ============

    #
    # It gets the style sheets defined in the module
    #
    # @param [Context]
    #
    # @return [Array]
    #   An array which contains the css resources used by the module
    #
    def page_style(context={})
      [
        '/assets/css/style.css'         
      ]       
    end
 
    #
    # It gets the scripts used by the module
    #
    # @param [Context]
    #
    # @return [Array]
    #   An array which contains the css resources used by the module
    #
    def page_script(context={})

       if SystemConfiguration::Variable.get_value('site.js_lib', 'full_library') == 'full_library'

         ['/assets/js/require.js',
          '/assets/js/built.js']

       else

         ['/assets/js/require_config.js',
          '/assets/js/require.js']

       end
    end    
         
  end #YitoJSExtension
  
end #Huasi