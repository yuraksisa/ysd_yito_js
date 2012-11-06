//
// Built using the following
// node ../../build_js/r.js -o mainConfigFile=app.build.config.js name=app.js out=built.js baseUrl=.
//
requirejs(['jquery',
           'jquery.ui',
           'jquery.tools',
           'jquery.validate', 
           'jquery.formparams',
           'jquery.wysiwyg', 
           'jquery.ad-gallery', 
           'jquery.nivo.slider',
           'json2', 
           'datejs',
           'time',
           'YSDjson2',
           'YSDEntityManagement',           // Entity management
           'YSDTreeEntityManagement',       // Entity management
           'YSDAbstractDataSource',         // DataSource
           'YSDRemoteDataSource',           // DataSource
           'YSDMemoryDataSource',           // DataSource
           'YSDDataAdapter',                // Data adapter
           'YSDHierachyListAdapter',        // Adapt a list to a hierarchical structure
           'YSDListManagement',             // Manage a list of items 
           'YSDListSelector',               // Select an element from a list (checkboxes)
           'YSDSelectSelector',             // Select an element from a select
           'YSDSelectHierarchicalSelector', // Select an element from a select (hierarchical structure)
           'YSDLocationViewer',             // View address on a Map
           'YSDEventTarget', 
           'YSDStyles',
           'YSDGui',
           'YSDForms',
           'YSDCommentsManager',
           'YSDDateControl',
           'YSDDialog', 
        ],
        function() {
          // none	
        });
