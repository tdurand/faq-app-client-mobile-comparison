## FAQ Mobile App : jQuery Mobile - Backbone.js - Require.js

### About:

This project aims to compare two differents methods to integrate Backbone.js with jQuery Mobile.

It's a basic FAQ visualisation app which consume webservice from this project: [http://github.com/tdurand/faq-app-server](http://github.com/tdurand/faq-app-server)

Two differents approachs: 

* keep jQuery Mobile default router and use the jquery-mobile router project which extend the native jQMobile router giving the possibility to pass parameters.

* disable jQuery Mobile default router and use Backbone for routing.

### Demos:

* Jquery mobile routing : [link](http://tdurand.github.com/faq-app-client-mobile-comparison/jquery-mobile-router/)

* Backbone.js routing : [link](http://tdurand.github.com/faq-app-client-mobile-comparison/backbone-routing/)

### Comparison :

#### Routing

##### Declaration

##### Url updating

#### Transitions management

##### jQuery Mobile Router

Like native jQM, you'll just need to put a data-transition attribute on the link and jQM will handle the rest.

Additionaly, jQM will detect that you need a reverse transition when you press "back button".

##### Backbone routing

I think is the ugliest part of backbone routing based integration.

Because you manually change the page in the router , you need to know the transition at this moment of the execution. But when the function corresponding to your router is called by the Backbone Router, you don't know it.

    $.mobile.changePage($(view.el), {
                                            transition:yourtransition,
                                            changeHash:false,
                                            reverse:true or false
                                        });

###### Transition as parameters

A solution is to pass the transition in the url parameter, it's ugly because you pollute your url with transition data which you need to clean after.

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


###### Handling clicks or touchs on links to get the transition

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


#### Events 

TODO

### Conclusion

TODO