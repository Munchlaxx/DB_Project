angular.module('dbApp', ['ngMaterial']).controller('DashboardCtrl', function($scope, $mdDialog, $http) {
    //view toggles
    $scope.createEventToggle = false;
    $scope.createRSOToggle = false;
    $scope.showEventSearchResults = false;
    $scope.showRSOSearchResults = false;
    $scope.showMeEvent = false;
    $scope.editCommentForm = false;
    $scope.showComments = false;
    $scope.defaultToggle = true;
    //
    $scope.map = {};
    $scope.pulledEvent = {};    //holds event to open in detailed view
    $scope.newComment = {};
    $scope.newComment.userID;
    $scope.newComment.eventID;
    $scope.newComment.commentText = '';
    $scope.newComment.rating = '';
    $scope.eventSelected = {};
    $scope.commentToEdit = {};
    $scope.editedComment = {};
    $scope.user = {};   //holds user data while session is on


    
    $scope.mapDestroy = function() {
        $scope.map = {};
    }

    $scope.mapCreate = function() {
        $scope.map;
        var ucfCampusCenter = {lat: 28.6024274, lng: -81.2000599};
        function initMap() {
            $scope.map = new google.maps.Map(document.getElementById('map'),{
                center: ucfCampusCenter,
            zoom: 12 
            }); //ucf center
            var marker = new google.maps.Marker({position: ucfCampusCenter, map: map});
            //var geocoder = new google.maps.Geocoder();
        }
    }

    $scope.viewDivToggle = function(key){
        if(key == 0){
            //show event search results
         //   $scope.showMeEvent = false;
            $scope.createEventToggle = false;
            $scope.createRSOToggle = false;
            $scope.showEventSearchResults = true;
            $scope.showRSOSearchResults = false;
        //    $scope.showMeEvent = false;
         //   $scope.editCommentForm = false;
        //    $scope.showComments = false;
            $scope.defaultToggle = false;
            $scope.mapDestroy();
        } else if(key == 1){
         //   $scope.showMeEvent = false;

            //show rso search results
            $scope.createEventToggle = false;
            $scope.createRSOToggle = false;
            $scope.showEventSearchResults = false;
            $scope.showRSOSearchResults = true;
        //    $scope.showMeEvent = false;
          //  $scope.editCommentForm = false;
        //    $scope.showComments = false;
            $scope.defaultToggle = false;

            $scope.mapDestroy();
        } else if(key == 2){
      //      $scope.showMeEvent = false;

            //show create event form
            $scope.createEventToggle = true;
            $scope.createRSOToggle = false;
            $scope.showEventSearchResults = false;
            $scope.showRSOSearchResults = false;
       //     $scope.showMeEvent = false;
        //    $scope.editCommentForm = false;
        //    $scope.showComments = false;
            $scope.defaultToggle = false;

            $scope.mapCreate();
        } else if(key == 3){
        //    $scope.showMeEvent = false;

            //show  create RSO form
            $scope.createEventToggle = false;
            $scope.createRSOToggle = true;
            $scope.showEventSearchResults = false;
            $scope.showRSOSearchResults = false;
      //      $scope.showMeEvent = false;
         //   $scope.editCommentForm = false;
        //    $scope.showComments = false;
            $scope.defaultToggle = false;

            $scope.mapDestroy();
        } else if(key == 4){
            //show view event
          //  $scope.showMeEvent = true;
            $scope.createEventToggle = false;
            $scope.createRSOToggle = false;
            $scope.showEventSearchResults = false;
            $scope.showRSOSearchResults = false;
        //    $scope.editCommentForm = false;
            $scope.showComments = false;
            $scope.defaultToggle = false;
            console.log($scope.viewEventToggle);

            $scope.mapCreate();
        } else {
            $scope.createEventToggle = false;
            $scope.createRSOToggle = false;
            $scope.showEventSearchResults = false;
            $scope.showRSOSearchResults = false;
          //  $scope.showMeEvent = false;
            $scope.editCommentForm = false;
            $scope.showComments = false;
            $scope.defaultToggle = true;
            $scope.mapDestroy();
        }
    }
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
    $scope.event.approved;
    $scope.event.lat = 0;
    $scope.event.lng = 0;
    $scope.event.userID = 0;
    //creating new RSO
    $scope.rso = {};
    $scope.rso.rsoID;
    $scope.rso.name = '';
    $scope.rso.universityID = 1;
    $scope.rso.active = 0;
    $scope.rso.userID = 2;
    //searching
    $scope.searchResults = [];
    $scope.response = '';
    $scope.searchParam = '';
    $scope.searchCat = '';
/*     $scope.userData = {};
    $scope.userData.userID = '11223';
    $scope.userData.admin = true; */

/*     $scope.rsoArrayPush = function(){
        $scope.foundingMembers.push($scope.addMember);
        $scope.addMember = '';
    } */
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
                $scope.viewDivToggle(0);                
            });        
            
        }
        if($scope.searchCat == '1'){
            //private event
            var dataToSend = {};
            dataToSend.name = $scope.searchParam;
            dataToSend.approved = 1
            dataToSend.cat = 1;
            dataToSend.flag = 0;
            dataToSend.universityID = $scope.user.universityID;
            if($scope.searchParam != ''){
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
                $scope.viewDivToggle(0);  
            });
        }
        if($scope.searchCat == '2'){
            //rso event
            var dataToSend = {};
            dataToSend.name = $scope.searchParam;
            dataToSend.cat = 2;
            dataToSend.flag = 0;
            if($scope.searchParam != ''){
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
                $scope.viewDivToggle(0);  
            });
        }
        if($scope.searchCat == '3'){
            //rso org
            var dataToSend = {};
            dataToSend.name = $scope.searchParam;
            dataToSend.cat = 3;
            dataToSend.flag = 0;
            if($scope.searchParam != ''){
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
                $scope.viewDivToggle(1);  
            });
          
        }
    }
    $scope.viewEvent = function(event){
        console.log("viewing event")
        $scope.viewDivToggle(4);
        $scope.showMeEvent = true;
        $scope.pulledEvent = event;
        $scope.eventSelected = event;
       // $scope.viewEventToggle = true;
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
    $scope.saveComment = function(event){
        $scope.newComment.userID = $scope.user.userID;
        $scope.newComment.eventID = event.eventID;
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
    $scope.updateComment = function(event){
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
        var dataToSend = {};
        dataToSend.rsoID = rso.rsoID;
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
        console.log(event);
        $scope.json = angular.toJson($scope.dataToSend);
        console.log($scope.json);
        $http.post('/attendEvent', $scope.json).then(function(data){
            alert("Successfully Attending Event!");
        },
        function(data){
            alert("Failed to Enroll");
        });
    }
    $scope.createEvent = function(){
        $scope.viewDivToggle(2);
        //gather info and send to db
        $scope.event.userID = $scope.user.userID;
        $scope.event.universityID = $scope.user.universityID;
        if($scope.event.cat == 0 || $scope.event.cat == 1){
            $scope.approved = 0;
        } else{
            $scope.approved = 1;
        }
        if($scope.event.name != ''){
            $scope.json = angular.toJson($scope.event);
            console.log($scope.json);
            $http.post('/checkEvent', $scope.json).then(function(){
                $http.post('/createEvent', $scope.json).then(function(){
                    alert("Event Created");
                });
            },
            function(){
                alert("Event Creation Failed");
            });
        }
    }

    $scope.createRSO = function(){
        //form with 5 users
        $scope.viewDivToggle(3);
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



    //on page load:
    $scope.viewDivToggle(999);
});