define([
        'jquery',
        'underscore',
        'backbone',
        'views/index',
        'views/category',
        'jqm'
        ],
	function($, _, Backbone,IndexView,CategoryView) {

        var Router = Backbone.Router.extend({
        //define routes and mapping route to the function
        routes: {
            '':                                                 'index',
            ':lang':                                            'index',
            ':lang/:transition':                                'index', //Handle specific transition
            ':lang/:transition/reverse/:reverse':               'index', //Handle reverse
            ':lang/category/:id':                               'category',
            ':lang/category/:id/:transition':                   'category',
            ':lang/category/:id/entry/:idEntry':                'category',
            ':lang/category/:id/entry/:idEntry/:transition':    'category',
        },

        initialize:function() {
            this.lang="fr";
        },

        index:function(lang,transition,reverse){

            //Set lang if given
            if(lang) {
                this.lang=lang;
            }
            //clean url (is transition given)
            this.navigate("#"+lang, {replace: true});
            var indexView=new IndexView({lang:this.lang});
            this.changePage(indexView,transition,reverse);
        },

        category:function(lang,id,idEntry,transition) {
            var categoryView=new CategoryView({id:id,lang:lang,idEntry:idEntry});
            this.changePage(categoryView,transition);
            $.mobile.showPageLoadingMsg();
        },

        changePage:function (view,trans,reversed) {
            var reverse=false;
            var transition="slide";
            if(trans!=undefined) {
                if(reversed!=undefined) {
                    reverse=true;
                }
                transition=trans;
            }
            $.mobile.changePage($(view.el), {
                                        transition:transition,
                                        changeHash:false,
                                        reverse:reverse
                                    });
        }

    });

    return Router;

});




