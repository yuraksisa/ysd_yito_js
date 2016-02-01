Gem::Specification.new do |s|

  s.name    = "ysd_yito_js"
  s.version = "0.1.113"
  s.authors = ["Yurak Sisa Dream"]
  s.date    = "2012-10-15"
  s.email   = ["yurak.sisa.dream@gmail.com"]
  s.files   = Dir['lib/**/*.rb','views/**/*.erb','i18n/**/*.yml','static/**/*.*', 'bin/**/*'] 
  s.description = "JS Library base to create gui applications"
  s.summary = "JS Library base to create gui application"

  s.add_runtime_dependency "ysd_core_themes"
          
end