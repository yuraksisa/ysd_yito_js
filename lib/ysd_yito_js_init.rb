require 'ysd-plugins' unless defined?Plugins::Plugin

Plugins::SinatraAppPlugin.register :yito_js do

   name=        'yito_js'
   author=      'yurak sisa'
   description= 'yito js'
   version=     '0.1'
   hooker       Huasi::YitoJSExtension
   sinatra_extension Sinatra::YSD::YitoJS
end

