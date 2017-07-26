var app = angular.module('twitchApp', []);

app.controller('twitchCtrl', function($scope, $http) {

  $scope.baseUrl = 'https://wind-bow.gomix.me/twitch-api/channels/';

  $scope.streamerArr = [
    "ESL_SC2",
    "OgamingSC2",
    "cretetion",
    "freecodecamp",
    "habathcx",
    "RobotCaleb",
    "noobs2ninjas"
  ];

  $scope.loadingStatus = true;

  $scope.allStreamers = [];

  $scope.onlineStreamers = [];

  $scope.offlineStreamers = [];

  $scope.activeTab = 1;

  // function that checks whether the refresh button should be spinning
  $scope.adjustLoadingStatus = function() {
    if ($scope.streamerArr.length === $scope.allStreamers.length) {
      $scope.loadingStatus = false;
      return;
    }
    $scope.loadingStatus = true;
  };

  $scope.streamsAreLoading = function() {
    return $scope.loadingStatus;
  };

  $scope.tabIsActive = function(index) {
    return $scope.activeTab === index;
  };

  $scope.setActiveTab = function(index) {
    $scope.activeTab = index;
  };

  $scope.showTab = function(index) {

    $scope.setActiveTab(index);

    switch(index) {
      case 1:
        $scope.shownStreamers = $scope.allStreamers;
        break;
      case 2:
        $scope.shownStreamers = $scope.onlineStreamers;
        break;
      case 3:
        $scope.shownStreamers = $scope.offlineStreamers;
        break;
    }
  };

  // function that checks whether a user is in online user array
  $scope.userOnline = function(user) {
    var numStreamers = $scope.onlineStreamers.length;
    for (var i = 0; i < numStreamers; i++) {
      if (user.name === $scope.onlineStreamers[i].name) {
        return true;
      }
    }
    return false;
  };

  // function that retrieves the streams based on the names in the model
  $scope.getStreams = function() {

    $scope.allStreamers = [];
    $scope.onlineStreamers = [];
    $scope.offlineStreamers = [];
    $scope.adjustLoadingStatus();

    $scope.streamerArr.forEach(function(streamer) {
      var streamerUrl = $scope.baseUrl + streamer + '?callback=JSON_CALLBACK';
      $http.jsonp(streamerUrl)
        .success(getStreamsSuccess)
        .error(getStreamsError.bind(streamer));
    });
  };

  function getStreamsSuccess(response) {
    var data = response;
    $scope.allStreamers.push(data);
    if (data.status === 404) {
      data.status = 'Non-existent User';
      $scope.offlineStreamers.push(data);
    } else if (data.partner === false) {
      data.status = 'User Offline';
      $scope.offlineStreamers.push(data);
    } else {
      $scope.onlineStreamers.push(data);
    }
    $scope.adjustLoadingStatus();
    $scope.showTab($scope.activeTab);
  }

  function getStreamsError(error) {
      console.log('Error', error.status, 'retrieving a data for streamer \'', this, '\':', error.message, '; gave error:', error.error);
  }

  // load the streams upon initialisation
  $scope.getStreams();

});
