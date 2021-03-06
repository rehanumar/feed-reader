/* app.js
 *
 * This is our RSS feed reader application. It uses the Google
 * Feed Reader API to grab RSS feeds as JSON object we can make
 * use of. It also uses the Handlebars templating library and
 * jQuery.
 */

// The names and URLs to all of the feeds we'd like available.
var allFeeds = [
    {
        name: 'Css Tricks',
        url: 'https://css-tricks.com/feed/'
    }, {
        name: 'Smashing Magazine',
        url: 'https://www.smashingmagazine.com/feed/'
    }, {
        name: 'Udacity Blogs',
        url: 'https://blog.udacity.com/feed'
    }, {
        name: 'Linear Digressions',
        url: 'http://feeds.feedburner.com/udacity-linear-digressions'
    }, {
        name: 'HTML5 Rocks',
        url: 'https://www.html5rocks.com/en/sitemap.xml'
    }, {
        name: 'Mozilla Developer Networks Guide',
        url: 'https://developer.mozilla.org/en-US/docs/feeds/rss/tag/Guide'
    }, {
        name: 'Open AI',
        url: 'https://blog.openai.com/rss/'
    }, {
        name: 'DeepLearning.Net',
        url: 'http://deeplearning.net/feed/'
    }, {
      name: 'DAWN News',
      url: 'http://www.dawn.com/feeds/home'
    }, {
      name: 'Business Insider',
      url: 'http://www.businessinsider.com/rss'
    }, {
      name: 'Business Plus TV',
      url: 'http://www.businessplustv.pk/feed/'
    }, {
      name: 'Business Recorder',
      url: 'http://www.brecorder.com/feed/'
    }, {
      name: 'Express Tribune',
      url: 'https://tribune.com.pk/feed/'
    }
];

/* This function starts up our application. The Google Feed
 * Reader API is loaded asynchonously and will then call this
 * function when the API is loaded.
 */
function init() {
    // Load the first feed we've defined (index of 0).
    loadFeed(0);
}

/* This function performs everything necessary to load a
 * feed using the Google Feed Reader API. It will then
 * perform all of the DOM operations required to display
 * feed entries on the page. Feeds are referenced by their
 * index position within the allFeeds array.
 * This function all supports a callback as the second parameter
 * which will be called after everything has run successfully.
 */
 function loadFeed(id) {
     var feedUrl = allFeeds[id].url, feedName = allFeeds[id].name;

     $.ajax({
       type: "POST",
       url: "https://cors-anywhere.herokuapp.com/" + feedUrl,
       contentType:"text/plain",
       method: 'GET',
       dataType: "xml",
       converters: {"text xml": jQuery.parseXML},
       crossDomain: true,
       success: function (result, status) {
                console.log(result);
                 var container = $('.feed'),
                     title = $('.header-title'),
                     entries = Array.prototype.slice.call(result.getElementsByTagName('item')),
                     entriesLen = entries.length,
                     newEntry,
                     entryTemplate = Handlebars.compile($('.tpl-entry').html());

                 title.html(feedName);   // Set the header text
                 container.empty();      // Empty out all previous entries

                 /* Loop through the entries we just loaded via the Google
                  * Feed Reader API. We'll then parse that entry against the
                  * entryTemplate (created above using Handlebars) and append
                  * the resulting HTML to the list of entries on the page.
                  */
                 entries.forEach(function(entry) {
                   newEntry = {
                     title: entry.getElementsByTagName('title')[0].textContent,
                     link: entry.getElementsByTagName('link')[0].textContent,
                     publishDate: entry.getElementsByTagName('pubDate')[0].textContent
                   }
                   container.append(entryTemplate(newEntry));
                 });
               },
       error: function (result, status, err) {
                 alert(result);
                 console.log('status: ', status);
                 console.log('err: ', err);
               }
     });
 }

/* Google API: Loads the Feed Reader API and defines what function
 * to call when the Feed Reader API is done loading.
 */
google.load('feeds', '1');
google.setOnLoadCallback(init);

/* All of this functionality is heavily reliant upon the DOM, so we
 * place our code in the $() function to ensure it doesn't execute
 * until the DOM is ready.
 */
$(function() {
    var container = $('.feed'),
        feedList = $('.feed-list'),
        feedItemTemplate = Handlebars.compile($('.tpl-feed-list-item').html()),
        feedId = 0,
        menuIcon = $('.menu-icon-link');

    /* Loop through all of our feeds, assigning an id property to
     * each of the feeds based upon its index within the array.
     * Then parse that feed against the feedItemTemplate (created
     * above using Handlebars) and append it to the list of all
     * available feeds within the menu.
     */
    allFeeds.forEach(function(feed) {
        feed.id = feedId;
        feedList.append(feedItemTemplate(feed));

        feedId++;
    });

    /* When a link in our feedList is clicked on, we want to hide
     * the menu, load the feed, and prevent the default action
     * (following the link) from occurring.
     */
    feedList.on('click', 'a', function() {
        var item = $(this);

        $('body').addClass('menu-hidden');
        loadFeed(item.data('id'));
        return false;
    });

    /* When the menu icon is clicked on, we need to toggle a class
     * on the body to perform the hiding/showing of our menu.
     */
    menuIcon.on('click', function() {
        $('body').toggleClass('menu-hidden');
    });
}());
