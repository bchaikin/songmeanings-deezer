<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>SongMeanings.net</title>
	<link media="all" rel="stylesheet" href="css/all.css">
	<script src="js/jquery-1.8.3.min.js"></script>
	<script src="js/jquery.main.js"></script>
    <script src="js/moment.min.js"></script>
    <script src="js/app.js"></script>
    <script src="http://cdn-files.deezer.com/js/min/dz.js"></script>
	<!--[if IE]><script src="js/ie.js"></script><![endif]-->
</head>
<body>
	<div id="wrapper">
		<header id="header">
			<div class="header-holder">
				<strong class="logo"><a href="#">SongMeanings.net</a></strong>
				<div class="account">
					<a href="#" class="opener">account</a>
					<ul>
						<li><a href="#">Sign Up</a></li>
						<li class="signin"><a href="#">Login</a></li>
					</ul>
				</div>
			</div>
		</header>
		<main id="main" role="main">
			<section class="album-intro">
				<div class="image-holder col">
					<span data-picture data-alt="image description">
						<span data-src="images/img1.jpg" ></span>
						<span data-src="images/img1-tablet.jpg" data-media="(max-width:1024px)" ></span>
						<span data-src="images/img1-tablet2x.jpg" data-media="(max-width:1024px) and (-webkit-min-device-pixel-ratio:1.5), (max-width:1024px) and (min-resolution:144dpi)" ></span>
						<span data-src="images/img1-mobile.jpg" data-media="(max-width:767px)" ></span>
						<span data-src="images/img1-mobile2x.jpg" data-media="(max-width:767px) and (-webkit-min-device-pixel-ratio:1.5), (max-width:767px) and (min-resolution:144dpi)" ></span>
						<!--[if (lt IE 9) & (!IEMobile)]>
							<span data-src="images/img1.jpg"></span>
						<![endif]-->
						<!-- Fallback content for non-JS browsers. Same img src as the initial, unqualified source element. -->
						<noscript><img src="images/img1.jpg" width="200" height="200" alt="image description" ></noscript>
					</span>
				</div>
				<div class="info-holder col">
					<div class="album-info">
						<dl>
							<dt>Artist:</dt>
							<dd id="sm_artist"><a class="title" href="#">N/A</a></dd>
							<dt>Song:</dt>
							<dd id="sm_song">N/A</dd>
							<dt>Album:</dt>
							<dd id="sm_album">N/A</dd>
						</dl>
					</div>
					<div class="follow-block">
						<a href="#" class="link-follow">Follow <span>Following</span></a>
					</div>
				</div>
				<aside id="sm_lyrics" class="info-list col">


				</aside>
			</section>
			<div id="content">
				<footer class="meta-block">
					<div class="meta-frame">
						<div class="meta-holder">
							<a href="#" class="btn-add">Add Your Thoughts</a>
							<strong class="title" id="sm_comment_count">0 Comments</strong>
							<div class="filter">
								<a class="filter-opener" href="#">Filter <span>by Category</span></a>
							</div>
							<div class="sort">
								<a href="#" class="sort-opener">Sort</a>
								<ul>
									<li class="sm_comment_highest"><a href="#" >Highest Rated</a></li>
									<li class="sm_comment_oldest"><a href="#" >Oldest First</a></li>
									<li class="active sm_comment_newest"><a href="#">Newest First</a></li>
								</ul>
							</div>
						</div>
						<div class="slide-holder">
							<div class="slide-filter">
								<ul>
								<li class="sm_comment_general"><a href="#">General Comment</a></li>
								<li class="sm_comment_favorite"><a href="#">Favorite</a></li>
								<li class="sm_comment_memory"><a href="#">Memory</a></li>
								<li class="sm_comment_interpretation"><a href="#">Interpretation</a></li>
								<li class="sm_comment_meaning"><a href="#">Song Meaning</a></li>
								<li class="sm_comment_opinion"><a href="#">My Opinion</a></li>
								<li class="sm_comment_translation"><a href="#">Translation</a></li>
								<li class="sm_comment_links"><a href="#">Link(s)</a></li>
								<li class="sm_comment_comparison last"><a href="#">Song Comparison</a></li>
							</ul>
							<div class="slide-nav-mobile">
								<ul>
									<li class="sm_comment_general"><a href="#">General Comment</a></li>
									<li class="sm_comment_favorite"><a href="#">Favorite</a></li>
									<li class="sm_comment_memory"><a href="#">Memory</a></li>
									<li class="sm_comment_interpretation"><a href="#">Interpretation</a></li>
									<li class="sm_comment_meaning"><a href="#">Song Meaning</a></li>
								</ul>
								<ul>
									<li class="sm_comment_opinion"><a href="#">My Opinion</a></li>
									<li class="sm_comment_translation"><a href="#">Translation</a></li>
									<li class="sm_comment_links"><a href="#">Link(s)</a></li>
									<li class="sm_comment_comparison last"><a href="#">Song Comparison</a></li>
								</ul>
							</div>
							<div class="slide-nav-tablet">
								<ul>
									<li class="sm_comment_general"><a href="#">General Comment</a></li>
									<li class="sm_comment_favorite"><a href="#">Favorite</a></li>
									<li class="sm_comment_memory"><a href="#">Memory</a></li>
								</ul>
								<ul>
									<li class="sm_comment_interpretation"><a href="#">Interpretation</a></li>
									<li class="sm_comment_meaning"><a href="#">Song Meaning</a></li>
									<li class="sm_comment_opinion"><a href="#">My Opinion</a></li>
								</ul>
								<ul>
									<li class="sm_comment_translation"><a href="#">Translation</a></li>
									<li class="sm_comment_links"><a href="#">Link(s)</a></li>
									<li class="sm_comment_comparison last"><a href="#">Song Comparison</a></li>
								</ul>
							</div>
							</div>
							<div class="slide-sort">
								<ul>
									<li class="sm_comment_highest"><a href="#">Highest Rated</a></li>
									<li class="sm_comment_oldest"><a href="#">Oldest First</a></li>
									<li class="sm_comment_newest active "><a href="#">Newest First</a></li>
								</ul>
							</div>
						</div>
					</div>
				</footer>
				<div class="scrollable-area comments-area">
                    <div class="comments-list" id="sm_comments">


					</div>
				</div>
			</div>
		</main>
		<footer id="footer">
			<div class="footer-holder">
				<div class="footer-info">
					<p>Non-lyrical content copyright 1999-2014 SongMeanings <br>In partnership with <a href="#">ToneMedia</a></p>
				</div>
				<ul class="social-networks">
					<li><a href="#" class="facebook">Facebook</a></li>
					<li><a href="#" class="twitter">Twitter</a></li>
					<li><a href="#" class="google">GooglePlus</a></li>
					<li><a href="#" class="youtube">YouTube</a></li>
				</ul>
			</div>
			<div class="footer-section">
				<a href="#wrapper" class="back-top">Back to Top</a>
			</div>
		</footer>
	</div>
</body>
</html>