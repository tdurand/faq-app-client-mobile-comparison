# FAQ Mobile App : jQuery Mobile - Backbone.js - Require.js

## About:

*Disclamer: I'm not an expert on the subject, and maybe i'm wrong or incomplete on some points, i will really appreciate some feedback.*

This project aims to compare two differents methods to integrate Backbone.js with jQuery Mobile.

It's a basic FAQ visualisation app which consume webservice from this project: [http://github.com/tdurand/faq-app-server](http://github.com/tdurand/faq-app-server)

Two differents approachs: 

* keep jQuery Mobile default router and use the jquery-mobile router project which extend the native jQMobile router giving the possibility to pass parameters. [https://github.com/azicchetti/jquerymobile-router](Project on github)

* disable jQuery Mobile default router and use Backbone for routing. [https://github.com/addyosmani/backbone-mobile-search#backbone-and-jquery-mobile-resolving-the-routing-conflicts](based on addyosmany works)

## Demos:

* Jquery mobile routing : [link](http://tdurand.github.com/faq-app-client-mobile-comparison/jquery-mobile-router/)

* Backbone.js routing : [link](http://tdurand.github.com/faq-app-client-mobile-comparison/backbone-routing/)

## Comparison :

### Routing Declaration

#### Backbone routing

Backbone based routing is way better is this point, you can specify your routes like this:

    routes: {
                '':                                                 'index',
                ':lang':                                            'index',
                ':lang/category/:id':                               'category',
                ':lang/category/:id/entry/:idEntry':                'category', 
            },

And then you can access the parameters in your handlers:

    category:function(lang,id,idEntry) {
                var categoryView=new CategoryView({id:id,lang:lang,idEntry:idEntry});
                faq.appView.show(categoryView);
                this.changePage(categoryView,transition);
                $.mobile.showPageLoadingMsg();
    },

You can have really cleans and REST Like urls.

#### jQuery Mobile Router

jQM router doesn't give you the possibility to do pretty routing like this ([https://github.com/azicchetti/jquerymobile-router/issues/58](More info here on why)).

Example of an url: 

    #category?param1="qsj"&params2="sj"

The routes declaration looks like this, you specify a regex to get the parameters:

    "#index(?:[?](.*))?":   { handler: 'index', events: "bs" },
    "#category(?:[?](.*))?": { handler: 'category', events: "bs" }

And then you can access the parameters in your handlers:

    index:function(type,match){
                //Default lang
                var lang="fr";
                if(match[1]!==undefined) {
                    var params=Router.getParams(match[1]); //GET the params 
                    lang=params.lang;
                }
                this.indexView=new IndexView({lang:lang});
    },


### Routing : Url hash updating

A good web application design rule is that you can bookmark any page. For a front-end application it implies that you can easily manage the window.location object to update the current url

#### Backbone routing

Backbone provides a really nice way to do it with the navigate function of the router ([http://backbonejs.org/#Router-navigate](http://backbonejs.org/#Router-navigate) )

You can update the url and choose if you want to trigger the route, and even if you want to add the action in the history.

In the demo apps is particulery usefull to be able to bookmark a particular entry:

    //Update the url without triggering the route
    faq.routers.router.navigate("#"+Entries.lang+"/category/"+Entries.idCategory+"/entry/"+expandedEntryId,{replace: true});
        //Attach a collapsed handler
        expandedElement.on("collapse.expanded",function() {
            //Update the url when collapsing
            faq.routers.router.navigate("#"+Entries.lang+"/category/"+Entries.idCategory,{replace: true});
            $(this).off("collapse.expanded");
    });

#### jQuery Mobile Router

With jquery mobile router you'll need to do all by hand. And i didn't find how to use windows.location.replace() without causing a jQM triggering a new rendering.

            //Change url SEE HOW TO NOT TRIGGER ROUTER 
            window.location.replace("#category?lang="+Entries.lang+"&id="+Entries.idCategory+"&idEntry="+expandedEntryId);
            //Attach a collapsed handler
            expandedElement.on("collapse.expanded",function(e) {
                $(this).off("collapse.expanded");
                window.location.replace("#category?lang="+Entries.lang+"&id="+Entries.idCategory);
            });

### Transitions management

#### Backbone routing

I think is the ugliest part of backbone routing based integration.

Because you manually change the page in the router , you need to know the transition at this moment of the execution. But when the function corresponding to your router is called by the Backbone Router, you don't know it.

    $.mobile.changePage($(view.el), {
                                            transition:yourtransition,
                                            changeHash:false,
                                            reverse:true or false
                                        });

##### Transition as parameters

A solution is to pass the transition as a parameter, it's ugly because you pollute your url with transition data which you need to clean after.

Router:

    ':lang':                                            'index',
    ':lang/:transition':                                'index', //Handle specific transition
    ':lang/:transition/reverse/:reverse':               'index', //Handle reverse

Links:

    <a href="#fr/slide/reverse/true">Back</a> //Back button link
    
An you handle transition in the router like this

        index:function(lang,transition,reverse){

            //Set lang if given
            if(lang) {
                this.lang=lang;
            }
            //Clean the url ( #fr/slide/reverse/true -> #fr)
            this.navigate("#"+this.lang, {replace: true});
            var indexView=new IndexView({lang:this.lang});
            this.changePage(indexView,transition,reverse);
        }

In reality, you don't need to specify the transition every time, you can define a default transition (for example "slide") and just specify the transition if you don't want the default transition. Although for backbutton you must specify the reverse transition... 


##### Handling clicks or touchs on links to get the transition

A better solution i've found is to attach an handler on all links of the views and set a global var lastTransition which is updated every time a link is triggered.

    initialize:function() {
            var me=this;
            //Global Transition handler
            $("a").live("touch click",function(e) {
                me.setNextTransition(this);
            });
    },

    setNextTransition:function(el) {
          faq.nextTransition.type=$(el).attr("data-transition");
          faq.nextTransition.reverse=$(el).attr("data-reverse");
    }

The change page method:

    changePage:function (view) {
        //Defaults
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

And the links are like jQM with the data-transition attribute, and we can add the data-reverse attribute if we want a reversed transition

    <a href="#fr" data-transition="slide" data-reverse="true" data-icon="back" >Back</a>

This method is much more cleaner in term of boilerplate code, but it's still not perfect. I'm open to better propositions ;-).

#### jQuery Mobile Router

Like native jQM, you'll just need to put a data-transition attribute on the link and jQM will handle the rest.

Additionaly, jQM will detect that you need a reverse transition when you press "back button".


### Events 

#### Backbone routing

Unlike jQuery Mobile Router, you can't trigger the routes handler on jquery mobile events (backbone trigger the routes on url changes), but you always can access to this events by putting a handler if you need it. 


#### jQuery Mobile Router

> The main reason is to preserve the granularity offered by jQuery Mobile while giving the programmer a simple way to tap into "unusual" page transition states, such as "pageinit" or "pageremove", as if they were standard routes. The outcome is a controller which is more powerful and versatile, in the jQM realm, than its purely hashchange based counterpart.

With jQuery Mobile Router you can trigger the routes on some precise events:

    bc  => pagebeforecreate
    c   => pagecreate
    i   => pageinit
    bs  => pagebeforeshow
    s   => pageshow
    bh  => pagebeforehide
    h   => pagehide
    rm  => pageremove
    bC  => pagebeforechange
    bl  => pagebeforeload
    l   => pageload 

With the transition management this one of the main avantage of using jQuery Mobile Router.

### Miscellaneous

#### Reusability

Using backbone for routing clearly separe your view logic from you app logic, you can easily reuse you code to build a new interface (for Desktop, Tablet ...)

#### Compability

Do not uses jQM default routing and you can forget the B and C grade support : [http://jquerymobile.com/demos/1.2.0/docs/about/platforms.html](http://jquerymobile.com/demos/1.2.0/docs/about/platforms.html)


## Conclusion

Depending on your project requirements, both solution can be adopted. If you are doing only a phonegap app, maybe you just don't care to have pretty urls, and you want to use most of the jQM features.

Using Backbone for routing makes use of jQMobile only as an UI framework from that you can switch to build other interface to your app.

I think that for a big project, backbone routing approachs will gives you a code much more maintainable, and if you are doing a web app clean url are priceless.

