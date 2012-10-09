define(['jquery', 
        'underscore', 
        'backbone',
        'text!templates/categoryViewTemplate.html',
        'text!templates/listEntriesViewTemplate.html',
        'models/Categories',
        'models/Entries',
        'models/Labels'
        ],
function($, _, Backbone,categoryViewTemplate,listEntriesViewTemplate,Categories,Entries,Labels){

  var CategoryView = Backbone.View.extend({

    el:"#category",
    listentries:"#listEntriesView",

    events : {
      "expand #listEntriesView":"entryExpanded"
    },

    initialize:function() {
        if(Categories.size()==0) {
          Categories.setLang(this.options.lang);
          Categories.fetch();
          Categories.on("reset",this.render,this);
        }
        Entries.setCategory(this.options.id);
        Entries.setLang(this.options.lang);
        Entries.setEntry(this.options.idEntry);
        this.render();
        Entries.fetch();
        Entries.on( 'reset', this.renderList, this );
    },

    //render the content into div of view
    render: function(){
      //this.el is the root element of Backbone.View. By default, it is a div.
      //$el is cached jQuery object for the view's element.
      //append the compiled template into view div container
      this.$el.html(_.template(categoryViewTemplate,{
                                    entries:Entries,
                                    category:Categories.get(Entries.idCategory)
                                    }));
                                    
      //Trigger jquerymobile rendering
      var thisel=this.$el;
      this.$el.on( 'pagebeforeshow',function(event){
         thisel.trigger('pagecreate');
      });
      //return to enable chained calls
      return this;
    },


    renderList: function() {
      $.mobile.hidePageLoadingMsg()

      $(this.listentries).html(_.template(listEntriesViewTemplate,{
                                    entries:Entries,
                                    labels:Labels.attributes
                                  }));

      this.$el.trigger('pagecreate');

      return this;
    },

    entryExpanded:function() {
      var expandedElement=this.getExpandedElement();
      var expandedEntryId=expandedElement.attr("data-entryid");
      if(expandedEntryId!=undefined) {
        faq.routers.router.navigate("#"+Entries.lang+"/category/"+Entries.idCategory+"/entry/"+expandedEntryId,{replace: true});
        //Attach a collapsed handler
        expandedElement.on("collapse.expanded",function() {
            faq.routers.router.navigate("#"+Entries.lang+"/category/"+Entries.idCategory,{replace: true});
            $(this).off("collapse.expanded");
        });
      }
    },

    getExpandedElement:function() {
      return $("#listEntriesView div.ui-collapsible").not("div.ui-collapsible-collapsed");
    },

    onClose: function(){
      //Clean
      this.undelegateEvents();
      Categories.off("reset",this.render,this); 
      Entries.off('reset'); 
      this.$el.off('pagebeforeshow'); 
    }

  });
  return CategoryView;
});


