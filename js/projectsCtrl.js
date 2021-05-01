var app = angular.module("projects", []);
app.controller("projectsCtrl", function($scope, $sce) {
	  $scope.trustSrc = function(src) {
	    return $sce.trustAsResourceUrl(src);
	  }

	$scope.projects =
		[
			{
				"name": "phorym",
				"url": "https://phorym.com/",
				"desc": "Algorithmic chatspace."
			},
			{
				"name": "Kilxn",
				"url": "https://chrome.google.com/webstore/detail/kilxn/aajbjhafaaaabakjnhngiblipmmkpedf",
				"desc": "A browser extension for saving and indexing image URLs."
			},
			{
				"name": "Reversi",
				"url": "https://github.com/keyhanr/Reversi",
				"desc": "A Java based game made with a friend."
			},
			{
				"name": "Road",
				"url": "http://keyhanr.github.io/Road/",
				"desc": "Fun with HTML5 Canvas!"
			},
			{
				"name": "Momemory",
				"url": "http://keyhanr.github.io/Momemory/",
				"desc": "Investigation on sensory memory capacity. (in the works)"
			}
		];
		
});