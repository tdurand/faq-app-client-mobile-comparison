define(['jquery', 
        'underscore', 
        'backbone',
        'text!templates/indexViewTemplate.html',
        'text!templates/listCategoriesViewTemplate.html',
        'models/Categories',
        'models/Labels',
        ],
function($, _, Backbone,indexViewTemplate,listCategoriesViewTemplate,Categories,Labels){

  var IndexView = Backbone.View.extend({

    el:"#index",
    listview:"#listCategoriesView",

    events: {
      "change #lang":"submitForm",
    },

    initialize:function() {
        //If lang change, need to fetch
        if(this.options.lang!=Categories.lang) {
            $.mobile.showPageLoadingMsg();
            Categories.setLang(this.options.lang);
            Categories.fetch();
            Labels.fetch();
        }
        this.render();
        this.renderList();
        Labels.on( 'all', this.render, this );
        Categories.on( 'all', this.renderList, this );
    },

    submitForm:function() {
      //Hack to prevent multiple change event call
      if($("#lang").val()!=Categories.lang) {
        window.location.href=$("#lang").val();
      }
    },

    //render the content into div of view
    render: function(){
	  //this.el is the root element of Backbone.View. By default, it is a div.
      //$el is cached jQuery object for the view's element.
      //append the compiled template into view div container
      this.$el.html(_.template(indexViewTemplate,{
                                    categories:Categories,
                                    labels:Labels.attributes
                                  }));
      //Trigger jquerymobile rendering
      this.$el.trigger('pagecreate');

      //return to enable chained calls
      return this;
    },

    renderList: function() {

      $(this.listview).html(_.template(listCategoriesViewTemplate,{
                                    categories:Categories,
                                    labels:Labels.attributes
                                  }));

      $(this.listview).listview('refresh');
      $.mobile.hidePageLoadingMsg()

      return this;
    },

    onClose: function(){
      //Clean
      this.undelegateEvents();
      Categories.off("all",this.renderList); 
      Labels.off( 'all', this.render);
    }

  });
  return IndexView;
});


