var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var players = new Array();
var players_list = ["ytpl-player1", "ytpl-player2", "ytpl-player3"];

var nowPlaying = "ytpl-playing";
var nowPlayingClass = "." + nowPlaying;

function getPlaylistData(playerName) {
  var apiKey = 'AIzaSyDI4rWo_wVAxRZEIgF6_8sRZDj8OCOZZ38';
  var url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet';
  var data = {
    'playlistId': $('#' + playerName).data('pl'),
    'key': apiKey,
    'maxResults': 50
  };

  $.get(url, data, function(e) {
    buildHTML(playerName, e.items)
  })
}

function buildHTML(playerName, data) {
  var list_data = '';
  data.forEach(function(e, i) {
    var item = e.snippet;
    if (item.thumbnails) {
      list_data += '<li><button data-ytpl-index="' + i + '" data-ytpl-title="' + item.title + '" data-ytpl-desc="' + item.description + '"><p>' + item.title + '</p><img alt="' + item.title + '" src="' + item.thumbnails.medium.url + '"/></button></li>';
    }
  });
  $('#' + playerName).closest('.ypt_wrapper').find('.ytpl--thumbs').html(list_data);
}

// generate playlist items once main player has loaded
function onPlayerReady(event) {
  getPlaylistData(event.target.name);
}

function onYouTubeIframeAPIReady() {
  for (item in players_list) {
    players[players_list[item]] = new YT.Player(players_list[item], {
      height: '360',
      width: '640',
      playerVars: {
        listType: 'playlist',
        list: $('#' + players_list[item]).data('pl')
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
    players[players_list[item]].name = players_list[item];
  }
}

function updateTitles($this) {
  $('#ytpl-title').text($this.data('ytpl-title'))
  $('#ytpl-desc').text($this.data('ytpl-desc'))
}

function onPlayerStateChange(event) {
  var $buttons = $('#' + event.target.name).closest('.ypt_wrapper').find('.ytpl--thumbs').find('button');

  var currentIndex = event.target.getPlaylistIndex();

  // remove existing active class, add to currently playing
  if (event.data === YT.PlayerState.PLAYING) {
    $buttons.removeClass(nowPlaying);
    $buttons.eq(currentIndex).addClass(nowPlaying);
  }

  // if last video has finished playing
  if (event.data === YT.PlayerState.ENDED && currentIndex === $buttons.length - 1) {
    $buttons.removeClass(nowPlaying);
  }
  updateTitles($buttons.eq(currentIndex))
}

// handle playlist button click
$(document).on('click', '[data-ytpl-index]:not(".ytpl-playing")', function(e) {
  e.preventDefault();
  var $this = $(this);
  var index = $this.data('ytpl-index');
  var playerName = $(this).closest('.ypt_wrapper').find('iframe').attr('id');
  updateTitles($this);

  if (navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {
    players[playerName].cuePlaylist({
      listType: 'playlist',
      list: $('#' + players_list[playerName]).data('pl'),
      index: index,
      suggestedQuality: 'hd720'
    });
  } else {
    players[playerName].playVideoAt(index); //Play the new video, does not work for IOS 7
  }
});
