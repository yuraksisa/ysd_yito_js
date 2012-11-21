//
// Built using the following
// node ../../build_js/r.js -o mainConfigFile=app.build.config.js name=app.js out=built.js baseUrl=.
//
requirejs(['jquery',
           'jquery.ui',
           'jquery.ui.timepicker',
           'jquery.tools',
           'jquery.validate', 
           'jquery.formparams',
           'jquery.wysiwyg', 
           'jquery.ad-gallery', 
           'jquery.nivo.slider',
           'jquery.fcbkcomplete',
           'json2', 
           'datejs',
           'time',
           'underscore',
           'YSDDateFormatter',           
           'YSDjson2',
           'YSDEntityManagementComplementHooks', // complement hooks for entity management
           'YSDEntityManagement',           // Entity management
           'YSDTreeEntityManagement',       // Entity management
           'YSDAbstractDataSource',         // DataSource
           'YSDRemoteDataSource',           // DataSource
           'YSDMemoryDataSource',           // DataSource
           'YSDDataAdapter',                // Data adapter
           'YSDHierachyListAdapter',        // Adapt a list to a hierarchical structure
           'YSDListManagement',             // Manage a list of items 
           'YSDListViewer',                 // View a list of items (related to YSDListManagement)
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
           'YSDPager',
           'YSDPagerSimpleController',
           'YSDPagerSimpleView',
           'YSDPagerPListController',
           'YSDPagerPListView',
           'YSDPagerFactory'
        ],
        function() {
          // none	
        });
