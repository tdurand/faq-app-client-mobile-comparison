define(['jquery', 'underscore', 'backbone','models/Category'],
function($, _, Backbone,Category){

  var Categories = Backbone.Collection.extend({

    url:function() {
      return "http://vast-sierra-1666.herokuapp.com//categories/"+this.lang;
    },

    model:Category,

    langs:[{
            code:"fr",
            label:"Français"
          },
          { 
            code:"es",
            label:"Español"
          },
          {
            code:"en",
            label:"English"
          },
          {
            code:"it",
            label:"Italiano"
          },
          {
            code:"de",
            label:"Deutch"
          }
    ],

    setLang:function(lang) {
      this.lang=lang;
    },

    sync: function(method, model, options) {
        var params = _.extend({
            type: 'GET',
            dataType: 'jsonp',
            url: model.url(),
            processData:false
        }, options);

        return $.ajax(params);
    }

  });

  return new Categories();
});
