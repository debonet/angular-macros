angularjs-macros
================

An AngularJS module that allows for on-the-fly macro definition and use within HTML

## How to use

Just include modMacros in your main application, e.g.:

~~~js
angular.module('myApp',['modMacros', ...]);
~~~


## Macro Definition

~~~html
<macro name="'example'">
	this is a simple example of a macro
	
		substitutions: {{variable1}}, {{variable2}}
		
		and inner content: {{content}}
		
		and content subselection: {{content|find:b}}

</macro>
~~~


## Macro Invocation

~~~html
<example variable1="foo" variable2="bar">
	THIS IS {{dynamic}} AND <B>BOLD STUFF</B> 
</example>
~~~


# Simple website template

page.macro:

~~~html
<macro name="page">
	<html>
		<head>
			<title>{{title}}</title>
		</head>
		<body>
			<h1>Standard page header</h1>
			<h2>{{title}}</h1>
			<div class='content'>
				{{content}}
			</div>
			<div class='copyright'>Copyright (c) 2012 {{author}}</div>
		</body>
	</html>
</macro>
<usemacros />


<ng-include src="'page.macro'" />

<page title="some page" author="me">
  This is some little page. 
</page>

~~~

