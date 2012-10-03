define(['jquery', 'underscore', 'backbone'],
function($, _, Backbone){

  var Labels = Backbone.Model.extend({

    url:function() {
      return "conf/labels_"+this.get("lang")+".json";
    },

    initialize:function() {
      this.fetch();
    }
  });
  return new Labels({lang:"fr"});

});