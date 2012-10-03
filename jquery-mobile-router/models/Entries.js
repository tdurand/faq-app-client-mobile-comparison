define(['jquery', 'underscore', 'backbone','models/Entry'],
function($, _, Backbone,Entry){

  var Entries = Backbone.Collection.extend({

    url:function() {
      return "http://vast-sierra-1666.herokuapp.com/entries/"+this.idCategory+"/"+this.lang;
    },

    model:Entry,

    setCategory:function(id) {
      this.idCategory=id;
    },

    setLang:function(lang) {
      this.lang=lang;
    },

    setEntry:function(id) {
      this.idEntry=id;
    },

    sync: function(method, model, options) {
        var params = _.extend({
            type: 'GET',
            dataType: 'jsonp',
            url: model.url(),
            processData:false
        }, options);

        return $.ajax(params);
    },

  });
  return new Entries();
});
