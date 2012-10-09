define([
        'jquery',
        'underscore',
        'backbone'
        ],
    function($, _, Backbone) {

        var AppView = {

            show:function(view) {
                if (this.currentView){
                  this.currentView.close();
                }

                this.currentView = view;
            }

        }

        return AppView;

});




