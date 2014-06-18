
var artist = "Radiohead";
var song = "Karma Police";
var album = "OK Computer";
var lyric_id = 0;
var page_count = 10;
var page_current = 1;
var selectedTypeCount = 10;
var comment_sort = "desc";
var comment_order = "date";
var comment_type = "all"


$(document).ready(function() {

    init();

});

function init(){
    $("#sm_artist").html(artist);
    $("#sm_song").html(song);
    $("#sm_album").html(album);
    queryForLyrics();


}



// Helpers
function executeRequestForXml(url, callback, errorCallback) {

    console.log("Executing request:" + url);

    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.onreadystatechange = function() {

        if (req.readyState == 4) {

            switch(req.status)
            {
                case 200:
                {
                    var status = parseInt(getValueFromXmlNode(req.responseXML, "status_code"));

                    console.log('Request for: ' + url + ' is ready and has a status of: ' + status);

                    switch (status)
                    {
                        case 200:
                        {
                            callback(req.responseXML);
                        }
                            break;
                        default:
                        {
                            errorCallback(status);
                        }
                            break;
                    }
                }
            }
        }
    }

    req.send();
}

function executeRequestForJson(method, type, parameters, callback) {

    var url = 'https://api.songmeanings.com/1/?key=bk9HMIsveyMZZyNROxxf&format=json&method=' + method;

    if (type == 'GET') {

        url += '&' + $.param(parameters);
    }

    console.log('Making ' + type + ' request for: ' + url);

    $.ajax({
        url: url,
        contentType: "application/json; charset=utf-8",
        type: type,
        dataType: "json",
        data: JSON.stringify(parameters),
        success: function (results) {

            callback(results);
        },
        error: function (req, msg, obj) {
            console.log('An error occured while executing a request for: ' + url);
            console.log('Error: ' + msg);
            console.log(req);
            console.log(obj);
        }
    });
}

function getEncodedValue(value) {
    return encodeURIComponent(value).replace(/%20/g, '+');
}

function getValueFromXmlNode(xml, node) {

    if (xml.getElementsByTagName(node)[0].childNodes[0]){
        return xml.getElementsByTagName(node)[0].childNodes[0].nodeValue;
    }

    return '';
}


