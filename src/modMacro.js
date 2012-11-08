// ---------------------------------------------------------------------------
// modMacro
//   AnguarJS macro module. Provides:
//     * "<define macro=''>" element directive
//     * "<invoke macro='' evaluate='true/false' >" element directive
//     * "|find:" filter
//
// See Also 
//   [example.html]
//
// 
(function(){
	var modMacro = angular.module('modMacro', []);

	var asHtmlTemplateForMacro = {};

	//------------------------------------------------------------------------
	// <define /> element
	//   defines a new macro
	//
	// Attributes:
	//   macro := name of the macro to create
	//
	// Example:
	//   <define macro="'example'">This is a var {{var1}} and content {{content}}</define>
	//
	//   <invoke macro="'example'" var1="some value">content</invoke>
	//
	modMacro.directive(
		'define',  
		function($rootScope,$timeout){
			return {
				"restrict"   : "E",
				scope : {},
				"link": function(scope, jq, attr){
					var sMacro = scope.$parent.$eval(attr["macro"]);
					var sHtml = $(jq.get(0)).html();
					sHtml = sHtml.replace(/\{\{(content.*)\}\}/g,"<span ng-bind-html-unsafe=\"$1\"></span>");

					asHtmlTemplateForMacro[sMacro] = sHtml;


					jq.html("<noop/>");

					$rootScope.$broadcast("macroChange",sMacro);
				}
			};
		}
	);

	//------------------------------------------------------------------------
	// <invoke /> element
	//   call a defines a new macro
	//
	// Attributes:
	//   macro := name of the macro to create
	//   evaluate := optional. boolean. if true, macro arguments are evaluated
	//               within scope before application
	//
	// Example:
	//   <define macro="'example'">This is a var {{var1}} and content {{content}}</define>
	//
	//   <invoke macro="'example'" var1="1 + 3">CONTENT</invoke>
	//   <invoke macro="'example'" evaluate var1="1 + 3">CONTENT</invoke>
	//
	// yields:
	//   This is a var 1+3 and content CONTENT
	//   This is a var 4 and content CONTENT
	//
	modMacro.directive(
		'invoke',  
		function($compile){
			return {
				"restrict"   : "E",
				"replace"    : true,
				"transclude" : true,
				scope        : true,
				"controller" : [
					'$scope','$transclude', '$attrs','$element', 
					function(scope,fTransclude, attrs,jq){

						// function to render the macro, used initially and on redefinitions
						var fRender = function(){
							fTransclude(function(eClone){
								scope.content = eClone;
							});

							var sMacro = scope.$eval(attrs['macro']);
							jq.html($compile($(asHtmlTemplateForMacro[sMacro]),fTransclude)(scope));
						};

						// watch for changes on our macro
						scope.$on("macroChange",function(event, sMacro){
							if (sMacro === scope.$eval(attrs['macro'])){
								fRender();
							}
						});

						// render it initially, in case its already been defined
						fRender();
					}
				],
				"link": function(scope, jq, attrs, ctrl){
					// set up all the macro variables from the attributes
					if (scope.$eval(attrs["evaluate"])){
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
	//   <define macro="'example'">Content subpart {{content|find:author}}</define>
	//
	//   <invoke macro="'example'"><book><title>foo</title><author>bar</author></book></invoke>
	//
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
