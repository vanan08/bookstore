<%@ page language="java" %>

<html ng-app="app">
<head>
	<meta http-equiv="cache-control" content="max-age=0" />
	<meta http-equiv="cache-control" content="no-cache" />
	<meta http-equiv="expires" content="0" />
	<meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
	<meta http-equiv="pragma" content="no-cache" />	
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	
	<!--[if lte IE 7]>
		<style type="text/css"> body { font-size: 85%; } </style>
	<![endif]-->

	<!-- 1.3.15 -->
	<script src="include/angular.js"></script>
	<script src="include/angular-touch.js"></script>
	<script src="include/angular-animate.js"></script>
	<script src="include/app.js"></script>
	<script src="include/jquery-1.11.3.js"></script>
	<script src="include/jquery.layout.js"></script>
	<script src="include/spin.js"></script>
	<script src="include/angular-spinner.js"></script>
	<script src="include/angular-tree-control.js"></script>
	<script src="include/vfs_fonts.js"></script>
	<script src="include/ui-grid-unstable.js"></script>
	<link rel="stylesheet" href="include/ui-grid-unstable.css">
	<link rel="stylesheet" href="include/font-awesome.min.css">
	
	<script src="include/ui-bootstrap-tpls-0.13.0.min.js"></script>
	<script src="include/bootstrap.js"></script>
	<link rel="stylesheet" href="include/bootstrap.css">
	
	<link rel="styleSheet" href="include/tree-control.css" />
	<link rel="styleSheet" href="include/tree-control-attribute.css" />
	<link rel="styleSheet" href="include/styles.css" />
</head>

<%
	// This is JSP code to define RESTful call URL to get Manager List JSON data
	// can be replaced with any other way that you're using to define RESTful URL with parameters
	String fullProtocol = request.getProtocol().toLowerCase();
	String protocol[] = fullProtocol.split("/");
	String baseUrl = protocol[0]+"://" + request.getHeader("Host");
	String params = "";

	boolean isDebug = false;
	String debugParam = request.getParameter("debug");
	if (debugParam != null && (debugParam.toLowerCase().equals("true") || 
															debugParam.toLowerCase().equals("yes") || 
															debugParam.equals("1"))) {
		isDebug = true;
	}
%>

