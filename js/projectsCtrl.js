var app = angular.module("projects", []);
app.controller("projectsCtrl", function($scope, $sce) {
	  $scope.trustSrc = function(src) {
	    return $sce.trustAsResourceUrl(src);
	  }

	$scope.projects =
		[
			{
				"name": "Kilxn",
				"url": "https://chrome.google.com/webstore/detail/kilxn/aajbjhafaaaabakjnhngiblipmmkpedf",
				"desc": "A browser extension for saving and indexing image URLs."
			},
			{
				"name": "Momemory",
				"url": "http://keyhanr.github.io/Momemory/",
				"desc": "To investigate our sensory memory's capacity. (in the works)"
			},
			{
				"name": "Road",
				"url": "http://keyhanr.github.io/Road/",
				"desc": "Fun with HTML5 Canvas!"
			},
			{
				"name": "Tunnel",
				"url": "http://keyhanr.github.io/Tunnel/",
				"desc": "More fun with HTML5 Canvas!"
			},
			{
				"name": "Reversi",
				"url": "https://github.com/keyhanr/Reversi",
				"desc": "A Java based game made with a friend."
			}
		];
		
});