angular.module('dbApp', ['ngMaterial']).controller('DashboardCtrl', function($scope, $mdDialog, $http) {

    $scope.pulledEvent = {};    //holds event to open in detailed view
    $scope.newComment = {};
    $scope.newComment.userID;
    $scope.newComment.eventID = 1;
    $scope.newComment.commentText = '';
    $scope.newComment.rating = '';
    $scope.eventSelected = {};
    $scope.commentToEdit = {};
    $scope.editedComment = {};
    $scope.user = {};   //holds user data while session is on
    //view toggles
    $scope.createEventToggle = false;
    $scope.createRSOToggle = false;
    $scope.showEventSearchResults = false;
    $scope.showRSOSearchResults = false;
    $scope.viewEventToggle = false;
    $scope.editCommentForm = false;
    $scope.showComments = false;
    //userInfo - holds user data from sign in
    $scope.userInfo;
    $scope.getUserInfo = function(){
        $http.post('userInfo').then(function(data){
            $scope.user = angular.fromJson(data.data[0]);
            console.log($scope.user);
        });
    }
    $scope.getUserInfo();
    //creating new event
    $scope.event = {};
    $scope.event.eventID;
    $scope.event.name = '';
    $scope.event.startTime = '';
    $scope.event.endTime = '';
    $scope.event.description = '';
    $scope.event.cat = 0;
    $scope.event.latitude = 0;
    $scope.event.longitude = 0;
    $scope.event.userID = 0;
    //creating new RSO
    $scope.rso = {};
    $scope.rso.rsoID;
    $scope.rso.name = '';
    $scope.rso.universityID = 1;
    $scope.rso.active = 0;
    $scope.rso.userID = 2;
    $scope.addMember = '';
    $scope.foundingMembers = [];
    //searching
    $scope.searchResults = [];
    $scope.response = '';
    $scope.searchParam = '';
    $scope.searchCat = '';
    $scope.userData = {};
    $scope.userData.userID = '11223';
    $scope.userData.admin = true;

    $scope.rsoArrayPush = function(){
        $scope.foundingMembers.push($scope.addMember);
        $scope.addMember = '';
    }
    $scope.search = function(){
        //package for db
        $scope.createEventToggle = false;
        $scope.createRSOToggle = false;
        if($scope.searchCat == '0'){
            //public event
            var dataToSend = {};
            dataToSend.name = $scope.searchParam;
            dataToSend.cat = 0;
            dataToSend.flag = 0;
            if($scope.searchParam != ""){
                dataToSend.flag = 1;
            }
            $scope.json = angular.toJson(dataToSend);
            $http.post('/searchEvents', $scope.json).then(function(data){
                $scope.response = data;
                console.log("retrieved data: ");
                console.log($scope.response);
                $scope.searchResults = angular.fromJson($scope.response);
                console.log("Parsed response: ");
                console.log($scope.searchResults);
                $scope.showEventSearchResults = true;
            });        
            
        }
        if($scope.searchCat == '1'){
            //private event
            var dataToSend = {};
            dataToSend.name = $scope.searchParam;
            dataToSend.cat = 1;
            dataToSend.flag = 0;
            if($scope.searchParam != ""){
                dataToSend.flag = 1;
            }
            $scope.json = angular.toJson(dataToSend);
            $http.post('/searchEvents', $scope.json).then(function(data){
                $scope.response = data;
                console.log("retrieved data: ");
                console.log($scope.response);
                $scope.searchResults = angular.fromJson($scope.response);
                console.log("Parsed response: ");
                console.log($scope.searchResults);
                $scope.showEventSearchResults = true;
            });
        }
        if($scope.searchCat == '2'){
            //rso event
            var dataToSend = {};
            dataToSend.name = $scope.searchParam;
            dataToSend.cat = 2;
            dataToSend.flag = 0;
            if($scope.searchParam != ""){
                dataToSend.flag = 1;
            }
            $scope.json = angular.toJson(dataToSend);
            $http.post('/searchEvents', $scope.json).then(function(data){
                $scope.response = data;
                console.log("retrieved data: ");
                console.log($scope.response);
                $scope.searchResults = angular.fromJson($scope.response);
                console.log("Parsed response: ");
                console.log($scope.searchResults);
                $scope.showEventSearchResults = true;
            });
        }
        if($scope.searchCat == '3'){
            //rso org
            var dataToSend = {};
            dataToSend.name = $scope.searchParam;
            dataToSend.cat = 3;
            dataToSend.flag = 0;
            if($scope.searchParam != ""){
                dataToSend.flag = 1;
            }
            $scope.json = angular.toJson(dataToSend);
            $http.post('/searchRSO', $scope.json).then(function(data){
                $scope.response = data;

                console.log("retrieved data: ");
                console.log($scope.response);
                $scope.searchResults = angular.fromJson($scope.response);
                console.log("Parsed response: ");
                console.log($scope.searchResults);
                $scope.showRSOSearchResults = true;
            });
          
        }
    }
    $scope.viewEvent = function(event){
        $scope.pulledEvent = event;
        $scope.eventSelected = event;
        $scope.viewEventToggle = true;
        var dataToSend = {};
        dataToSend.eventID = event.eventID;
        $scope.json = angular.toJson(dataToSend);
        console.log($scope.json);
        $http.post('/getComment', $scope.json).then(function(data){
            console.log(data);
            $scope.pulledComments = angular.fromJson(data);
            $scope.showComments = true;
        });
    }
    $scope.saveComment = function(){
        $scope.newComment.userID = $scope.user.userID;
        $scope.json = angular.toJson($scope.newComment);
        console.log($scope.json);
        $http.post('/createComment', $scope.json).then(function(){
            console.log("success")
            var dataToSend = {};
            dataToSend.eventID = $scope.eventSelected.eventID;
            $scope.json = angular.toJson(dataToSend);
            $http.post('/getComment', $scope.json).then(function(data){
                console.log(data);
                $scope.pulledComments = angular.fromJson(data);
                $scope.showComments = true;
            });
        
        });
    }
    $scope.editComment = function(comment){

        $scope.commentToEdit = comment;
        $scope.editCommentForm = true;

    }
    $scope.updateComment = function(){
        $scope.json = angular.toJson($scope.commentToEdit);
        console.log($scope.json);
        $http.post('/updateComment', $scope.json).then(function(){
            console.log("success")
            var dataToSend = {};
            dataToSend.eventID = $scope.eventSelected.eventID;
            $scope.json = angular.toJson(dataToSend);
            $http.post('/getComment', $scope.json).then(function(data){
                console.log(data);
                $scope.pulledComments = angular.fromJson(data);
                $scope.showComments = true;
                $scope.editCommentForm = false;
            });
        
        });
    }

    $scope.deleteComment = function(comment){
        var deleteComment = {};
        deleteComment.keytmp = comment.keytmp;
        $scope.json = angular.toJson(deleteComment);
        console.log($scope.json);
        $http.post('/deleteComment', $scope.json).then(function(){
            console.log("success")
            var dataToSend = {};
            dataToSend.eventID = $scope.eventSelected.eventID;
            $scope.json = angular.toJson(dataToSend);
            $http.post('/getComment', $scope.json).then(function(data){
                console.log(data);
                $scope.pulledComments = angular.fromJson(data);
                $scope.showComments = true;
            });
        });
    }
    $scope.joinRSO = function(rso){
        console.log(rso);
        $scope.dataToSend = {};
        $scope.dataToSend.rsoID = rso.rsoID;
        $scope.dataToSend.userID; //code to get userID here
        $scope.json = angular.toJson(dataToSend);
        $http.post('/joinRSO', $scope.json).then(function(data){
            alert("Successfully Joined RSO!");
        },
        function(data){
            alert("Failed to Join");
        });
    }

    $scope.attendEvent = function(event){
        console.log(event);
        $scope.dataToSend = {};
        $scope.dataToSend.eventID = event.eventID;
        $scope.dataToSend.userID = $scope.userInfo.userID; 
        $scope.json = angular.toJson($scope.dataToSend);
        $http.post('/attendEvent', $scope.json).then(function(data){
            alert("Successfully Attending Event!");
        },
        function(data){
            alert("Failed to Enroll");
        });
    }
    $scope.createEvent = function(){
        //gather info and send to db
        $scope.createEventToggle = true;
        $scope.createRSOToggle = false;
        $scope.event.userID = $scope.user.userID;
        $scope.event.universityID = $scope.user.universityID;
        if($scope.event.cat == 0 || $scope.event.cat == 1){
            $scope.approved = 0;
        } else{
            $scope.approved = 1;
        }
        if($scope.event.name != ''){
            $scope.json = angular.toJson($scope.event);
            $http.post('/createEvent', $scope.json);
        }
    }

    $scope.createRSO = function(){
        //form with 5 users
        $scope.createRSOToggle = true;
        $scope.createEventToggle = false;
        if($scope.rso.name != ''){
            $scope.json = angular.toJson($scope.rso);
            console.log($scope.json);
            var dataToSend = {};
            dataToSend.userID = $scope.rso.userID;
            dataToSend.name = $scope.rso.name;
            dataToSend.universityID = $scope.rso.universityID;
            $scope.json = angular.toJson(dataToSend);
            $http.post('/createRSO', $scope.json).then(function(data){
                console.log(data);
                $scope.pulledComments = angular.fromJson(data);
                $scope.showComments = true;
            });
        }
    }

    $scope.cancel = function(){
        $scope.createEventToggle = false;
        $scope.createRSOToggle = false;
    }

    $scope.goto = function(key){
        if(key == 'search'){
            window.location.href="searchEngine.html"
        }
        if(key == 'myEvents'){
            window.location.href="myEvents.html"
        }
        if(key == 'myRSOs'){
            window.location.href="myRSOs.html"
        }
    }
    $scope.logout = function(){
        //clear out user info 
        window.location.href="signIn.html"
    }

    //login ctrl
     //login data
     $scope.userData = {};
     $scope.userData.email = '';
     $scope.userData.password = '';
 
     //sign up data
     $scope.universityList = [{name: 'UCF', code: '1'}, {name: 'Valencia', code: '2'}]; //to be replaced later when DB call works
     $scope.securityQList = ["What is your favorite animal?",
                             "What elementary school did you attend?",
                             "What is your least favorite food?"
                             ];
     $scope.securityQSelected = '';
     $scope.signUpData = {};
     $scope.signUpData.email = '';
     $scope.signUpData.password = '';
     $scope.signUpData.universityID = 1;
     $scope.signUpData.securityAns = '';
     $scope.signUpData.isAdmin = 0;
     $scope.signUpData.isSuperAdmin = 0;
     $scope.signUpToggle = false;
 
 
     $scope.login = function(){
         //send userData to database, if valid user, get permissions and go to next page
         $scope.json = angular.toJson($scope.userData);
         $http.post('/userLogin', $scope.json).then(function(data){
            $scope.userInfo = angular.fromJson(data);
            window.location.href="dashboard.html"
            console.log("login success");
        },
        function(data){
            //incorrect user info
            console.log("login failed");
            alert("Incorrect Login");
        });
     }
     $scope.signUpFunc = function(){
         $scope.signUpToggle = true;
         if($scope.signUpData.uni != 0 && $scope.signUpData.email != '' && $scope.signUpData.password != ''){
             //submit new user to db here
             $scope.json = angular.toJson($scope.signUpData);
             $http.post('/addUser', $scope.json).then(function(data){
                $scope.userInfo = angular.fromJson(data);
                window.location.href="dashboard.html"
                console.log("login success");
            });
     }
    }
});