// LYRICS
function queryForLyrics() {



    var url = "https://api.songmeanings.com/1/?key=bk9HMIsveyMZZyNROxxf&method=lyrics.get&artist_name=" + getEncodedValue(artist) + "&lyric_title=" + getEncodedValue(song) + "&format=xml&referrer=deezer";

    executeRequestForXml(url, function (xml) {

            lyric_id = getValueFromXmlNode(xml, "lyric_id")

            /* Set the lyrics. */
            $("#sm_lyrics").html("<p>" + getValueFromXmlNode(xml, "lyric_snippet").replace(/\//g, "<br/>") + "</p><div class=\"link-holder\"><a href=\""+ getValueFromXmlNode(xml, "lyric_url") +"\" target=\"_new\">View Full Lyrics</a></div>");

            /* Set the comment count */
            var commentCount = getValueFromXmlNode(xml, "lyric_comments")
            $("#sm_comment_count").text(commentCount + ' Comments');

            queryForCommentsAndUpdateUI(comment_sort,comment_order);


            if (commentCount > 0) {

                    //queryForCommentDetailsAndPopulateDropdown();

                    //queryForCommentsAndUpdateUI('DESC', 'date');
                }

            });

}

// COMMENTS
/*
 * Parameters:
 *   sort - 'ASC' or 'DESC'
 *   order - 'date', 'rating'
 */
function queryForCommentsAndUpdateUI(sort, order) {

    $('#pagination').html('');
    $('#sm_comments').html('');



    /* Get the number of comments. */
    selectedTypeCount = 10;
    var commentCount = 200;

    /* Determine if we need to add pages. */
    if (commentCount > page_count) {

        /* Calculate the number of pages. */
        var numberOfPages = Math.ceil(commentCount / page_count);

        if (numberOfPages > 1) {

            for (var pageIndex = 1; pageIndex <= numberOfPages; pageIndex++) {

                if (pageIndex == page_current) {
                    $('#pagination').append('<strong>' + pageIndex + '</strong>&nbsp;&nbsp;&nbsp;');
                }
                else {
                    $('#pagination').append('<a name="page-' + pageIndex + '" id="page-' + pageIndex + '" href="#comments">' + pageIndex + '</a>&nbsp;&nbsp;&nbsp;');
                }
            }

            if (page_current < numberOfPages) {

                $('#pagination').append('<a id="page-' + (page_current + 1) + '" href="#comments" name="page-' + (page_current + 1) + '">next</a>');
            }
        }
    }

    getComments(lyric_id, sort, order, comment_type, function (commentsXml) {

        var comments = commentsXml.getElementsByTagName('comment');

        for (var comment_current = 0; comment_current < comments.length; comment_current++)
        {
            var comment = comments[comment_current];
            var commentId = getValueFromXmlNode(comment, "comment_id");
            var user = getValueFromXmlNode(comment, "comment_user");
            var userUrl = getValueFromXmlNode(comment, "comment_user_url");
            var commentDate = getValueFromXmlNode(comment, "comment_date");
            var niceCommentDate = moment(commentDate).format('MMMM Do YYYY');
            var songLink = getValueFromXmlNode(comment, "comment_url");
            var commentUser = getValueFromXmlNode(comment, "comment_user");
            var commentRating = parseInt(getValueFromXmlNode(comment, "comment_rating"));
            var commentReplies =  parseInt(getValueFromXmlNode(comment, "comment_replies"))
            var commentBody = getValueFromXmlNode(comment, "comment_body");

            if (commentRating > 0) {
                commentRating = '+' + commentRating;
            }
            var numberOfReplies = getValueFromXmlNode(comment, "comment_replies");


            var show_expand = false;
            var short_comment = "";
            if(commentBody.length > 225)
            {
                show_expand = true;
                short_comment = commentBody.substring(0,225);
                tok = short_comment.split(" ");
                short_comment = short_comment.substring(0,short_comment.length - tok[tok.length - 1].length - 1);
                comment_end = commentBody.substring(short_comment.length, commentBody.length);
            }


            /* Build up the comments. */
            if(show_expand){
            commentHtml = "<article class=\"comments-item\"> \
                <div class=\"add-info\"> \
            <footer> \
        <strong class=\"title\"><a href=\"#\">"+commentUser+"</a></strong> \
            <time class=\"date\" datetime=\"2013-02-28\">"+ niceCommentDate +"</time> \
                <div class=\"links\"> \
                    <a href=\"#\">"+commentReplies+" Replies</a> <span class=\"leave-reply\">| <a href=\"#\">Leave Your Reply</a></span> \
                    </div> \
                    </footer> \
                        <div class=\"sub-title\"> \
                            <span>General Comment:</span> \
                            <a href=\"#\" class=\"link-flag\">flag</a> \
                            </div> \
                                <p>"+short_comment+"<span id=\"ce-"+commentId+"\">... <a href=\"#\" id=\"trigger-"+commentId+"\">Expand Comment</a></span><span style=\"display:none\" id=\"ch-"+commentId+"\">"+comment_end+"</span></p> \
	</div> \
	<div class=\"rating-holder\"> \
		<strong class=\"title\"><span>Comment </span>Rating</strong> \
		<div class=\"count\">"+commentRating+"</div> \
		<nav class=\"action\"> \
			<ul> \
				<li class=\"minus\"><a href=\"#\">-</a></li> \
				<li><a href=\"#\">+</a></li> \
			</ul> \
		</nav> \
	</div> \
</article>\
<script>\
$('#trigger-"+ commentId +"').click(function(e){\
    e.preventDefault();\
    $('#ce-"+ commentId +"').hide();\
    $('#ch-"+ commentId +"').fadeIn();\
})\
</script>"}
            else{
                commentHtml = "<article class=\"comments-item\"> \
                <div class=\"add-info\"> \
            <footer> \
        <strong class=\"title\"><a href=\"#\">"+commentUser+"</a></strong> \
            <time class=\"date\" datetime=\"2013-02-28\">"+ niceCommentDate +"</time> \
                <div class=\"links\"> \
                    <a href=\"#\">"+commentReplies+" Replies</a> <span class=\"leave-reply\">| <a href=\"#\">Leave Your Reply</a></span> \
                    </div> \
                    </footer> \
                        <div class=\"sub-title\"> \
                            <span>General Comment:</span> \
                            <a href=\"#\" class=\"link-flag\">flag</a> \
                            </div> \
                                <p>"+commentBody+" </p> \
	</div> \
	<div class=\"rating-holder\"> \
		<strong class=\"title\"><span>Comment </span>Rating</strong> \
		<div class=\"count\">"+commentRating+"</div> \
		<nav class=\"action\"> \
			<ul> \
				<li class=\"minus\"><a href=\"#\">-</a></li> \
				<li><a href=\"#\">+</a></li> \
			</ul> \
		</nav> \
	</div> \
</article>"}


            $('#sm_comments').append(commentHtml);
        }
    });
}

function getComments(lyric_id, sort, order, selectedType, callback, errorCallback)
{
    if (!selectedType) {
        selectedType = 'all';
    }

    var url = 'https://api.songmeanings.com/1/?key=bk9HMIsveyMZZyNROxxf&method=comments.get&sm_lid=' + lyric_id + '&page_size=' + page_count + '&page_order=' + order + '&page_sort=' + sort + '&type=' + selectedType + '&page=' + page_current;

    executeRequestForXml(url, callback, errorCallback);
}

function getCommentDetails(smLyricId, callback)
{
    //var url = 'https://api.songmeanings.com/1/?key=bk9HMIsveyMZZyNROxxf&method=comments.breakdown.get&format=json&sm_lid=' + smLyricId;

    var parameters = {
        sm_lid: smLyricId
    };

    executeRequestForJson('comments.breakdown.get', 'GET', parameters, function (results) {

        callback(results);
    });
}

function getCommentReplies(smLyricId, commentId, callback)
{
    var url = 'https://api.songmeanings.com/1/?key=bk9HMIsveyMZZyNROxxf&method=comments.get&sm_lid=' + smLyricId + '&parent_id=' + commentId;

    executeRequestForXml(url, callback, function (errorCode) { console.log('An unknown error occured while retrieving the comment replies.') });
}

// ACTIONS



$(document).ready(function(){

    // Comment Sorting

    $(".sm_comment_oldest a").click(function(e){
        e.preventDefault();
        $(".sm_comment_oldest").addClass("active");
        $(".sm_comment_newest").removeClass("active");
        $(".sm_comment_highest").removeClass("active");
        comment_sort = "date";
        comment_order = "asc"
        queryForCommentsAndUpdateUI(comment_sort, comment_order);

    });


    $(".sm_comment_newest a").click(function(e){
        e.preventDefault();
        $(".sm_comment_oldest").removeClass("active");
        $(".sm_comment_newest").addClass("active");
        $(".sm_comment_highest").removeClass("active");
        comment_sort = "date";
        comment_order = "desc"
        queryForCommentsAndUpdateUI(comment_sort, comment_order);

    });

    $(".sm_comment_highest a").click(function(e){
        e.preventDefault();
        $(".sm_comment_oldest").removeClass("active");
        $(".sm_comment_newest").removeClass("active");
        $(".sm_comment_highest").addClass("active");
        comment_sort = "rating";
        comment_order = "asc"
        queryForCommentsAndUpdateUI(comment_sort, comment_order);

    });



    // Comment Filtering
    $(".sm_comment_general a").click(function(e){
        comment_type = 4;
        queryForCommentsAndUpdateUI(comment_sort, comment_order);
    });

    $(".sm_comment_favorite a").click(function(e){
        comment_type = 5;
        queryForCommentsAndUpdateUI(comment_sort, comment_order);
    });

    $(".sm_comment_memory a").click(function(e){
        comment_type = 5;
        queryForCommentsAndUpdateUI(comment_sort, comment_order);
    });

    $(".sm_comment_interpretation a").click(function(e){
        comment_type = 6;
        queryForCommentsAndUpdateUI(comment_sort, comment_order);
    });

    $(".sm_comment_meaning a").click(function(e){
        comment_type = 7;
        queryForCommentsAndUpdateUI(comment_sort, comment_order);
    });

    $(".sm_comment_opinion a").click(function(e){
        comment_type = 8;
        queryForCommentsAndUpdateUI(comment_sort, comment_order);
    });

    $(".sm_comment_translation a").click(function(e){
        comment_type = 8;
        queryForCommentsAndUpdateUI(comment_sort, comment_order);
    });

    $(".sm_comment_links a").click(function(e){
        comment_type = 13;
        queryForCommentsAndUpdateUI(comment_sort, comment_order);
    });

    $(".sm_comment_comparison a").click(function(e){
        comment_type = 14;
        queryForCommentsAndUpdateUI(comment_sort, comment_order);
    });


})




