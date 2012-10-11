define(['jquery', 'underscore', 'backbone'],
function($, _, Backbone){

  var Labels = Backbone.Model.extend({

    url:function() {
      return "conf/labels_"+this.lang+".json";
    },

    setLang:function(lang) {
      this.lang=lang;
    }

  });
  return new Labels();

});