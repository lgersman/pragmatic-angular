pragmatic-angular
=================

[pragmatic-angular] is a very small [AngularJS] module for
* embedding **ANY** [jQuery] plugin including [Twitter Bootstrap], [jQuery UI] and any other [jQuery] plugin
* handling native and custom events

without hassle.

## Introduction

Do you use dozens of [AngularJS] modules wrapping
* [Twitter Bootstrap] controls
* [jQuery UI] widgets
* **[enter-name-of-your-favorite-[jQuery]-plugin-here]**
* or even custom javascript event wrapper directives

?

You dont need to use them anymore (... *except in very very rare cases*).

This [AngularJS] module contains just a few lines of code which can reduce your web application size massively.

You dont need to read documentation for all the [AngularJS] modules wrapping  [jQuery] plugin anymore.

Know the [jQuery] plugin of your choice and you can instantly use it within [AngularJS].

Live examples :

* [pragmatic-angular module example utilizing Bootstrap Modal and Popover](http://jsfiddle.net/lgersman/p8ag7pLn/)

* [pragmatic-angular module example utilizing jQuery UI sortable](http://jsfiddle.net/lgersman/swkdLrjq/)

### Background

I started years ago coding the same mantra as many others :

> Wrap your [jQuery] plugin in a [AngularJS] directive for better readability.

And also

> Write a [AngularJS] directive for custom events. It looks better.

These mantra seemed to be state of the art for a long time.

While using [AngularJS] with such modules I recognized that most of these directive wrappers
* just delegate options/method calls to the wrapped [jQuery] plugin  
* dont provide additional functionality
* consist mostly of boilerplate code doing nothing than blow up my webapp size
* contain bugs which slow down my development process

So the question was : **Do I really need those [AngularJS] modules ?**

The answer is : **NO !**

Its piece of cake to make all your [jQuery] plugins available to [AngularJS] without wrapping them individually into directives. And same for custom events.

Thats what [pragmatic-angular] provides : an [AngularJS] module containing 2 directives to use any [jQuery] plugin consume any custom event in [AngularJS].

### Usage

[pragmatic-angular] provides you directives for

* working with jquery plugins
* handling native and custom events

#### ng-jquery-plugin

``ng-jquery-plugin`` directive can apply one or more [jQuery] plugins to an element. The directive expects data in object notation as its value.

Each key of the object is expected to be an [jQuery] plugin name (to be exact : any of the functions registered on ``jQuery.fn`` can be used).

The associated value has to be an object transporting the plugin options. You can leave it empty if no plugin options should be set.

Example usage :

* apply [jQuery UI] ``disableSselection`` (http://api.jqueryui.com/disableselection/)
````
<div ng-jquery-plugin="{
    disableSelection : {}
}">...</div>
````

* apply [jQuery UI] ``sortable`` (http://api.jqueryui.com/disableselection/) with plugin options
````
<ul ng-jquery-plugin="{
    sortable : {
        helper               : 'clone',
        placeholder          : 'ui-state-highlight',
        stop                 : onStop
    }
}">
    ...
</ul>
````

* apply multiple [jQuery] plugins to an element
````
<ul ng-jquery-plugin="{
    sortable : {
        helper               : 'clone',
        placeholder          : 'ui-state-highlight',
        stop                 : onStop
    },
    disableSelection : {
    }
}">
    ...
</ul>
````

##### Real world example

Suppose you want to use the [jQuery UI] sortable to sort a list. You just need to read the documentation of the [jQuery UI] plugin (http://jqueryui.com/sortable/) and you're ready :

````
<!-- attach the jQuery UI Sortable plugin to the element -->
<ul ng-jquery-plugin="{
    sortable : {
        helper               : 'clone',
        placeholder          : 'ui-state-highlight',
        stop                 : onStop
    }
}">
    <li ng-repeat="item in items" class="ui-state-default">
        <span class="ui-icon ui-icon-arrowthick-2-n-s"></span>
        {{item}}
    </li>
</ul>
...
angular.module('app', ['pragmatic-angular'])
.controller('main', function($scope) {
        // define your data model
    $scope.items=['alpha', 'beta', 'gamma', 'delta'];

        // define the event handler the stop event of the plugin
    $scope.onStop = function(event, ui) {
            // get the item
        var item = angular.element(ui.item).scope().item;
            // remove the moved item from the model
        $scope.items.splice($scope.items.indexOf(item), 1)
            // insert it at the new position
        $scope.items.splice(ui.item.index(), 0, item);
            // tell angular that the model changed
        $scope.$apply();
    };
});
````

Play with the live example : [pragmatic-angular module example utilizing jQuery UI sortable](http://jsfiddle.net/lgersman/swkdLrjq/).

If you are more familiar with [Twitter Bootstrap] you should consider diving into  [pragmatic-angular module example utilizing Bootstrap Modal and Popover](http://jsfiddle.net/lgersman/p8ag7pLn/) example.

### ng-on

Using ``ng-on`` allows you to handle ANY native or [custom](https://developer.mozilla.org/en/docs/Web/API/CustomEvent) events of an element (or even bubbled from its children).

The directive expects data in object notation as its value.

Each key of the object is expected to be an one or more space-separated event types and optional namespaces, such as ``click`` or ``keydown.myPlugin``.

The associated value for an event can be one of  
* the event handler function
* an object with property ``handler`` transporting the event handler and the optional properties ``selector`` and ``data`` (see [AngularJS element.on/jQuery.on](http://api.jquery.com/on/) for details).

``ng-on`` can also be used with pure [AngularJS] without [jQuery].

Example usage :

* listen to a single event (the ``onClick`` function must be in scope, i.e. defined in your [AngularJS] controller):
````
<div ng-on="{ click : onClick}">
    ...
</div>
````

* listen to multiple events at once :
````
<div ng-on="{
	click           : {
        handler : onClick
    },
	tap             : onTap,
	'customcontrol.customevent': {
		handler : onCustomEvent,
		data		: {
            foo : 'bar'
        },
		selector: '.customcontrol.active'
	}
}">
	...
</div>
````

##### Real world example

````
<div ng-controller="main" ng-on="{
    click     : { handler : onClick, data : { foo : 'bar'}},
    sortstop  : onSortstop
}">
	<ul ng-jquery-plugin="{
	    sortable : {
				...
	    }
	}">
		...
	</ul>
</div>
...
.controller('main', function($scope) {
    ...

    $scope.onClick=function(event) {
        console.log( "onclick : data was ", event.data);
    };

    $scope.onSortstop=function(event, ui) {
        console.log( "onSortstop : item ", ui.item[0], " was moved to position ", ui.item.index());
    };
});
````

Play with the live example : [pragmatic-angular module example utilizing jQuery UI sortable](http://jsfiddle.net/lgersman/swkdLrjq/)

If you are more familiar with [Twitter Bootstrap] you should consider diving into  [pragmatic-angular module example utilizing Bootstrap Modal and Popover](http://jsfiddle.net/lgersman/p8ag7pLn/) example.

[pragmatic-angular]: https://github.com/lgersman/pragmatic-angular
[AngularJS]: http://angularjs.org
[Twitter Bootstrap]: http://getbootstrap.com/
[Jquery]: http://jquery.com/
[jQuery UI]: http://jqueryui.com/

## License

[pragmatic-angular] is dual licensed under

* [MIT](http://www.opensource.org/licenses/MIT)
* [GPL2](http://www.opensource.org/licenses/GPL-2.0)
