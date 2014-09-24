angular.module('pragmatic-angular', [])
/**
	binds the given handler(s) to the element.

	can be used to bind ANY event (including custom or namespaced events) to the element.
	Multiple event names are also allowed (One or more space-separated event types and optional namespaces, such as "click" or "keydown.myPlugin".)

	events are expected in object notation (``{touch : onTouch}``) where the key is the event name.
	the value can be either a function (the event handler) or an object with key "handler" transporting
	the event handler function and optional the properties "selector" and "data".

	See http://api.jquery.com/on/ for details of the event value properties.

	example usage :

	<div ng-on="{
		click 					: onClick,
		tap 						: {handler : onTap},
		'my.customevent': {
			handler : onCustomEvent,
			data		: {foo : 'bar'},
			selector: 'BUTTON.active'
		}
	}">
		<!-- suppose many more nested elements with query plugins attached here-->
		...
	</div>
	...
	.controller('main', function($scope) {
		$scope.onClick = function(event) {
			...
		};
	})
	...
*/
.directive('ngOn', [function() {
    return {
        link : function(scope, element, attrs) {
            var events=scope.$eval(attrs.ngOn);
            Object.keys(events).forEach(function(event) {
                var value = events[event];
                (typeof(value)==='function') && (value = {handler : value});
                element.on(event, value.selector || null, value.data || {}, value.handler);
            });
        }
    };
}])
/**
	binds ANY jQuery plugin to this element. Multiple plugin per element are also fine.

	jQuery plugins are expected in object notation (``{datepicker : {buttonText: "Choose"}}``) where the key is the jQuery plugin.
	the value is expected to be the argument to provide to the jQuery plugin (or {} for no arguments).

	example usage:

	<ul ng-jquery-plugin="{
      sortable : {
          helper               : 'clone',
          placeholder          : 'ui-state-highlight',
          stop                 : onStop
      },
      disableSelection : {
      }
  }">
		<li ng-repeat="item in items">{{item}}</li>
	</ul>
	...
	.controller('main', function($scope) {
    $scope.items=['alpha', 'beta', 'gamma', 'delta'];

    $scope.onStop = function(event, ui) {
        var item = angular.element(ui.item).scope().item;
        $scope.items.splice($scope.items.indexOf(item), 1)
        $scope.items.splice(ui.item.index(), 0, item);
        $scope.$apply();
    };
	})
	...
*/
.directive('ngJqueryPlugin', [function() {
    return {
        link : function(scope, element, attrs) {
            var plugins=scope.$eval(attrs.ngJqueryPlugin), $e=$(element);

            Object.keys(plugins).forEach(function( plugin) {
                $e[plugin](plugins[plugin]);
            });
        }
    };
}]);
