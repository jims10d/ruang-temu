angular.module('starter', ['ionic', 'ionic-material', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleLightContent();
    }

    var notificationOpenedCallback = function(jsonData) {
    console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
    };

    window.plugins.OneSignal.init("AIzaSyBezJaqwAvdkThPIkgWNy2xn9xefoNb1Z0",
                                   {googleProjectNumber: "767579808901"},
                                   notificationOpenedCallback);
    
    // Show an alert box if a notification comes in when the user is in your app.
    window.plugins.OneSignal.enableInAppAlertNotification(true);
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider,$compileProvider) {
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):|data:image\//);
  // Enable Native Scrolling on Android
  $ionicConfigProvider.platform.android.scrolling.jsScrolling(false);
  $stateProvider
  
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  .state('register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'RegisterCtrl'
  })
  
  // setup an abstract state for the side menu directive
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'MainCtrl'
  })

  // Each tab has its own nav history stack:

  .state('app.dash', {
    cache:false,
    url: '/dash',
    views: {
      'menuContent': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'MapCtrl'
      }
    }
  })
  .state('app.home', {
    url: '/home',
    views: {
      'home': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    }
  })
  .state('app.homepage', {
    url: '/homepage',
    views: {
      'home': {
        templateUrl: 'templates/homepage.html',
        controller: 'HomeCtrl'
      }
    }
  })
  .state('app.post', {
    url: '/post/:dataId',
    views: {
      'home': {
        templateUrl: 'templates/post.html',
        controller: 'PostDetailCtrl'
      }
    }
  })
  // .state('app.post-view', {
  //   url: '/post-view',
  //   views: {
  //     'home': {
  //       templateUrl: 'templates/post-view.html',
  //       controller: 'PostDetailCtrl'
  //     }
  //   }
  // })
  .state('app.profile', {
    url: '/profile',
    views: {
      'home': {
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })
  .state('app.userProfile', {
    url: '/userProfile/:username',
    views: {
      'home': {
        templateUrl: 'templates/userProfile.html',
        controller: 'UserProfileCtrl'
      }
    }
  })
  .state('app.create_Message', {
    url: '/create_Message',
    views: {
      'home': {
        templateUrl: 'templates/create_message.html',
        controller: 'Create_MessageCtrl'
      }
    }
  })
  .state('app.leaderboard', {
    url: '/leaderboard',
    views: {
      'home': {
        templateUrl: 'templates/leaderboard.html',
        controller: 'LeaderboardCtrl'
      }
    }
  })
   .state('app.message', {
    url: '/message',
    views: {
      'home': {
        templateUrl: 'templates/message.html',
        controller: 'MessageCtrl'
      }
    }
  })

  .state('app.message_detail', {
  url: '/message_detail/:username',
  views: {
    'home': {
      templateUrl: 'templates/message_detail.html',
      controller: 'MessageDetailCtrl'
    }
  }
  })
 .state('app.contacts', {
    url: '/contacts',
    views: {
      'home': {
        templateUrl: 'templates/contacts.html',
        controller: 'MessageCtrl'
      }
    }
  })
   .state('app.edit_profile', {
    url: '/edit_profile',
    views: {
      'home': {
        templateUrl: 'templates/edit_profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })
  .state('app.create_post', {
    url: '/create_post',
    views: {
      'home': {
        templateUrl: 'templates/create_post.html',
        controller: 'Create_postCtrl'
      }
    }
  })
  .state('app.forgot_password', {
    url: '/forgot_password',
    views: {
      'home': {
        templateUrl: 'templates/forgot_password.html',
        controller: 'Forgot_passwordCtrl'
      }
    }
  })
  .state('app.change_password', {
    url: '/change_password',
    views: {
      'home': {
        templateUrl: 'templates/change_password.html',
        controller: 'ProfileCtrl'
      }
    }
  })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');

});
