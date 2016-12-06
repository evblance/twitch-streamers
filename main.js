var streamers = ["ESL_SC2", "OgamingSC2", "cretetion", "storbeck", "freecodecamp", "habathcx", "RobotCaleb", "noobs2ninjas","comster404"];

function getStatus(user) {
  //channelUrl = 'https://api.twitch.tv/kraken/channels/' + user;
  channelUrl = 'https://wind-bow.gomix.me/twitch-api/channels/' + user;

  
  $.ajax({
    type: 'GET',
    //dataType: 'json',
    dataType: 'jsonp',
    contentType: 'application/json; charset=utf-8',
    url: channelUrl,
    success: function(data) {
      var accountClosed = false;
      var streamAvailable = false;
      var userDataHtml = "";

      // check if user is online
      if (data.partner === true) {
        userDataHtml += "<div class='online-user user'>";
        streamAvailable = true;
      } else {
        userDataHtml += "<div class='offline-user user'>";
      }
      if (data.logo !== null) {
        var userImage = 'http' + data.logo.slice(5,data.logo.length);
        console.log(userImage);
        userDataHtml += "<img src='"+userImage+"' class='user-img'/>";  
      }
      userDataHtml += "<a class='user-link' href='"+data.url+"' target='_blank'>";
      userDataHtml += ""+data.display_name+"</a>";
      if (!streamAvailable) {
        userDataHtml += "<br><p class='offline-user-description'>User Offline</p>";
      } else {
        userDataHtml += "<br><p class='online-user-description'>"+data.status+"</p>";
      }
      userDataHtml += "</div>";
      $(userDataHtml).appendTo($('#users-panel'));
    },
    error: function(e) {
      // check if user has closed their account
      if (e.statusText == "Unprocessable Entity") {
        var userDataHtml = "";
        
        userDataHtml += "<div class='offline-user user'>";
        userDataHtml += "<img src='http://vignette3.wikia.nocookie.net/spore/images/6/6c/Question-mark.png/revision/latest?cb=20110427230528' class='user-img'/>"; 
        userDataHtml += "<p style='display:inline;padding-left:10px' class='user-link'>";
        userDataHtml += ""+user+"</p>";
        userDataHtml += "<br><p class='offline-user-description'>Account Closed</p>";
        userDataHtml += "</div>";
        $(userDataHtml).appendTo($('#users-panel'));
      } else {
        console.log(e.message);
        console.log(e.status);
        console.log(e.error);
        alert('An API error has occurred.');
      }
    }
  });
}

$(document).ready(function() {
  $('#refresh').on('click', function() {
    location.reload(true);
  });
 
  // get the streams
  for (var i = 0; i < streamers.length; i++) {
    getStatus(streamers[i]);
  }
 
  $('#show-all.cell').addClass('underlined-cell');
  
  // menu logic
  $('#show-all').on('click', function() {
    $('.cell').removeClass('underlined-cell');
    $(this).addClass('underlined-cell');
    $('.online-user').show();
    $('.offline-user').show();
    // give a border bottom to indicate active?
  });
  $('#show-online').on('click', function() {
    $('.cell').removeClass('underlined-cell');
    $(this).addClass('underlined-cell');
    $('.online-user').show();
    $('.offline-user').hide();
  });
  $('#show-offline').on('click', function() {
    $('.cell').removeClass('underlined-cell');
    $(this).addClass('underlined-cell');
    $('.offline-user').show();
    $('.online-user').hide();
  });
});
