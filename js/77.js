
const API_KEY = 'AIzaSyAgebn6uh2KDliTk88VS3A1fpjpdNJ5wmA';
const API_ID = '158727218646-ddau54es4kl6r76r24sc16ttfhgoi98t.apps.googleusercontent.com';
const PLAYLIST_ID = 'UUnpSZboK4AIfI7RmV6O6vwQ';

var videoVisible = 0;
var maxVideoVisible = 50;

const playlistItems = [];
const playlist = document.getElementsByClassName("playlist")[0];

// From Google API Docs
function initAPIClient() {
  gapi.load("client:auth2", function() {
    gapi.auth2.init({client_id: API_ID});
    loadClient().then(getPlaylistItems);
  });  
};

// From Google API Docs
function loadClient() {
  gapi.client.setApiKey(API_KEY);
  return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
    .then(
    function() { 
      console.log("GAPI client loaded for API"); },
    function(err) { 
      console.error("Error loading GAPI client for API", err); 
    });
}

function getPlaylistItems(pageToken) {
    return gapi.client.youtube.playlistItems.list({
      "part": "snippet,contentDetails",
      "maxResults": 50, // This is the maximum available value, according to the google docs
      "playlistId": PLAYLIST_ID,
      pageToken
    })
      .then(function(response) {
      const { items, nextPageToken } = response.result;
      
      // The items[] is an array of a playlist items.
      // nextPageToken - if empty - there are no items left to fetch
      
      playlistItems.push(...items);
      
      // It's up to you, how to handle the item from playlist. 
      // Add `onclick` events to navigate to another video, or use another thumbnail image quality 
      var index = 0;
      items.forEach(function(item) {
          const thumbnailItem = createPlaylistItem(item, index);
          playlist.appendChild(thumbnailItem);
          index++;
        });
      
      maxVideoVisible = index - 3;
      

      // Recursively get another portion of items, if there any left
      if (nextPageToken) {
        getPlaylistItems(nextPageToken);        
      }
    },
  function(err) { console.error("Execute error", err); });
}

function createPlaylistItem(i, index) {
  var changeIndex = index;
  const item = document.createElement('div');
  item.classList.add('playlist-item');
  item.style.background = `url(https://i.ytimg.com/vi/${i.snippet.resourceId.videoId}/mqdefault.jpg) no-repeat center`;
  item.style.backgroundSize = 'contain';
  item.id = index.toString();
  item.addEventListener("click", function(){ 
   // document.getElementById('iframe_yt').src = "https://www.youtube.com/embed?listType=playlist&list=UUnpSZboK4AIfI7RmV6O6vwQ&autoplay=1&index=" + changeIndex.toString();
	  window.open("https://www.youtube.com/watch?list=UUnpSZboK4AIfI7RmV6O6vwQ&v=" + i.snippet.resourceId.videoId);
  });
  return item;
};

// Before doing any action with the API ->
initAPIClient();

function goUp(){
  if (videoVisible > 0){
    videoVisible--;
    document.getElementById(videoVisible.toString()).style.height = "90px";
  }
}
function goDown(){
    if (videoVisible < 50){
      document.getElementById(videoVisible.toString()).style.height = "0px";
     videoVisible++;    
  }  
}
// JavaScript Document