<body ng-controller="MainCtrl">
	<span us-spinner="{color: 'red', radius:30, width:8, length: 16}" spinner-key="spinner-0"></span>
	<script type="text/ng-template" id="myModalContent.html">
	<div class="modal-header-error">
		<h4 class="modal-title-error"><span class="glyphicon glyphicon-alert" aria-hidden="true"></span>  {{modal.title}}</h4>
	</div>
	<div class="modal-body">
		<b>{{modal.message}}</b>
	</div>
	<div class="modal-footer">
		<button class="btn btn-danger" ng-click="ok()">OK</button>
	</div>
	</script>
	
	<modal title="&nbsp; Create Book" visible="showCreateModal">
		<span us-spinner spinner-key="spinner-4"></span>
		<form class="form-horizontal" name="myform" novalidate>  
	    <div class="form-group has-feedback" ng-class="{'has-error': myform.isbn13.$invalid, 'has-success': myform.isbn13.$valid}">
				<label class="control-label col-sm-3" for="isbn13">ISBN13</label>
				<div class="col-sm-4">
					<input type="text" class="form-control" name="isbn13" ng-model="modal.book.isbn13"  placeholder="Enter ISBN13">
	      	<i class="form-control-feedback" ng-class="{'glyphicon glyphicon-ok': myform.isbn13.$valid, 'glyphicon glyphicon-remove': myform.isbn13.$invalid}" ></i>
				</div>
	    </div>

	    <div class="form-group has-feedback" ng-class="{'has-error': myform.title.$invalid, 'has-success': myform.title.$valid}">
				<label class="control-label col-sm-3" for="title">Title</label>
				<div class="col-sm-8">
					<input type="text" class="form-control" name="title" required ng-model="modal.book.title"  placeholder="Book Title">
	      	<i class="form-control-feedback" ng-class="{'glyphicon glyphicon-ok': myform.title.$valid, 'glyphicon glyphicon-remove': myform.title.$invalid}" ></i>
				</div>
			</div>

     	<div class="form-group has-feedback" ng-class="{'has-error': myform.author.$invalid, 'has-success': myform.author.$valid}">
				<label class="control-label col-sm-3" for="author">Author</label>
				<div class="col-sm-6">
					<input type="text" class="form-control" name="author" required ng-model="modal.book.author"  placeholder="Book Author">
	      	<i class="form-control-feedback" ng-class="{'glyphicon glyphicon-ok': myform.author.$valid, 'glyphicon glyphicon-remove': myform.author.$invalid}" ></i>
				</div>
     	</div>
     	
     	<div class="form-group has-feedback" ng-class="{'has-error': myform.publisher.$invalid, 'has-success': myform.publisher.$valid}">
				<label class="control-label col-sm-3" for="publisher">Publisher</label>
				<div class="col-sm-6">
					<input type="text" class="form-control" name="publisher" required ng-model="modal.book.publisher"  placeholder="Book Publisher">
	      	<i class="form-control-feedback" ng-class="{'glyphicon glyphicon-ok': myform.publisher.$valid, 'glyphicon glyphicon-remove': myform.publisher.$invalid}" ></i>
				</div>
     	</div>
	     				     
     	<div class="form-group has-feedback" ng-class="{'has-error': myform.isbn10.$invalid, 'has-success': myform.isbn10.$valid}">
				<label class="control-label col-sm-3" for="isbn10">ISBN10</label>
				<div class="col-sm-4">
					<input type="text" class="form-control" name="isbn10" required ng-model="modal.book.isbn10"  placeholder="Enter ISBN10">
	      	<i class="form-control-feedback" ng-class="{'glyphicon glyphicon-ok': myform.isbn10.$valid, 'glyphicon glyphicon-remove': myform.isbn10.$invalid}" ></i>
				</div>
     	</div>

			<div class="form-group" >
				<label class="control-label col-sm-3" for="description">Description</label>
				<div class="col-sm-8">
					<textarea class="form-control" name="description" rows="3" cols="70" ng-model="modal.book.description"  placeholder="Description">
					</textarea>
				</div>
	    </div>
     	
			<div class="form-group" >
				<label class="control-label col-sm-3" for="dimensions">Dimensions</label>
				<div class="col-sm-6">
					<input type="text" class="form-control" name="dimensions" ng-model="modal.book.dimensions"  placeholder="Dimension" />
				</div>
	    </div>

			<div class="form-group" >
				<label class="control-label col-sm-3" for="shippingWeight">Shipping Weight</label>
				<div class="col-sm-6">
					<input type="text" class="form-control" name="shippingWeight" ng-model="modal.book.shippingWeight"  placeholder="Shipping Weight" />
				</div>
	    </div>
	    
	    <div class="form-group has-feedback" ng-class="{'has-error': myform.language.$invalid, 'has-success': myform.language.$valid}">
				<label class="control-label col-sm-3" for="language">Language</label>
				<div class="col-sm-4">
		      <select class="form-control" name="language" required ng-model="modal.book.language">
						<option value=""></option>
						<option value="arabic">Arabic</option>
						<option value="chinese">Chinese</option>
						<option value="english">English</option>
						<option value="french">French</option>
						<option value="hebrew">Hebrew</option>
						<option value="italian">Italian</option>
						<option value="japanese">Japanese</option>
						<option value="portuguese">Portuguese</option>
						<option value="spanish">Spanish</option>
	      	</select>
	      	<i class="form-control-feedback" ng-class="{'glyphicon glyphicon-ok': myform.language.$valid, 'glyphicon glyphicon-remove': myform.language.$invalid}" ></i>
				</div>
	     </div>
	     
			<div class="form-group" >
				<label class="control-label col-sm-3" for="active">Is Active</label>
				<div class="col-sm-7">
					<label><input type="radio" name="active" ng-model="modal.book.active" ng-value="true">True</label>
					<label><input type="radio" name="active" ng-model="modal.book.active" ng-value="false">False</label>
				</div>
	    </div>
	    
	    <div class="form-group has-feedback" ng-class="{'has-error': myform.category.$invalid, 'has-success': myform.category.$valid}">
				<label class="control-label col-sm-3" for="category">Category</label>
				<div class="col-sm-6">
		      <select class="form-control" name="category" required ng-model="modal.book.category" ng-options="category.id as category.text for category in treedata | filter: greaterThan('id', 0)" >
					</select>
	      	<i class="form-control-feedback" ng-class="{'glyphicon glyphicon-ok': myform.category.$valid, 'glyphicon glyphicon-remove': myform.category.$invalid}" ></i>
				</div>
			</div>
			
	    <div class="form-group has-feedback" ng-class="{'has-error': myform.quantity.$invalid, 'has-success': myform.quantity.$valid}">
				<label class="control-label col-sm-3" for="quantity">Quantity</label>
				<div class="col-sm-4">
					<input type="number" class="form-control" name="quantity" min="0" step="1" required ng-model="modal.book.quantity"  placeholder="Enter Quantity">
	      	<i class="form-control-feedback" ng-class="{'glyphicon glyphicon-ok': myform.quantity.$valid, 'glyphicon glyphicon-remove': myform.quantity.$invalid}" ></i>
				</div>
     	</div>
     	
	    <div class="form-group has-feedback" ng-class="{'has-error': myform.price.$invalid, 'has-success': myform.price.$valid}">
				<label class="control-label col-sm-3" for="price">Price</label>
				<div class="col-sm-4">
					<input type="number" class="form-control" name="price" min="0" step="0.01" required ng-model="modal.book.price"  placeholder="Book Price">
	      	<i class="form-control-feedback" ng-class="{'glyphicon glyphicon-ok': myform.price.$valid, 'glyphicon glyphicon-remove': myform.price.$invalid}" ></i>
				</div>
     	</div>
			
			<div class="dialogButtons">
	     	<button id="create" type="submit" class="btn btn-success" ng-click="createBook()" ng-disabled="myform.$invalid" ><i class="fa fa-book"></i> Create</button>
	     	<button id="cancel" type="button" class="btn btn-success" ng-click="cancel()"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Close</button>
	    </div>
		</form>
	</modal>
	
	<modal title="&nbsp; Update Book" visible="showUpdateModal">
		<span us-spinner spinner-key="spinner-4"></span>
		<form class="form-horizontal" name="myform" novalidate>  
	    <div class="form-group has-feedback" ng-class="{'has-error': myform.isbn13.$invalid, 'has-success': myform.isbn13.$valid}">
				<label class="control-label col-sm-3" for="isbn13">ISBN13</label>
				<div class="col-sm-4">
					<input type="text" class="form-control" name="isbn13" disabled ng-model="modal.book.isbn13"  placeholder="Enter ISBN13">
	      	<i class="form-control-feedback" ng-class="{'glyphicon glyphicon-ok': myform.isbn13.$valid, 'glyphicon glyphicon-remove': myform.isbn13.$invalid}" ></i>
				</div>
	    </div>

	    <div class="form-group has-feedback" ng-class="{'has-error': myform.title.$invalid, 'has-success': myform.title.$valid}">
				<label class="control-label col-sm-3" for="title">Title</label>
				<div class="col-sm-8">
					<input type="text" class="form-control" name="title" required ng-model="modal.book.title"  placeholder="Book Title">
	      	<i class="form-control-feedback" ng-class="{'glyphicon glyphicon-ok': myform.title.$valid, 'glyphicon glyphicon-remove': myform.title.$invalid}" ></i>
				</div>
			</div>

     	<div class="form-group has-feedback" ng-class="{'has-error': myform.author.$invalid, 'has-success': myform.author.$valid}">
				<label class="control-label col-sm-3" for="author">Author</label>
				<div class="col-sm-6">
					<input type="text" class="form-control" name="author" required ng-model="modal.book.author"  placeholder="Book Author">
	      	<i class="form-control-feedback" ng-class="{'glyphicon glyphicon-ok': myform.author.$valid, 'glyphicon glyphicon-remove': myform.author.$invalid}" ></i>
				</div>
     	</div>
     	
     	<div class="form-group has-feedback" ng-class="{'has-error': myform.publisher.$invalid, 'has-success': myform.publisher.$valid}">
				<label class="control-label col-sm-3" for="publisher">Publisher</label>
				<div class="col-sm-6">
					<input type="text" class="form-control" name="publisher" required ng-model="modal.book.publisher"  placeholder="Book Publisher">
	      	<i class="form-control-feedback" ng-class="{'glyphicon glyphicon-ok': myform.publisher.$valid, 'glyphicon glyphicon-remove': myform.publisher.$invalid}" ></i>
				</div>
     	</div>
	     				     
     	<div class="form-group has-feedback" ng-class="{'has-error': myform.isbn10.$invalid, 'has-success': myform.isbn10.$valid}">
				<label class="control-label col-sm-3" for="isbn10">ISBN10</label>
				<div class="col-sm-4">
					<input type="text" class="form-control" name="isbn10" required ng-model="modal.book.isbn10"  placeholder="Enter ISBN10">
	      	<i class="form-control-feedback" ng-class="{'glyphicon glyphicon-ok': myform.isbn10.$valid, 'glyphicon glyphicon-remove': myform.isbn10.$invalid}" ></i>
				</div>
     	</div>

			<div class="form-group" >
				<label class="control-label col-sm-3" for="description">Description</label>
				<div class="col-sm-8">
					<textarea class="form-control" name="description" rows="3" cols="70" ng-model="modal.book.description"  placeholder="Description">
					</textarea>
				</div>
	    </div>
     	
			<div class="form-group" >
				<label class="control-label col-sm-3" for="dimensions">Dimensions</label>
				<div class="col-sm-6">
					<input type="text" class="form-control" name="dimensions" ng-model="modal.book.dimensions"  placeholder="Dimensions" />
				</div>
	    </div>

			<div class="form-group" >
				<label class="control-label col-sm-3" for="shippingWeight">Shipping Weight</label>
				<div class="col-sm-6">
					<input type="text" class="form-control" name="shippingWeight" ng-model="modal.book.shippingWeight"  placeholder="Shipping Weight" />
				</div>
	    </div>
	    
	    <div class="form-group has-feedback" ng-class="{'has-error': myform.language.$invalid, 'has-success': myform.language.$valid}">
				<label class="control-label col-sm-3" for="language">Language</label>
				<div class="col-sm-4">
		      <select class="form-control" name="language" required ng-model="modal.book.language">
						<option value=""></option>
						<option value="arabic">Arabic</option>
						<option value="chinese">Chinese</option>
						<option value="english">English</option>
						<option value="french">French</option>
						<option value="hebrew">Hebrew</option>
						<option value="italian">Italian</option>
						<option value="japanese">Japanese</option>
						<option value="portuguese">Portuguese</option>
						<option value="spanish">Spanish</option>
	      	</select>
	      	<i class="form-control-feedback" ng-class="{'glyphicon glyphicon-ok': myform.language.$valid, 'glyphicon glyphicon-remove': myform.language.$invalid}" ></i>
				</div>
	     </div>
	     
			<div class="form-group" >
				<label class="control-label col-sm-3" for="active">Is Active</label>
				<div class="col-sm-7">
					<label><input type="radio" name="active" ng-model="modal.book.active" ng-value="true">True</label>
					<label><input type="radio" name="active" ng-model="modal.book.active" ng-value="false">False</label>
				</div>
	    </div>
	     
	    <div class="form-group has-feedback" ng-class="{'has-error': myform.price.$invalid, 'has-success': myform.price.$valid}">
				<label class="control-label col-sm-3" for="price">Price</label>
				<div class="col-sm-4">
					<input type="number" class="form-control" name="price" min="0" step="0.01" required ng-model="modal.book.price"  placeholder="Book Price">
	      	<i class="form-control-feedback" ng-class="{'glyphicon glyphicon-ok': myform.price.$valid, 'glyphicon glyphicon-remove': myform.price.$invalid}" ></i>
				</div>
     	</div>
			
			<div class="dialogButtons">
	     	<button id="update" type="submit" class="btn btn-success" ng-click="updateBook(modal.book.isbn13)" ng-disabled="myform.$invalid" ><i class="fa fa-book"></i> Update</button>
	     	<button id="cancel" type="button" class="btn btn-success" ng-click="cancel()"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Close</button>
	    </div>
		</form>
	</modal>
	
		<modal title="&nbsp; Delete Book" visible="showDeleteModal">
		<form class="form-horizontal" name="myform" novalidate>  
		
			<div class="form-group" >
				<label class="control-label col-sm-2" for="isbn13">ISBN13</label>
				<div class="col-sm-5">
					<input type="text" class="form-control" disabled name="isbn13" ng-model="modal.book.isbn13" />
				</div>
	    </div>
	    
	    <div class="form-group" >
				<label class="control-label col-sm-2" for="title">Title</label>
				<div class="col-sm-8">
					<input type="text" class="form-control" disabled name="title" disabled ng-model="modal.book.title">
				</div> 
			</div>
			
			<div class="dialogButtons">
	     	<button id="delete" type="submit" class="btn btn-danger" ng-click="deleteBook(modal.row, modal.book.isbn13)" ng-disabled="myform.$invalid" ><i class="fa fa-book"></i> Delete</button>
	     	<button id="cancel" type="button" class="btn btn-success" ng-click="cancel()"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Close</button>
	    </div>
		</form>
	</modal>
	
	<div class="panel_north">
		<table style="width: 100%">
			<tr height="30px">
				<td style="width: 50%">
					<div class="main_text">Book Store Lookup</div>
				</td>
				<td></td>
	
			</tr>
			<tr>
				<td>
					<table class="toptable">
						<tr>
							<td class="toptable">
								<label class="subheading_text">Please click here to see</label>
								<button name="allbooks" type="submit" class="btn btn-success btn-sm " ng-click="getAllBooks()"><i class="fa fa-book"></i> All Available Books</button>
								<button name="createbook" type="submit" class="btn btn-success btn-sm " ng-click="showCreateBook()"><i class="fa fa-plus"></i> Create Book</button>
							</td>
						</tr>
					</table>
				</td>
				<td align="right">
					<span class="date_text" current-time></span>
				</td>
			</tr>
		</table>
	</div>
	
	<div class="panel_west">
		<div class="header">2. Select Categories</div>
		<div class="sidebar">
			<span us-spinner="{top: '300'}" spinner-key="spinner-2"></span>
			<!-- <span><b>Selected Node</b> : {{node.text}} id {{node.id}} </span> -->
			<div treecontrol class="tree-classic"
				tree-model="companyList()"
	   		options="treeOptions"
				on-selection="processSelectedTreeNode(node)" 
				selected-node="node">
				{{node.text}}
			</div>
  	</div>
	</div>
	
	<div class="panel_center">
		<div  id="mainContent">
			<span us-spinner="{top: '55'}" spinner-key="spinner-1"></span>
			<div class="header">1. Selection Criteria</div>
			<div class="div_default">
				<form name="selection_form" novalidate>
					<div class="form-inline">
						<div class="input-group input-group-sm col-sm-4">
							<!-- <label class="control-label col-sm-1">Title Search Criteria</label> -->
							<span class="input-group-addon" id="title-addon">Title Search Criteria</span>
							<input id="title" name="title" aria-describedby="title-addon" ng-model="criteria.title" class="form-control" type="text" size="30" focus-on="setFocus">
						</div>
						<button type="submit" class="btn btn-success btn-sm " ng-click="processSelectedCriteria()"><i class="fa fa-search"></i> Proceed</button> 
						<button type="submit" class="btn btn-success btn-sm " ng-click="resetForm()"><i class="fa fa-close"></i> Reset</button>
					</div> 
				</form>			
			</div>
			<div class="spacer_10"></div>
		</div>
		
		<div class="header">3. Select Available Books</div>
		<div class="content">
			<span us-spinner="{top: '300'}" spinner-key="spinner-3"></span>
			<div class="spacer_10"></div>
			<div class="inset">
				<div external-scopes="clickHandler"  ui-grid="gridOptions" ui-grid-selection class="grid" ui-grid-resize-columns ui-grid-move-columns ui-grid-pagination ui-grid-edit></div>
				<!-- <div id="grid1" ui-grid="gridOptions" ui-grid-pagination class="grid"></div> -->			
			</div>
		</div>
	</div>
	
	<div ng-element-ready="setDefaults('<%=isDebug %>', '<%=baseUrl %>')"></div>
	<div ng-element-ready="getAllCategories()"></div>
	<!-- <div class="panel_east">Hello</div> --> 
</body>
</html>