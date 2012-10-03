define([
        'jquery',
        'underscore',
        'backbone',
        'jqmr',
        'views/index',
        'views/category',
        'jqm'
        ],
	function($, _, Backbone,jqmr,IndexView,CategoryView) {
        var Router=new $.mobile.Router({
        "#index(?:[?](.*))?":   { handler: 'index', events: "bs" },
        "#category(?:[?](.*))?": { handler: 'category', events: "bs" }
      }, {

        index:function(type,match){
            //Default lang
            var lang="fr";
            if(match[1]!==undefined) {
                var params=Router.getParams(match[1]);
                lang=params.lang;
            }
            this.indexView=new IndexView({lang:lang});
        },

        category:function(type,match) {
            var params=Router.getParams(match[1]);
            var categoryView=new CategoryView({id:params.id,lang:params.lang,idEntry:params.idEntry});
        }
      }
    );

      return Router;
});




