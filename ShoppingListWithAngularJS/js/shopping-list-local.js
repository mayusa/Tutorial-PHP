// using HTML5 localstorage to save data (https://github.com/djyde/StoreDB)
// there are 2 localstorage db: items, types
"use strict";
(function(){
	angular.module('mayApp', [])
	.constant('MAX_LENGTH', 50)
	.constant('MIN_LENGTH', 2)
	.factory('helperFactory', function () {
		return {
			filterFieldArrayByDone : function (thisArray, thisField, thisValue) {
				var arrayToReturn = [];

				for (var i = 0; i < thisArray.length; i++) {
					if (thisArray[i].done == thisValue) {
						arrayToReturn.push(thisArray[i][thisField]);
					}
				}

				return arrayToReturn;
			}	

		};		
	})
	.directive('ngConfirmClick', [
		function(){
			return {
				link: function (scope, element, attr) {
					var msg = attr.ngConfirmClick || "Are you sure?";
					var clickAction = attr.confirmedClick;
					element.bind('click',function (event) {
						if ( window.confirm(msg) ) {
							scope.$eval(clickAction)
						}
					});
				}
			};
		}])
	.controller('ShoppingListController', function ($scope, $http, $log, helperFactory, MAX_LENGTH, MIN_LENGTH) {

		// HTML5 localstorage
		$scope.getItems = function() {
			//localStorage.clear();
		    var items = localStorage.getItem("items");// json string
		    if (!items) {
		        items = [];
		        $scope.items = [];
		        // cant use JSON.stringify(obj);
		        localStorage.setItem("items", angular.toJson(items));
		    } else {
			    $scope.items = JSON.parse(items);// json -> obj array
		    }
		    console.log(items);
		}

		$scope.getItems();
		$scope.itemtitle = '';
		$scope.qty = '';
		$scope.type = '';

		//scope funcs

		$scope.howManyMoreCharsNeeded = function() {
			var Chars = (MIN_LENGTH - $scope.itemtitle.length);
			return (Chars > 0) ? Chars : 0;
		};

		$scope.howManyCharsRemaining = function() {
			var Chars = (MAX_LENGTH - $scope.itemtitle.length);

			return (Chars > 0) ? Chars : 0;
		};

		$scope.howManyCharsOver = function () {
			var Chars = (MAX_LENGTH - $scope.itemtitle.length);

			return (Chars < 0) ? Math.abs(Chars) : 0;
		};

		$scope.minCharsMet = function () {
			return ($scope.howManyMoreCharsNeeded() == 0);
		};

		$scope.anyCharsOver = function () {
			return ($scope.howManyCharsOver() > 0);
		};

		$scope.isNumOfCharsWithinRange = function () {
			return ($scope.minCharsMet() && !$scope.anyCharsOver());
		};

		$scope.goodToGo = function () {
			return ($scope.isNumOfCharsWithinRange() && $scope.qty > 0 && $scope.type > 0);
		};

		$scope.clear = function () {
			$scope.itemtitle = '';
			$scope.qty = '';
		};


		// CRUD

		$scope.select = function () {
			$scope.types = [
				{"id":"1","name":"Qty"},
				{"id":"2","name":"Lb"},
				{"id":"3","name":"Kg"}
			];

			$scope.type = "1";

		};
		// when page first loaded, automatically select
		$scope.select();

		$scope.insert = function () {
			if ($scope.goodToGo()) {
				
				// create new item object
				var newItem = {};
				if($scope.items.length !== 0){
					newItem.id = (parseInt($scope.items[$scope.items.length-1].id)+1).toString();
				} else {
					newItem.id = "0";
				}
				newItem.itemtitle = $scope.itemtitle;
				newItem.qty = $scope.qty;
				newItem.type = $scope.type;
				newItem.done = "0";
				newItem['$$hashKey']= "";
				newItem.date = Date.parse(new Date());
				if(newItem.type==="1"){
					newItem.type_name = "Qty";
				} else if(newItem.type==="2"){
					newItem.type_name = "Lb";
				} else {
					newItem.type_name = "Kg";
				};

				$scope.items.push(newItem);
				localStorage.setItem("items", angular.toJson($scope.items));
				$scope.getItems();
				$scope.clear();
			}  		
		};
		
		$scope.update = function (item) {
			for (var i = 0; i < $scope.items.length; i++) {
				if($scope.items[i].id === item.id){
					$scope.items[i].done = item.done === "1" ? "1" : "0";
					$scope.items[i].date = Date.parse(new Date());
					console.log($scope.items[i].date);
				}
			};			
			localStorage.setItem("items", angular.toJson($scope.items));	
		};
		
		
		$scope.remove = function () {
			var removeIds = helperFactory.filterFieldArrayByDone($scope.items, 'id', 1);			
			if (removeIds.length > 0) {
				for (var i = 0; i < removeIds.length; i++) {
					for (var j = 0; j < $scope.items.length; j++) {
						if($scope.items[j].id === removeIds[i]){
							console.log("bingo",j);
							$scope.items.splice(j,1);							
						}
					};
				};

				localStorage.setItem("items", angular.toJson($scope.items));
				$scope.$apply(function () {
					$scope.select();
				});
			}
		};
		
		$scope.print = function() {
			window.print();
		};
	});
})();

