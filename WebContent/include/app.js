var app = angular.module('app', ['ui.bootstrap', 'angularSpinner', 'myTimeModule', 'treeControl', 'ui.grid', 'ui.grid.selection', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.moveColumns']);

app.config(['usSpinnerConfigProvider', function (usSpinnerConfigProvider) {
    usSpinnerConfigProvider.setDefaults({
		lines: 13, // The number of lines to draw
		  length: 5, // The length of each line
		  width: 4, // The line thickness
		  radius: 8, // The radius of the inner circle
		  corners: 1, // Corner roundness (0..1)
		  rotate: 0, // The rotation offset
		  direction: 1, // 1: clockwise, -1: counterclockwise
		  color: '#333', // #rgb or #rrggbb or array of colors
		  speed: 1, // Rounds per second
		  trail: 80, // Afterglow percentage
		  shadow: false, // Whether to render a shadow
		  hwaccel: false, // Whether to use hardware acceleration
		  className: 'spinner', // The CSS class to assign to the spinner
		  zIndex: 2e9, // The z-index (defaults to 2000000000)
		  top: '50%', // Top position relative to parent
		  left: '50%' // Left position relative to parent
		});
}]);

app.filter('titlecase', function() {
    return function(s) {
    	//console.log("Inside of titlecase...");
        s = ( s === undefined || s === null ) ? '' : s;
        return s.toString().toLowerCase().replace( /\b([a-z])/g, function(ch) {
            return ch.toUpperCase();
        });
    };
});

app.directive('focusOn', function() {
	   return function(scope, elem, attr) {
	      scope.$on(attr.focusOn, function(e) {
	          elem[0].focus();
	      });
	   };
	});

app.directive('modal', function () {
    return {
      template: '<div class="modal fade" title="">' + 
          '<div class="modal-dialog" title="">' + 
            '<div class="modal-content">' + 
              '<div class="modal-header">' + 
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="false">&times;</button>' +
                '<h4 class="modal-title">'+
                '<span class="glyphicon glyphicon-star" aria-hidden="true"></span>' + 
                '  {{ title }}</h4>' + 
              '</div>' + 
              '<div class="modal-body" ng-transclude></div>' + 
            '</div>' + 
          '</div>' + 
        '</div>',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;

        scope.$watch(attrs.visible, function(value){
          if(value == true) {
            $(element).modal('show');
          	scope.tt_isOpen = false;
          } else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
  });

app.service('ajaxService', function($http) {
	this.getData = function(URL, ajaxMethod, ajaxParams) {
		var restURL = URL + ajaxParams;
		console.log("Inside ajaxService GET...");
		console.log("Connection using URL=[" + restURL + "], Method=[" + ajaxMethod + "]");
	    // $http() returns a $promise that we can add handlers with .then()
	    return $http({
	        method: ajaxMethod,
	        url: restURL,
	     });
	 };
	 
	this.postData = function(URL, ajaxMethod, jsonData, ajaxParams) {
		var restURL = URL + ajaxParams;
		console.log("Inside ajaxService POST...");
		console.log("Connection using URL=[" + restURL + "], Method=[" + ajaxMethod + "]");
		
	    // $http() returns a $promise that we can add handlers with .then()
	    return $http({
	        method: ajaxMethod,
	        url: restURL,
	        headers: {'Content-Type': 'application/json'},
	        data: jsonData,
	     });
		
	};
});

app.directive('ngElementReady', [function() {
    return {
        priority: Number.MIN_SAFE_INTEGER, // execute last, after all other directives if any.
        restrict: "A",
        link: function($scope, $element, $attributes) {
            $scope.$eval($attributes.ngElementReady); // execute the expression in the attribute.
        }
    };
}]);

var myTimeModule = angular.module('myTimeModule', [])
// Register the 'myCurrentTime' directive factory method.
// We inject $timeout and dateFilter service since the factory method is DI.
.directive('currentTime', function($timeout, dateFilter) {
  // return the directive link function. (compile function not needed)
  return function(scope, element, attrs) {
    var timeoutId = 0; // timeoutId, so that we can cancel the time updates

    // used to update the UI
    function updateTime() {
      element.text(dateFilter(new Date(), 'MMM d, yyyy h:mm:ss a'));
    }

    // schedule update in one second
    function updateLater() {
      // save the timeoutId for canceling
      timeoutId = $timeout(function() {
        updateTime(); // update DOM
        updateLater(); // schedule another update
      }, 1000);
    }

    // listen on DOM destroy (removal) event, and cancel the next UI update
    // to prevent updating time ofter the DOM element was removed.
    element.bind('$destroy', function() {
      $timeout.cancel(timeoutId);
    });

    updateLater(); // kick off the UI update process.
  };
});

/* -----------------------------------------------------------------------
** MAIN CONTROLLER  
*-------------------------------------------------------------------------*/
app.controller('MainCtrl', function ($scope, $rootScope, $http, $log, $timeout, $modal, $filter, uiGridConstants, ajaxService, usSpinnerService) {
	
 
  $scope.modal = {};
  $scope.modal.book = {};
  
  $scope.showAddModal = false;
  $scope.showUpdateModal = false;
  
  $scope.startSpin = function(key) {
  	usSpinnerService.spin(key);
  };
  
  $scope.stopSpin = function(key) {
  	usSpinnerService.stop(key);
  };
 
  $scope.setTitleCase = function(input) {
  	if (input != null ) {
 			return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  	}
  };

  $scope.setLowerCase = function(input) {
  	if (input != null ) {
 			return input.replace(/\w\S*/g, function(txt){return txt.toLowerCase();});
  	}
  };

  $scope.setUpperCase = function(input) {
	  	if (input != null ) {
	 		return input.replace(/\w\S*/g, function(txt){return txt.toUpperCase();});
	  	}
	  };
  
  $scope.currentTimeMillis = function(ts) {
	  var date = new Date().getTime();
	  return date;
  };
  
  $scope.setDefaults = function(debugFlag, baseUrl) {
	  categoryLoadUrl 	= baseUrl + "/bookstore/rest/findbycategory?";
	  titleLoadUrl		= baseUrl + "/bookstore/rest/findbytitle?";
	  getAllBooksUrl	= baseUrl + "/bookstore/rest/books";
	  getBookByISBNUrl	= baseUrl + "/bookstore/rest/getbookbyisbn?";
	  createBookUrl		= baseUrl + "/bookstore/rest/book/add?";
	  editBookUrl		= baseUrl + "/bookstore/rest/book/update?";
	  allCategoriesUrl	= baseUrl + "/bookstore/rest/categories?";
	  
	  console.log("Setting Defaults");
	  console.log("DebugFlag..........: " + debugFlag);
	  console.log("categoryLoadUrl....: " + categoryLoadUrl);
	  console.log("titleLoadUrl.......: " + titleLoadUrl);
	  console.log("createBookUrl......: " + createBookUrl);
	  console.log("editBookUrl........: " + editBookUrl);
	  console.log("getAllBooksUrl.....: " + getAllBooksUrl);
	  console.log("allCategoriesUrl...: " + allCategoriesUrl);
	  
	  $scope.debugFlag = debugFlag;
	  $scope.baseUrl = baseUrl;
	  $scope.criteria = {};
	  $scope.criteria.title = '';
	  $scope.showCreateModal = false;
	  $scope.showUpdateModal = false;
	  $scope.showDeleteModal = false;
  };

  $scope.$on('$viewContentLoaded', function() {
	  console.log("viewContentLoaded event triggered...");
	  loadUserDefaults();
  });
  
  $scope.showCreateBook= function () {
	  $scope.modal = {};
	  $scope.modal.book = {};
	  $scope.showCreateModal = true;  
  }
  
  $scope.getAllBooks = function () {
  	var url = getAllBooksUrl;
	
  	$scope.startSpin('spinner-3');
  	console.log("Inside getAllBooks " + url);

	function onSuccess(response) {
		console.log("+++++getAllBooks SUCCESS++++++");
		if ($scope.debugFlag == 'true') {
			console.log("Inside getAllBooks response..." + JSON.stringify(response.data));
		} else {
			console.log("Inside getAllBooks response...(XML response is being skipped, debug=false)");
		}
		if (response.data.success != false) { 
			$scope.gridOptions.data = response.data;
		} else {
			$scope.gridOptions.data = [];
		}
		$scope.stopSpin('spinner-3');
	};
		
	function onError(response) {
		console.log("-------getAllBooks FAILED-------");
		$scope.stopSpin('spinner-3');
		console.log("Inside getAllBooks error condition...");
	};
	  
  	//----MAKE AJAX REQUEST CALL to GET DATA----
  	ajaxService.getData(url, 'GET', '').then(onSuccess, onError);
		
	};
	
	//---Cancel Modal Dialog Window---
	$scope.cancel = function () {
		console.log('Closing Modal Dialog Window...');
		$scope.showCreateModal = false;
		$scope.showUpdateModal = false;
		$scope.showDeleteModal = false;
	};

	$scope.showModalWindow = function (title, message, size) {
		$modal.open({
			animation: true,
			templateUrl: 'myModalContent.html',
			controller: 'ModalInstanceCtrl',
			scope: $scope,
			windowClass: 'center-modal',
			size: size
		});
		
		$scope.modal.title = title;
		$scope.modal.message = message;
	};
	
	$scope.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
		if( col.filters[0].term ) {
			return 'header_filtered';
		} else {
			return 'header_text';
		}
	};
  
	$scope.gridOptions = { 
		enableFiltering: true,
		enableCellEditOnFocus: false,
		enablePaginationControls: true,
		enableSorting: true,
		enableRowSelection: true,
		enableRowHeaderSelection: false,
		enableColumnResizing: true,
		paginationPageSizes: [10, 12, 15, 18],	//18
		paginationPageSize: 18,				//18
  };

	$scope.gridOptions.onRegisterApi = function(gridApi){
		//set gridApi on scope
		$scope.gridApi = gridApi;
		gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
			console.log('edited row uid:' + rowEntity.isbn13 + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue );
			$scope.$apply();
		});
	};
    
	$scope.gridOptions.multiSelect = false;

	//---Create Modal Dialog Window---
	$scope.createBook = function () {
		console.log('Inside createBook...');
		$scope.startSpin('spinner-4');
		
		
		createUrl = createBookUrl + "isbn13=" + $scope.modal.book.isbn13;
		createUrl += '&etc=' + new Date().getTime();

		console.log("createBook..: " + createUrl);
		
		$scope.modal.book.id = $scope.modal.book.isbn13;
		console.log("$scope.modal.book.id..........: " + $scope.modal.book.id);
		console.log("$scope.modal.book.isbn13..........: " + $scope.modal.book.isbn13);
		console.log("$scope.modal.book.title...........: " + $scope.modal.book.title);
		console.log("$scope.modal.book.author..........: " + $scope.modal.book.author);
		console.log("$scope.modal.book.publisher.......: " + $scope.modal.book.publisher);
		console.log("$scope.modal.book.isbn10..........: " + $scope.modal.book.isbn10);
		console.log("$scope.modal.book.description.....: " + $scope.modal.book.description);
		console.log("$scope.modal.book.dimensions......: " + $scope.modal.book.dimensions);
		console.log("$scope.modal.book.shippingWeight..: " + $scope.modal.book.shippingWeight);
		console.log("$scope.modal.book.language........: " + $scope.modal.book.language);
		console.log("$scope.modal.book.category........: " + $scope.modal.book.category);
		console.log("$scope.modal.book.active..........: " + $scope.modal.book.active);
		console.log("$scope.modal.book.quantity........: " + $scope.modal.book.quantity);
		console.log("$scope.modal.book.price...........: " + $scope.modal.book.price);

		if ($scope.debugFlag == 'true') {
			console.log("$scope.modal.book...: " + angular.toJson($scope.modal.book, true));
		}
		
		
		 function onSuccess(response) {
			console.log("+++++createBook SUCCESS++++++");

			if ($scope.debugFlag == 'true') {
				console.log("Inside createBook response..." + JSON.stringify(response.data));
			} else {
				console.log("Inside createBook response...(XML response is being skipped, debug=false)");
			}
			if (response.data.success == false) {
				$scope.showModalWindow('Error!', response.data.message, 'sm');
			} else {
				$scope.showCreateModal = false;				
			}
			$scope.stopSpin('spinner-4');
		};
	
		function onError(response) {
			console.log("-------createBook FAILED-------");
			$scope.stopSpin('spinner-4');
			console.log("Inside createBook error condition...");
			$scope.showModalWindow('Error!', response.data.message, 'sm');
		};

		//----MAKE AJAX REQUEST CALL to POST DATA----
		ajaxService.postData(createUrl, 'POST', $scope.modal.book, '').then(onSuccess, onError);
		
	};
	//---Update Modal Dialog Window---
	$scope.updateBook = function (isbn13) {
		console.log('Inside updateBook...' + isbn13);
		$scope.startSpin('spinner-4');
		
		updateBookUrl = editBookUrl + "isbn13=" + isbn13;
		console.log("updateBook..: " + updateBookUrl);
		if ($scope.debugFlag == 'true') {
			console.log("$scope.modal.book...: " + angular.toJson($scope.modal.book, true));
		}
		
		function onSuccess(response) {
			console.log("+++++updateBook SUCCESS++++++");
			$scope.modal.row.entity.isbn13 = $scope.modal.book.isbn13;
			$scope.modal.row.entity.title = $scope.modal.book.title;
			$scope.modal.row.entity.author = $scope.modal.book.author;
			$scope.modal.row.entity.publisher = $scope.modal.book.publisher;
			$scope.modal.row.entity.isbn10 = $scope.modal.book.isbn10;
			$scope.modal.row.entity.dimensions = $scope.modal.book.dimensions;
			$scope.modal.row.entity.active = $scope.modal.book.active;
			$scope.modal.row.entity.price = $scope.modal.book.price;

			if ($scope.debugFlag == 'true') {
				console.log("Inside updateBook response..." + JSON.stringify(response.data));
			} else {
				console.log("Inside updateBook response...(XML response is being skipped, debug=false)");
			}
			if (response.data.success == false) {
				$scope.showModalWindow('Error!', response.data.message, 'sm');
			}
			$scope.stopSpin('spinner-4');
			$scope.showUpdateModal = false;
		};
	
		function onError(response) {
			console.log("-------updateBook FAILED-------");
			$scope.stopSpin('spinner-4');
			console.log("Inside updateBook error condition...");
			$scope.showModalWindow('Error!', response.data.message, 'sm');
		};

		//----MAKE AJAX REQUEST CALL to POST DATA----
		ajaxService.postData(updateBookUrl, 'PUT', $scope.modal.book, '').then(onSuccess, onError);
		
	};

	$scope.editBook = function(isbn13, row) {
		$scope.startSpin('spinner-4');

		console.log('Inside editBook: ' + isbn13);
		
		getBookURL = getBookByISBNUrl;
		getBookURL += "isbn13=" + isbn13;
		getBookURL += '&etc=' + new Date().getTime();
		
		console.log("getBookURL.........: " + getBookURL);
		
		
		//----- Get Book by ISBN13------
		
		function onSuccess(response) {
			console.log("+++++editBook SUCCESS++++++");
			if ($scope.debugFlag == 'true') {
				console.log("Inside editBook response..." + JSON.stringify(response.data));
			} else {
				console.log("Inside editBook response...(XML response is being skipped, debug=false)");
			}
			if (response.data.success == false) {
				$scope.showModalWindow('Error!', response.message, 'sm');
			} else {
				$scope.modal.row = row;
				$scope.modal.book.id = response.data.isbn13;
				$scope.modal.book.isbn13 = response.data.isbn13;
				$scope.modal.book.title = response.data.title;
				$scope.modal.book.author = response.data.author;
				$scope.modal.book.publisher = response.data.publisher;
				$scope.modal.book.isbn10 = response.data.isbn10;
				$scope.modal.book.dimensions = response.data.dimensions;
				$scope.modal.book.quantity = response.data.quantity;
				$scope.modal.book.description = response.data.description;
				$scope.modal.book.active = response.data.active;
				$scope.modal.book.shippingWeight = response.data.shippingWeight;
				$scope.modal.book.language = response.data.language;
				$scope.modal.book.price = response.data.price;
				$scope.showUpdateModal = true;
				if ($scope.debugFlag == 'true') {
					console.log(angular.toJson($scope.modal.book, true));
				}
			}
			$scope.stopSpin('spinner-4');
		};
	
		function onError(response) {
			console.log("-------editBook FAILED-------");
			$scope.stopSpin('spinner-4');
			console.log("Inside editBook error condition...");
			$scope.showModalWindow('Error!', response.data.message, 'sm');
		};

		//----MAKE AJAX REQUEST CALL to POST DATA----
		ajaxService.getData(getBookURL, 'GET', '').then(onSuccess, onError);
				
	};
	
	$scope.deleteModal = function (row, isbn13, title) {
		console.log('Inside of deleteModal, isbn13 = ' + isbn13);
		$scope.modal = {};
		$scope.modal.book = {};
		
		$scope.modal.row = row;
		$scope.modal.book.isbn13 = isbn13;
		$scope.modal.book.title = title;
		$scope.showDeleteModal = true;
	};
	
	$scope.deleteBook = function (row, isbn13) {
		console.log('Inside of deleteBook, isbn13 = ' + isbn13);
		
	};
	
	$scope.deleteBookFromGrid = function (row, isbn13) {
		var index = $scope.gridOptions.data.indexOf(row.entity);
		$scope.gridOptions.data.splice(index, 1);
		$scope.showDeleteModal = false;
	};	

  $scope.gridOptions.columnDefs = [
	{ name: 'isbn13', 
		headerCellClass: $scope.highlightFilteredHeader, 
		cellTemplate:'<div class="editBook1"><a class="editBook" href="" ng-click="$event.stopPropagation(); grid.appScope.editBook(row.entity.isbn13, row);">'
			+ '{{row.entity[col.field] | uppercase }}&nbsp; <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a></div>',
		cellClass: 'gridField', 
		displayName: 'ISBN13', 
		width: 140, 
		maxWidth: 160, 
		minWidth: 130, 
		enableHiding: false, 
		enableCellEdit: false },
	{ name: 'title', 
		headerCellClass: $scope.highlightFilteredHeader , 
		cellTemplate: '<div class="padded">{{row.entity.title}}</div>',
		cellClass: 'gridField', 
		displayName: 'Title', 
		width: 250, 
		maxWidth: 480, 
		minWidth: 220, 
		enableHiding: false, 
		enableCellEdit: false },
	{ name: 'author',
		headerCellClass: $scope.highlightFilteredHeader,
		cellTemplate: '<div class="centered">{{row.entity.author | titlecase }}</div>',
		cellClass: 'gridField', 
		width: 160, 
		maxWidth: 200, 
		minWidth: 120, 
		enableHiding: false, 
		enableCellEdit: false },
	{ name: 'publisher', 
		headerCellClass: $scope.highlightFilteredHeader, 
		cellTemplate: '<div class="padded">{{row.entity.publisher | titlecase }}</div>',
		cellClass: 'gridField', 
		width: 90, 
		maxWidth: 200, 
		minWidth: 90, 
		enableHiding: false, 
		enableCellEdit: false },
	{ name: 'isbn10', 
		headerCellClass: $scope.highlightFilteredHeader, 
		cellTemplate: '<div class="centered">{{row.entity.isbn10}}</div>',
		cellClass: 'gridField', 
		displayName: 'ISBN10', 
		width: 80, 
		maxWidth: 140, 
		minWidth: 70, 
		enableHiding: false, 
		enableCellEdit: false },
	{ name: 'dimensions', 
		headerCellClass: $scope.highlightFilteredHeader, 
		cellTemplate: '<div class="padded">{{ row.entity.dimensions }}</div>',
		cellClass: 'gridField', 
		width: 130, 
		maxWidth: 220, 
		minWidth: 120, 
		enableHiding: false, 
		enableCellEdit: false },
	{ name: 'active', 
		headerCellClass: $scope.highlightFilteredHeader, 
		cellClass: 'gridField', 
		displayName: 'Is Active', 
		width: 70, 
		maxWidth: 120, 
		minWidth: 60, 
		enableHiding: false, 
		//type: 'boolean', 
		enableCellEdit: false, 
		cellTemplate: '<div class="isActive">'
			+ '<a class="isActive" href="" ng-click="$event.stopPropagation(); row.entity.isactive=grid.appScope.toggleIsActive(row, row.entity.active);">' 
			+ '<span ng-class="row.entity[col.field] ? \'checkIcon\' : \'xIcon\'">'
			+ '<span ng-if="row.entity[col.field]">Yes</span>'
			+ '<span ng-if="!row.entity[col.field]">No</span>'
			+ '</span></a></div>'},
	{ name: 'price', 
		headerCellClass: $scope.highlightFilteredHeader, 
		cellClass: 'gridField', 
		displayName: 'Price', 
		width: 60, 
		maxWidth: 120, 
		minWidth: 50, 
		enableHiding: false, 
		enableCellEdit: false
	}, 
	{ name: 'delete', 
		headerCellClass: $scope.highlightFilteredHeader, 
		cellClass: 'gridField', 
		displayName: 'Del', 
		width: 40, 
		maxWidth: 40, 
		minWidth: 40, 
		enableHiding: false, 
		enableCellEdit: false, 
		cellTemplate: '<div class="centered"><button id="cancel" type="button" class="btn btn-danger btn-xs" ng-click="$event.stopPropagation(); grid.appScope.deleteModal(row, row.entity.isbn13, row.entity.title)"><span class="glyphicon glyphicon-remove"></span></button></div>'		
	}
  ];

  $scope.gridOptions.data = [];
	  

/* -----------------------------------------------------------------------
* CATEGORIES TREE  
--------------------------------------------------------------------------*/

	$scope.criteria = {};
	$scope.reverse = true;
	
	$scope.treeOptions = {
	    nodeChildren: "item",
	    dirSelectable: true
	};
	
	$scope.defaultData = [  { "text" : "All Books", "id" : "all", "item" : [] },
	                     { "text" : "Books #1", "id" : "1", "item" : [
	                       { "text" : "Books #2", "id" : "2", "item" : [] },
	                       { "text" : "Books #3", "id" : "3", "item" : [] },
	                       { "text" : "Books #4", "id" : "4", "item" : [] },
	                       { "text" : "Books #5", "id" : "5", "item" : [] }
	                     ]},
	                     { "text" : "Books #6", "id" : "6", "item" : [] },
	                     { "text" : "Books #7", "id" : "7", "item" : [] }
	                   ];
	
	$scope.companyList = function() {
		return $scope.treedata;
	};

	$scope.node = function(num) {
		$scope.treedata = num;
		return $scope.treedata;
	};
	
	$scope.clearNode = function() {
		$scope.node = undefined;
	};
	
	$scope.getDefaultTreeData = function() {
		return $scope.defaultData;
	};
	
	$scope.processSelectedTreeNode = function (node) {
		var gridUrl, addl_params;
		
		
		if (node.id == '0') {
			gridUrl = titleLoadUrl;
			addl_params = 'title=' + $scope.criteria.title
				+ '&etc=' + new Date().getTime();
		} else {
			gridUrl = categoryLoadUrl;
			addl_params = '&category=' + node.id 
				+ '&title=' + $scope.criteria.title
				+ '&etc=' + new Date().getTime();
		}
		$scope.startSpin('spinner-3');
		
		console.log("Inside processSelectedTreeNode Selected node is " + node.id);

		function onSuccess(response) {
			console.log("+++++processSelectedTreeNode SUCCESS++++++");
			if ($scope.debugFlag == 'true') {
				console.log("Inside processSelectedTreeNode response..." + JSON.stringify(response.data));
			} else {
				console.log("Inside processSelectedTreeNode response...(XML response is being skipped, debug=false)");
			}
			if (response.data.success != false) { 
				console.log("response 'success'.."); 
				$scope.gridOptions.data = response.data;
			} else {
				console.log("response came back with 404!!!!"); 				
				$scope.gridOptions.data = [];
				$scope.showModalWindow('Error!', response.data.message, '');
				//dlg = $dialogs.error('This is my error message');
			}
			$scope.stopSpin('spinner-3');
		};
		
		function onError(response) {
			console.log("-------processSelectedTreeNode FAILED-------");
			$scope.stopSpin('spinner-3');
			console.log("Inside processSelectedTreeNode error condition...");
		};
		
		//----MAKE AJAX REQUEST CALL to GET DATA----
		ajaxService.getData(gridUrl, 'GET', addl_params).then(onSuccess, onError);			
	};

	$scope.treeUnset = function() {
		console.log("Inside of treeUnset...");
		$scope.clearNode();
	};
	
	$scope.resetForm = function () {
		//$scope.treeUnset();
		//$scope.treedata = [];
		$scope.criteria = {};
		$scope.criteria.title = '';
		$scope.gridOptions.data = [];
		$scope.$broadcast('setFocus');
	};

	$scope.greaterThan = function(id, val){
	    return function(category){
	      return category[id] > val;
	    }
	};
	
	$scope.getAllCategories = function () {
		var url = allCategoriesUrl;

  	  	console.log("Inside getAllCategories...");
			
		function onSuccess(response) {
			if ($scope.debugFlag == 'true') {
				console.log("Inside getAllCategories response..." + JSON.stringify(response.data));
			} else {
				console.log("Inside getAllCategories response...(XML response is being skipped, debug=false)");
			}
			$scope.treedata = response.data;
			$rootScope.treedata = response.data;
			//console.log("$rootScope.treedata: " + JSON.stringify($rootScope.treedata));
			$scope.stopSpin('spinner-2');
		};
		
		function onError(response) {
			$scope.stopSpin('spinner-2');
			console.log("Inside getAllCategories error condition...");
		};
		
		$scope.gridOptions.data = [];
		// Clear TreeView Selected Node
		$scope.treeUnset();
		$rootScope.treedata = [];
		$scope.treedata = [];
		
		$scope.startSpin('spinner-2');
		console.log("Inside getAllCategories..." + url);
		var addl_params ='etc='+new Date().getTime();
		
		console.log("$scope.criteria.title.............: " + $scope.criteria.title);
		
		//----MAKE AJAX REQUEST CALL to GET DATA----
		ajaxService.getData(url, 'GET', addl_params).then(onSuccess, onError);
			
	};
	
	$scope.processSelectedCriteria = function () {
  	  	console.log("titleSearch----> " + JSON.stringify($scope.titleData));

		if ($scope.criteria.title != null && $scope.criteria.title.length >0) {
			$scope.getAllCategories();
		} else {
			// Length is not long enough 
			$scope.showModalWindow('Title Search Error!', 'The Title Search Criteria Field may NOT be empty.', 'sm');
			console.log("Inside processSelectedCriteria, broadcasting setFocus event...");
			$scope.$broadcast('setFocus');
		}
	};
});

/* -----------------------------------------------------------------------
* MODAL DIALOG WINDOW CONTROLLER  
--------------------------------------------------------------------------*/
app.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {
  $scope.ok = function () {
    $modalInstance.dismiss('cancel');
  };
});

	  
