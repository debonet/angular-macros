// ---------------------------------------------------------------------------
// modMacro
//   AnguarJS macro module. Provides:
//     * "<macro>" meta-directive element
//     * "|find:" filter
//
// See Also 
//   [example.html]
//
// 
(function(){
	var modMacro = angular.module('elementMacro', []);

	var adirectiveForMacro = {};
	var bLoaded = false;

	//--------------------------------------------------------------------------
	// <usemacros /> element
	//   required to trigger the reparsing of the DOM with the inclusion of
	//   the newly defined macros
	//
	// Attributes: 
	//   None
	//
	// Example:
	//   <usemacros />
	//
	// ToDo:
	//   would love to figure out how to not need this
	//
	modMacro.directive(
		'usemacros', function(){
			return {
				"restrict"   : "E",
				scope : {},
				"link": function(scope, jq, attr){
					if (bLoaded){
						return;
					}
					bLoaded = true;

					for (var sMacro in adirectiveForMacro){
						if (adirectiveForMacro.hasOwnProperty(sMacro)){
							modMacro.directive(sMacro,adirectiveForMacro[sMacro]);
						}
					}
					angular.bootstrap(jq.parent(),['elementMacro']);
				}
			};
		}
	);


	//------------------------------------------------------------------------
	// <macro /> element
	//   defines a new macro
	//
	// Attributes:
	//   name := name of the macro to create
	//
	// Example:
	//   <macro name='example'>This is a var {{var1}} and content {{content}}</macro>
	//
	//   <example var1="some value">content</example>
	//
	modMacro.directive(
		'macro',  
		function(){
			return {
				"restrict"   : "E",
				scope : {},
				"link": function(scope, jq, attr){

					var sName = scope.$parent.$eval(attr["name"]);
					if (adirectiveForMacro[sName]){
						return;
					}

					var sHtml = $(jq.get(0)).html();
					sHtml = sHtml.replace(/\{\{(content.*)\}\}/g,"<span ng-bind-html-unsafe=\"$1\"></span>");

					jq.html("<noop/>");

					adirectiveForMacro[sName] = function (){
						return {
							"restrict"   : "E",
							"template"   : "<div>" + sHtml + "</div>",
							"replace"    : true,
							"transclude" : true,
							scope        : true,
							"controller" : ['$scope','$transclude', function(scope,transclude){
								transclude(function(eClone){
									scope.content = eClone;
								});
							}],
							"link"       : function(scope, jq, attrs, ctrl){
								if (scope.$eval(attrs["evaluate"])===true){
									for (var sKey in attrs){
										if (attrs.hasOwnProperty(sKey)){
											scope.$watch(attrs[sKey],function(sValEval){
												scope[sKey] = sValEval;
											});
										}
									}
								}
								else{
									for (var sKey2 in attrs){
										if (attrs.hasOwnProperty(sKey2)){
											scope[sKey2] = attrs[sKey2];
										}
									}
								}
							}
						};
					};
				}
			};
		}
	);


	//------------------------------------------------------------------------
	// |find filter
	//   filters the content to just that part that matches the give selector
	//
	// Params:
	//   sSelector := the jQuery selector to find within the content
	//
	// Example:
	//   <macro name='example'>Content subpart {{content|find:author}}</macro>
	//
	//   <example"><book><title>foo</title><author>bar</author></book></example>
	//
	modMacro.filter(
		'find', function(){
			return function(jq, sSelector){
				if (!jq){
					return;
				}
				return jq.parent().find('b').html();

			};
		}
	);


})();
