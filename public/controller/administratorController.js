var myApp=angular.module('myApp',['ngRoute']);
myApp.controller('administratorCtrl',['$scope','$http','$window','$log','$location',function($scope,$http,$window,$log,$location){
	console.log('Hello World from administratorCtrl');

	$scope.studentList=[];
	$scope.courseList=[];
	$scope.facultyList=[];
	$scope.parentList=[];

	$http.post('/student/getDetails',{}).success(function(response){
		$scope.studentList=response;
	})
	$http.post('/course/getDetails',{}).success(function(response){
		$scope.courseList=response;
	})
	$http.post('/faculty/getDetails',{}).success(function(response){
		$scope.facultyList=response;
	})
	$http.post('/parent/getDetails',{}).success(function(response){
		$scope.parentList=response;
	})
}])
