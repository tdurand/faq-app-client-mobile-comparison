require.config({
    //path mappings for module names not found directly under baseUrl
    paths: {
        jquery:       '../scripts/vendor/jquery-1.7.1.min',
        jqm:          '../scripts/vendor/jquery.mobile-1.1.1.min',
        underscore:   '../scripts/vendor/lodash.min',
        backbone:     '../scripts/vendor/backbone-min-amd',
        text:         '../scripts/vendor/text',
        jqmr :        '../scripts/vendor/jquery.mobile.router.min',
        models:       '../models',
        views:        '../views',
        templates:    '../templates'
    }

});

//1. load router.js,
define(['jquery','underscore', 'backbone','router-backbone','appview','jqm-config'],function($, _, Backbone,Router,AppView) {
    $(function(){
            
        window.faq = window.faq || {
            appView:AppView,
            routers:{
                router:new Router()
            },
            nextTransition: {
                type:"",
                reverse:false,
            },
            defaults:{
                lang: "fr",
                transition: "slide",
                reverse:false
            }
        };
        //Extend view
        Backbone.View.prototype.close = function(){
          this.off();
          if (this.onClose){
            this.onClose();
          }
        }

        Backbone.history.start();
    });
    
});