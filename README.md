angularjs-macros
================

An AngularJS module that allows for on-the-fly macro definition and use within HTML



## Example Usage

~~~html

<macro name="'example'">
	<h1>this is a simple example of a macro</h1>
	<ul>
		<li>substitutions: {{variable1}}, {{variable2}}</li>
		<li>and inner content: {{content}}</li>
		<li>and content subselection: {{content|find:b}}</li>
	</ul>
</macro>

<example variable1="foo" variable2="bar">
	THIS IS {{dynamic}} AND <B>BOLD STUFF</B> 
</example>

<input ng-model='dynamic' >

~~~

