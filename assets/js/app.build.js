// app.build.js (Builder for optimize project)
// node r.js -o mainConfigFile=main_config.js name=main.js out=built.js baseUrl=.
// node r.js -o app.build.js
// http://japhr.blogspot.com.es/2011/12/whole-project-optimization-with.html
({
   appDir: '../',
   baseURL: 'js',
   dir:'../../build',
   mainConfigFile: 'app.build.config.js',
   optimize: 'none',
/*
   modules: [ 
     {
       name:"app.to.built" 
     }
   ]
 */
   name: 'app.js',
   out: 'full.js'     
})
