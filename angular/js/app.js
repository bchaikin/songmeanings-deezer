(function(){

    var app = angular.module('songmeanings',['truncate','ngFacebook','ngCookies'])

        .config( function( $facebookProvider ) {
            $facebookProvider.setAppId('219341278125724');
            $facebookProvider.setPermissions("email");
        })

        .run( function( $rootScope ) {
            // Load the facebook SDK asynchronously
            (function(){
                // If we've already installed the SDK, we're done
                if (document.getElementById('facebook-jssdk')) {return;}

                // Get the first script element, which we'll use to find the parent node
                var firstScriptElement = document.getElementsByTagName('script')[0];

                // Create a new script element and set its id
                var facebookJS = document.createElement('script');
                facebookJS.id = 'facebook-jssdk';

                // Set the new script's source to the source of the Facebook JS SDK
                facebookJS.src = '//connect.facebook.net/en_US/all.js';

                // Insert the Facebook JS SDK into the DOM
                firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
            }());
        });

    var apiUrl = "http://ios.songmeanings.com/api/1/";
    //var apiUrl = "https://api.songmeanings.com/1/";
    var apiKey = "bk9HMIsveyMZZyNROxxf";

    var deezerData = {
        artist: 'Radiohead',
        album: 'Pablo Honey',
        title: 'Creep'
    };

    var u = null;

    app.controller('DeezerController', ['$http','$scope','$facebook','$cookieStore', function($http, $scope, $facebook, $cookieStore){

        sm = this;
        this.song = {};
        this.comments = [];
        this.navigation = {
            commentSort: 'desc',
            commentOrder: 'date',
            commentType: 'all',
            pageSize: 10,
            pageCurrent: 1

        };

        this.email = "";
        this.username = "";
        this.password = "";
        this.repassword = "";
        this.fbUsername = "";
        this.fbRegister = false;
        this.smRegister = false;
        this.loginMsg = "";
        this.modalHeight = "300px";
        this.modalLoginShown = true;
        this.fbAccessToken = "";

        this.user = u;

        this.comment = {
            tags: "",
            thoughts: "",
            category: 4,
            errorMsg: "",
            options:[
                {id:4, value:"General Comment"},
                {id:5, value:"Memory"},
                {id:6, value:"Interpretation"},
                {id:7, value:"Song Meaning"},
                {id:8, value:"My Opinion"},
                {id:13, value:"Link(s)"},
                {id:14, value:"Song Comparison"}
            ]
        };

        tmp_usr = $cookieStore.get('user');
        if(tmp_usr != null){
            this.user = tmp_usr
            this.username = tmp_usr.user_name;

        }

        $scope.modalShown = false;
        $scope.toggleModal = function() {
            if($scope.modalShown)
                $scope.modalShown = false;
            else
            {

                sm.modalLoginShown = true;
                sm.fbRegister = false;

                sm.loginMsg = "";

                $scope.modalShown = true;
            }

        };

        this.ratingActive = "";
        this.ascActive = "";
        this.descActive = "active";

        this.commentsLoaded = false;
        this.hasComments = false;
        this.getCommentRange = function(){

        };

        this.updateSong = function(deezerSong){

            $http({
                url:apiUrl,
                method: 'GET',
                params: {
                    key: apiKey,
                    method: 'lyrics.get',
                    artist_name: deezerSong.artist,
                    lyric_title: deezerSong.title,
                    format: 'json',
                    referrer: 'deezer'
                }
            }).success(function(data){
                sm.song = {
                    id: data.lyric.lyric_id,
                    artist: deezerSong.artist,
                    artistUrl: data.lyric.lyric_artist_url,
                    title: deezerSong.title,
                    album: deezerSong.album,
                    snippet: data.lyric.lyric_snippet,
                    snippetUrl: data.lyric.lyric_url,
                    numComments: data.lyric.lyric_comments
                };

                sm.updateComments(sm.song.id);

            });
        };

        this.updateComments = function(idLyric){

            sm.comments = [];
            sm.commentsLoaded = false;
            sm.hasComments = false;

            $http({
                url:apiUrl,
                method: 'GET',
                params: {
                    key: apiKey,
                    method: 'comments.get',
                    sm_lid: sm.song.id,
                    page_size: sm.navigation.pageSize,
                    page_order: sm.navigation.commentOrder,
                    page_sort: sm.navigation.commentSort,
                    type: sm.navigation.commentType,
                    page: sm.navigation.pageCurrent,
                    format: 'json',
                    referrer: 'deezer'
                }
            }).success(function(data){

                try {

                    for (var commentArray in data.comment) {
                        // api returns the JSON array a little funky
                        comment = data.comment[commentArray];
                        var theRating = comment.comment_rating;
                        if(theRating > 0)
                            theRating = "+" + theRating;
                        var isFlagged = false;
                        if(comment.comment_flagged == "Yes")
                            isFlagged = true;

                        var c = {
                            body: comment.comment_body,
                            date: comment.comment_date,
                            id: comment.comment_id,
                            replies: comment.comment_replies,
                            rating: theRating,
                            user: comment.comment_user,
                            userUrl: comment.comment_user_url,
                            type: comment.comment_type,
                            expanded: false,
                            flagged: isFlagged
                        };
                        sm.comments.push(c);
                    }
                    sm.navigation.pageTotal = data.comments.pages;
                    sm.hasComments = true;
                }catch(err) {}

                sm.commentsLoaded = true;
            });
        };

        this.updateCategory = function(category){
            sm.navigation.pageCurrent = 1;
            sm.navigation.commentType = category;
            sm.updateComments(sm.song.id);

        };

        this.updateSort = function(sort) {
            sm.ratingActive = "";
            sm.ascActive = "";
            sm.descActive = "";

            if(sort == 'rating'){
                sm.navigation.commentSort = 'desc';
                sm.navigation.commentOrder = 'rating';
                sm.ratingActive = "active";

            }
            else
            {
                sm.navigation.commentSort = sort;
                sm.navigation.commentOrder = 'date';
                if(sort == 'desc')
                    sm.descActive = "active";
                else
                    sm.ascActive = "active";
            }
            sm.updateComments(sm.song.id);
        };

        this.nextPage = function(){
            if(sm.navigation.pageCurrent == sm.navigation.pageTotal)
                sm.navigation.pageCurrent = 1;
            else
                sm.navigation.pageCurrent++;
            sm.updateComments(sm.song.id);
        };

        this.prevPage = function(){
            if(sm.navigation.pageCurrent == 1)
                sm.navigation.pageCurrent = sm.navigation.pageTotal;
            else
                sm.navigation.pageCurrent--;
            sm.updateComments(sm.song.id);
        };

        this.expandComment = function(index){
            sm.comments[index].expanded = true;
        };

        this.updateCommentRating = function(location, upOrDown){
            console.log("Entering rating...");
            console.log(sm.user);

            theParams = {
                key: apiKey,
                method: 'comments.rate.put',
                comment_id: Number(sm.comments[location].id),
                sm_uid: sm.user.user_id,
                sm_authcode: sm.user.user_authcode,
                rating: upOrDown,
                format: 'json',
                referrer: 'deezer'
            };

            $http({
                method: 'POST',
                url: apiUrl + "?key=" + apiKey + "&method=comments.rate.put&sm_uid=" + sm.user.user_id + "&sm_authcode=" + sm.user.user_authcode,
                data: $.param(theParams),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data) {

                if (data.status.status_code == 200) {
                    sm.comments[location].rating = data.comment.comment_rating;
                }
                else
                    alert(data.status.status_message);
            });

        };

        this.postComment = function(){
            sm.comment.errorMsg = "Error";

            var theParams = {
                key: apiKey,
                method: 'comments.put',
                sm_uid: sm.user.user_id,
                sm_authcode: sm.user.user_authcode,
                type: sm.comment.category,
                sm_lid: sm.song.id,
                format: 'json',
                referrer: 'deezer'
            };

            $http({
                method: 'POST',
                url: apiUrl + "?key=" + apiKey + "&method=comments.put&sm_uid=" + sm.user.user_id + "&sm_authcode=" + sm.user.user_authcode,
                data: $.param(theParams),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data) {

                if (data.status.status_code == 200) {

                }
                else
                    sm.comment.errorMsg = data.status.status_message;
            });
        }

        this.flagComment = function(location){

            var theParams = {
                key: apiKey,
                method: 'comments.flag.put',
                comment_id: Number(sm.comments[location].id),
                format: 'json',
                referrer: 'deezer'
            };

            theUrl = apiUrl + "?key=" + apiKey + "&method=comments.flag.put";

            if(sm.user != null){
                theParams = {
                    key: apiKey,
                    method: 'comments.flag.put',
                    comment_id: Number(sm.comments[location].id),
                    sm_uid: sm.user.user_id,
                    sm_authcode: sm.user.user_authcode,
                    referrer: 'deezer'
                };

                theUrl = apiUrl + "?key=" + apiKey + "&method=comments.flag.put&sm_uid=" + sm.user.user_id + "&sm_authcode=" + sm.user.user_authcode;
            }


            $http({
                method: 'POST',
                url: theUrl,
                data: $.param(theParams),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data) {

                if (data.status.status_code == 200) {
                    sm.comments[location].flagged = true;
                }

            });

        };

        this.login = function(){

            sm.loginMsg = "";
            sm.modalHeight = "250px";

            $http({
                url:apiUrl,
                method: 'GET',
                params: {
                    key: apiKey,
                    method: 'users.login.put',
                    username: this.username,
                    password: this.password,
                    format: 'json',
                    referrer: 'deezer'
                }
            }).success(function(data){

                if(data.status.status_code == 200){
                    sm.user = data.user;
                    $cookieStore.put("user",sm.user);
                    $scope.toggleModal();

                }else
                {

                    sm.modalHeight = "300px";
                    sm.loginMsg = data.status.status_message;
                }


                sm.commentsLoaded = true;
            });
        };

        this.logout = function(){
            sm.user = null;
            sm.username = "";
            sm.password = "";
            $cookieStore.remove("user");
        };

        this.registerFB = function(){

            sm.modalLoginShown = false;
            sm.smRegister = false;
            sm.fbRegister = true;

            theParams = {
                key: apiKey,
                method: 'users.create.put',
                fb_access: sm.fbAccessToken,
                username: sm.fbUsername,
                format: 'json',
                referrer: 'deezer'
            }

            $http({
                method: 'POST',
                url: apiUrl + "?key=" + apiKey + "&method=users.create.put",
                data: $.param(theParams),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data) {

                if (data.status.status_code == 200) {
                    sm.user = data.user;
                    $cookieStore.put("user",sm.user);
                    $scope.toggleModal();

                } else {
                    sm.loginMsg = data.status.status_message;
                    sm.modalHeight = "300px";

                }
                sm.modalLoginShown = true;
            });

        }

        $scope.updateMsg = function(msg){
            sm.loginMsg = msg;
        }

        this.registerSM = function(){
            sm.modalHeight = "300px;"
            sm.fbRegister = false;


            if(sm.password == ""){
                sm.loginMsg = "Passwords is invalid.";
                return
            }

            if(sm.password != sm.repassword){
                sm.loginMsg = "Passwords do not match.";
                return
            }

            sm.modalLoginShown = false;

            theParams = {
                key: apiKey,
                method: 'users.create.put',
                username: sm.username,
                password: sm.password,
                email: sm.email,
                format: 'json',
                referrer: 'deezer'
            }

            $http({
                method: 'POST',
                url: apiUrl + "?key=" + apiKey + "&method=users.create.put",
                data: $.param(theParams),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data) {

                if (data.status.status_code == 200) {
                    sm.user = data.user;
                    $cookieStore.put("user",sm.user);
                    $scope.toggleModal();

                } else {
                    sm.loginMsg = data.status.status_message;
                    sm.modalHeight = "300px";

                }
                sm.modalLoginShown = true;
            });


        }

        this.loginFB = function(){
            console.log("Facebook Login");
            sm.modalLoginShown = false;

            $facebook.login().then(function(response) {

                if(response.status == "connected"){
                    sm.loginMsg = "";
                    sm.modalHeight = "250px";

                    sm.fbAccessToken = response.authResponse.accessToken;

                    $http({
                        url:apiUrl,
                        method: 'GET',
                        params: {
                            key: apiKey,
                            method: 'users.login.put',
                            fb_access: response.authResponse.accessToken,
                            format: 'json',
                            referrer: 'deezer'
                        }
                    }).success(function(data) {

                        if (data.status.status_code == 200) {
                            sm.user = data.user;
                            $cookieStore.put("user",sm.user);
                            $scope.toggleModal();

                        } else {
                            if(data.status.status_code == 408){
                                sm.fbRegister = true;
                                sm.loginMsg = "The facebook user does not currently have and account.  Please select a username to register a new account."
                            }
                            else
                                sm.loginMsg = data.status.status_message;
                            sm.modalHeight = "300px";

                        }
                        sm.modalLoginShown = true;
                        sm.commentsLoaded = true;
                    });
                }
            });

        };

        this.getCommentWordCount = function(comment){
            return comment.body.split(" ").length;
        };

        this.updateSong(deezerData);


    }]);

    app.directive('modalDialog', function() {
        return {
            restrict: 'E',
            scope: {
                show: '='
            },
            replace: true, // Replace with the template below
            transclude: true, // we want to insert custom content inside the directive
            link: function(scope, element, attrs) {
                scope.dialogStyle = {};
                if (attrs.width)
                    scope.dialogStyle.width = attrs.width;
                if (attrs.height)
                    scope.dialogStyle.height = attrs.height;
                scope.hideModal = function() {
                    scope.show = false;
                };
            },
            template: "<div class='ng-modal' ng-show='show'><div class='ng-modal-overlay' ng-click='hideModal()'></div><div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-close' ng-click='hideModal()'>X</div><div class='ng-modal-dialog-content' ng-transclude></div></div></div>"
        };
    });



})();