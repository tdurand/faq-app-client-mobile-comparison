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
            ':lang/category/:id':                               'category',
            ':lang/category/:id/entry/:idEntry':                'category', 
        },

        initialize:function() {
            var me=this;
            //Global Transition handler
            $("a").live("touch click",function(e) {
                me.setNextTransition(this);
            });
        },

        index:function(lang,transition,reverse){
            //Set lang if given
            if(lang) {
                this.lang=lang;
            }
            else {
                this.lang=faq.defaults.lang;
            }
            var indexView=new IndexView({lang:this.lang});
            this.changePage(indexView,transition,reverse);
        },

        category:function(lang,id,idEntry,transition) {
            var categoryView=new CategoryView({id:id,lang:lang,idEntry:idEntry});
            this.changePage(categoryView,transition);
            $.mobile.showPageLoadingMsg();
        },

        changePage:function (view) {
            //Default
            var reverse=faq.defaults.reverse;
            var transition=faq.defaults.transition;
            //Get last transition information if exists
            if(faq.nextTransition.type!=undefined) {
                if(faq.nextTransition.reverse!=undefined) {
                    reverse=true;
                }
                transition=faq.nextTransition.type;
            }
            $.mobile.changePage($(view.el), {
                                        transition:transition,
                                        changeHash:false,
                                        reverse:reverse
                                    });
        },

        setNextTransition:function(el) {
          faq.nextTransition.type=$(el).attr("data-transition");
          faq.nextTransition.reverse=$(el).attr("data-reverse");
        }

    });

    return Router;

});




