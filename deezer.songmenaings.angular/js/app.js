(function(){

    var app = angular.module('songmeanings',['truncate']);

    app.controller('DeezerController', ['$http','$scope', function($http, $scope){

        $scope.modalShown = false;
        $scope.toggleModal = function() {
            $scope.modalShown = !$scope.modalShown;
        };

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

        this.ratingActive = "";
        this.ascActive = "";
        this.descActive = "active";

        this.commentsLoaded = false;
        this.hasComments = false;
        this.getCommentRange = function(){

        };

        this.updateSong = function(deezerSong){

            $http({
                url:'https://api.songmeanings.com/1/',
                method: 'GET',
                params: {
                    key: 'bk9HMIsveyMZZyNROxxf',
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
                url:'https://api.songmeanings.com/1/',
                method: 'GET',
                params: {
                    key: 'bk9HMIsveyMZZyNROxxf',
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
                        var c = {
                            body: comment.comment_body,
                            date: comment.comment_date,
                            id: comment.comment_id,
                            replies: comment.comment_replies,
                            rating: comment.comment_rating,
                            user: comment.comment_user,
                            userUrl: comment.comment_user_url,
                            type: comment.comment_type,
                            expanded: false
                        };
                        sm.comments.push(c);
                    }
                    sm.navigation.pageTotal = data.comments.pages;
                    sm.hasComments = true;
                }catch(err) {}

                sm.commentsLoaded = true;
            });
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
                sm.navigation.commentSort = sort;
                sm.navigation.commentOrder = 'desc'
                sm.ratingActive = "active";

            }
            else
            {
                sm.navigation.commentSort = 'date';
                sm.navigation.commentOrder = sort;
                if(sort == 'desc')
                    sm.descActive = "active";
                else
                    sm.ascActive = "active";
            }
            sm.updateComments(sm.song.id);
        };




        this.getCommentWordCount = function(comment){
            return comment.body.split(" ").length;
        };

        this.expandComment = function(index){
            sm.comments[index].expanded = true;
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




    var deezerData = {

        artist: 'Radiohead',
        album: 'Pablo Honey',
        title: 'Creep'

    };



})();