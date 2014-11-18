"use strict";

angular.module('clausApp', [])
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
	var urlInsert = 'mod/insertJSON.php';
	var urlSelect = 'js/items.json';
	var urlUpdate = 'mod/updateJSON.php';
	var urlRemove = 'mod/removeJSON.php';
	
	$scope.types = [];
	$scope.items = [];
	
	$scope.item = '';
	$scope.qty = '';
	$scope.type = '';
	
	$scope.howManyMoreCharsNeeded = function() {
		var Chars = (MIN_LENGTH - $scope.item.length);
		return (Chars > 0) ? Chars : 0;
	};
	
	$scope.howManyCharsRemaining = function() {
		var Chars = (MAX_LENGTH - $scope.item.length);
		
		return (Chars > 0) ? Chars : 0;
	};
	
	$scope.howManyCharsOver = function () {
		var Chars = (MAX_LENGTH - $scope.item.length);
		
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
		$scope.item = '';
		$scope.qty = '';
	};
	
	function _recordAddedSuccessfully(data){
		return (data && !data.error && data.item);
	}
	
	$scope.insert = function () {
		if ($scope.goodToGo()) {
			$http({
				method : 'POST',
				url : urlInsert,
				data : "item=" + $scope.item + "&qty=" + $scope.qty + "&type=" + $scope.type,
				headers : {'Content-Type' : 'application/x-www-form-urlencoded'}				
			})
				.success(function(data) {
					console.log(data);
					if (_recordAddedSuccessfully(data)) {
						$scope.items.push({
							item : data.item.item,
							qty : data.item.qty,
							type : data.item.type,
							type_name : data.item.type_name,
							done : data.item.done
						});
						
						$scope.clear();
					}
				})
				.error(function(data, status, headers, config){
					throw new Error('Something went wrong with inserting record');						
				});
		}
	};
	
	$scope.select = function () {
		$http.get(urlSelect)
		.success(function(data) {
			console.log(data);
			if (data.items) {
				$scope.items = data.items;
			}
			
			if (data.types) {
				$scope.types = data.types;
				$scope.type = $scope.types[0].id;
			}
		})
		.error(function(data, status, headers, config){
			throw new Error('Something went wrong with selecting records');						
		});
	};
	
	// when page first loaded, automatically select
	$scope.select();
	
	$scope.update = function (item) {
		$http({
			method: 'POST',
			url : urlUpdate,
			data : "id=" + item.id + "&done=" + item.done,
			headers : {'Content-Type' : 'application/x-www-form-urlencoded'}	
		})
		.success(function (data) {
			//$log.info(item);
			//$log.info(data);
		})
		.error(function(data, status, headers, config){
			throw new Error('Something went wrong with updating record');						
		});
	};
	
	function _recordRemovedSuccessfully(data) {
		return (data && !data.error);
	}
	
	$scope.remove = function () {
		var removeIds = helperFactory.filterFieldArrayByDone($scope.items, 'id', 1);
		
		if (removeIds.length > 0) {
			$http({
				method: 'POST',
				url : urlRemove,
				data : "ids=" + removeIds.join('|'),
				headers : {'Content-Type' : 'application/x-www-form-urlencoded'}	
			})
			.success(function (data) {
				console.log(data);
				if (_recordRemovedSuccessfully(data)) {
					$scope.items = $scope.items.filter(function(item) {
						return item.done == 0;
					});
				}
				
			})
			.error(function(data, status, headers, config){
				throw new Error('Something went wrong with removing records');						
			});
		}
	};
	
	$scope.print = function() {
		window.print();
	};
});
	