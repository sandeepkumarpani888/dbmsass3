var myApp = angular.module('myApp', ['ngRoute']);
myApp.controller('assignmentCtrl', ['$scope', '$http', '$window', '$log', '$location', function($scope, $http, $window, $log, $location) {
    console.log('Hello World from assignmentCtrl');

    $scope.init = function() {
        console.log($location.absUrl());
        var res = $location.absUrl().split('?');
        var tempData = res[1].split('=');
        var userEmail = tempData[1];
        $scope.studentEmail = tempData[1];
        tempData = res[2].split('=');
        var courseName = tempData[1];
        $scope.courseName = tempData[1];
        tempData = res[3].split('=');
        var assignmentNumber = tempData[1];
        var student = {};
        var course = {};
        var assignment = {};
        $scope.choices = [];
        $http.post('/student/getDetails', { 'email': userEmail }).success(function(response) {
            var reply = response[0];
            $scope.student = reply;
            console.log($scope.student);
        })
        $http.post('/course/getDetails', { 'name': courseName }).success(function(response) {
            var reply = response[0];
            $scope.course = reply;
            console.log($scope.course);
        })
        $http.post('/assignment/getDetails', { 'courseName': courseName, 'assignmentNumber': assignmentNumber }).success(function(response) {
            var reply = response[0];
            $scope.assignment = reply;
            console.log($scope.assignment);
            var createListAnswer = function(assignment) {
                console.log(assignment.assignmentQuestionCount);
                for (var index = 0; index < assignment.assignmentQuestionCount; index++) {
                    var push = function() {
                        console.log(index);
                        $scope.choices.push({ 'answer': '' });
                    }
                    push()
                }
            }
            createListAnswer($scope.assignment);
        })
    }

    $scope.evaluate = function() {
        var answers = [];
        $http.post('/answerToAssignment/getAnswers', { 'courseName': $scope.course.name, 'assignmentNumber': $scope.assignment.assignmentNumber }).success(function(response) {
            var reply = response[0].answer;
            console.log(response[0]);
            var evaluateAnswer = function(reply) {
                var countCorrectAnswers = 0;
                var check = function(countCorrectAnswers) {
                    for (index = 0; index < $scope.assignment.assignmentQuestionCount; index++) {
                        if (response[0].answer[index] == $scope.choices[index].answer) {
                            countCorrectAnswers++;
                        }
                        //console.log($scope.choices[index]+" "+response[0].answer[index]);
                    }
                    var displayResult = function(countCorrectAnswers) {
                        console.log('You got->' + countCorrectAnswers);
                        $scope.correctAnswerCount = countCorrectAnswers;
                    }
                    displayResult(countCorrectAnswers);
                }
                check(countCorrectAnswers);
            }
            evaluateAnswer(reply);
        })
    }

    $scope.doneWithAssignment = function(studentEmail, courseName) {
        $http.post('/studentCourse/getContent', { 'email': studentEmail }).success(function(response) {
            console.log(response[0]);
            var addCount = function() {
                for (var index = 0; index < response[0].course.length; index++) {
                    console.log(response[0].course[index]);
                    var check = function() {
                        if (response[0].course[index].courseName == courseName) {
                            console.log(response[0].course[index].courseName);
                            response[0].course[index].assignmentCompleted = (parseInt(response[0].course[index].assignmentCompleted) + 1) + "";
                            var update = function() {
                                console.log(response[0]);
                                $http.post('/studentCourse/updateContent/' + studentEmail, response[0]).success(function(response) {
                                    var reply = response[0];
                                    console.log(response[0]);
                                })
                            }
                            update();
                        }
                    }
                    check();
                }
            }
            addCount();
        })
    }

}])
