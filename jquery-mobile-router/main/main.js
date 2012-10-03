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
define(['jquery','underscore', 'backbone','router'],function($, _, Backbone,Router) {
    $(document).ready(function() {
      window.faq = window.faq || {
            // views: {
            //     appview: new AppView
            // },
            routers:{
                router:Router
            },
            defaults:{
                lang: "fr"
            }
        };
    });
});

