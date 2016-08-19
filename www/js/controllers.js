angular.module('starter.controllers', ['ngCordova','ionic'])

.controller('LoginCtrl', function($scope, ionicMaterialInk, $window, LoginService, $ionicPopup, $ionicLoading, $state) {
    ionicMaterialInk.displayEffect();
    $scope.data = {};
 
    $scope.login = function() {
		$ionicLoading.show({
			content: 'Login...',
			animation: 'fade-in',
			showBackdrop: true,
		});
		if($scope.data.username==""){
			$ionicLoading.hide();
			var alertPopup = $ionicPopup.alert({
				title: 'Login failed!',
				template: 'Please fill your username'
			});

		}
		else if($scope.data.username!=""){
			LoginService.loginUser($scope.data.username,$scope.data.password).success(function(data) {
				//var loginResult = data;
				console.log(data);
				$ionicLoading.hide();
				localStorage.setItem("username",data.username);
				localStorage.setItem("userid",data.userId);
				localStorage.setItem("token",data.id);
				$state.go('app.home');

			}).error(function(data) {
				$ionicLoading.hide();
				var alertPopup = $ionicPopup.alert({
					title: 'Login Failed!',
					template: 'Your username is not in our database'
				});
			});
		}
		else{
			$ionicLoading.hide();
			var alertPopup = $ionicPopup.alert({
				title: 'Login Failed!',
				template: 'Please fill your username'
			});
		}
	}
})

.controller('MainCtrl', function($scope, $ionicPopup,$ionicTabsDelegate,$ionicLoading,$ionicPopover, $state,ProfileService) {
	if(localStorage.getItem("username")==null || localStorage.getItem("username")==""){
		$state.go('login');
	}
	$scope.menuProfile = {};
	$scope.currentLocation = {};

	//do before main view loaded
	$scope.$on('$ionicView.beforeEnter', function(){
		//get user profile data
	
		ProfileService.getProfile(localStorage.getItem("userid"),localStorage.getItem("token")).success(function(data) {
			$scope.menuProfile = data;
			console.log(data);
			$scope.menuProfile.password="";
			$ionicLoading.hide();
		}).error(function(data) {
			$ionicLoading.hide();
			var alertPopup = $ionicPopup.alert({
				title: 'Request Failed!',
				template: 'Error get user profile data'
			});
		});
		$scope.role="customer";
		//get user current location
		if(navigator.geolocation) {
			browserSupportFlag = true;
			navigator.geolocation.getCurrentPosition(function(position) {
				$scope.currentLocation = {"coordinates": [position.coords.longitude,position.coords.latitude],"type": "Point"};
			}, function() {
				$scope.currentLocation = {"coordinates": [112.531359+(Math.random()/100),-7.88016],"type": "Point"};
			});
		}
		else {
			$scope.currentLocation = {"coordinates": [112.531359+(Math.random()/100),-7.88016],"type": "Point"};
		};
	});
	$scope.back = function(){
		$state.go('app.home');
	}
	$scope.logout = function(){
		localStorage.removeItem("username");
		$state.go('login');
	};
})
.controller('HomeCtrl', function($scope, $state, $stateParams, $ionicPopup, $ionicPlatform,$ionicLoading, PostService, $cordovaSocialSharing, $window) { 
	
	$ionicLoading.show({
		content: 'Loading',
		animation: 'fade-in',
		showBackdrop: true,
	});
	$scope.doRefresh = function() {
		$scope.$broadcast('scroll.refreshComplete');
		setTimeout(function (){
			$state.go($state.current, {}, {reload: true});
		}, 500);
	};
	$ionicLoading.hide();

	$scope.dataPost={};
	$scope.$on('$ionicView.enter', function(){
		PostService.getAll(localStorage.getItem("token")).success(function(data) {
			console.log(data);
			$scope.dataPost=data;

		})
		.error(function(data) {
			$ionicLoading.hide();
			var alertPopup = $ionicPopup.alert({
				title: 'Get Data Failed!',
				template: 'Gagal ambil data post'
			});
		});
	});


})

.controller('PostDetailCtrl', function($scope, $state, $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, PostService, ionicMaterialInk, ionicMaterialMotion, $cordovaSocialSharing) {  
	//implement logic here
	ionicMaterialInk.displayEffect();
	$scope.itemData={};
	$scope.$on('$ionicView.enter', function(){
		PostService.getPost($stateParams.dataId).success(function(data) {
			$scope.itemData=data;
			console.log(data.id);

			//Komentar 
			PostService.getComment(data.id).success(function(data) {
				$ionicLoading.hide();
				$scope.komentar=data;
			

			}).error(function(data) {
				$ionicLoading.hide();
				var alertPopup = $ionicPopup.alert({
					title: 'Get Data Failed!',
					template: 'Gagal ambil komentar post'
				});
			});

			PostService.getCommentCount(data.id).success(function(data) {
				$ionicLoading.hide();
				$scope.jumlahKomentar=data;
				if($scope.jumlahKomentar.count==0){
					$scope.jumlahKomentar.count="";
					console.log($scope.jumlahKomentar);	
				}

			}).error(function(data) {
				$ionicLoading.hide();
				var alertPopup = $ionicPopup.alert({
					title: 'Get Data Failed!',
					template: 'Gagal ambil jumlah komentar post'
				});
			});
			//Komentar 

			//Like
			PostService.getLike(data.id).success(function(data) {
				$ionicLoading.hide();
				$scope.Like=data;
			

			}).error(function(data) {
				$ionicLoading.hide();
				var alertPopup = $ionicPopup.alert({
					title: 'Get Data Failed!',
					template: 'Gagal ambil like post'
				});
			});

			PostService.getLikeCount(data.id).success(function(data) {
				$ionicLoading.hide();
				$scope.jumlahLike=data;
				if($scope.jumlahLike.count==0){
					$scope.jumlahLike.count="";
					console.log($scope.jumlahLike);	
				}
			

			}).error(function(data) {
				$ionicLoading.hide();
				var alertPopup = $ionicPopup.alert({
					title: 'Get Data Failed!',
					template: 'Gagal ambil jumlah like post'
				});
			});

			$scope.shareNative = function() {
		     $ionicPlatform.ready(function() {
			  console.log($cordovaSocialSharing);
				  
			  $cordovaSocialSharing
			    .share($scope.itemData.content, $scope.itemData.title, "https://www.google.nl/images/srpr/logo4w.png", "www.google.com") // Share via native share sheet
			    .then(function(result) {
			      // Success!
			       console.log("success");
			    }, function(err) {
			      // An error occured. Show a message to the user
			      console.log("failed");
			    });

			  $cordovaSocialSharing
			    .shareViaTwitter($scope.itemData.content, "https://www.google.nl/images/srpr/logo4w.png", "www.google.com")
			    .then(function(result) {
			      // Success!
			       console.log("success");
			    }, function(err) {
			      // An error occurred. Show a message to the user
			       console.log("failed");
			    });

			  $cordovaSocialSharing
			    .shareViaFacebook($scope.itemData.content, "https://www.google.nl/images/srpr/logo4w.png", "www.google.com")
			    .then(function(result) {
			      // Success!
			       console.log("success");
			    }, function(err) {
			      // An error occurred. Show a message to the user
			       console.log("failed");
			    });

			    $cordovaSocialSharing
			    .shareViaInstagram($scope.itemData.content, "https://www.google.nl/images/srpr/logo4w.png", "www.google.com")
			    .then(function(result) {
			      // Success!
			       console.log("success");
			    }, function(err) {
			      // An error occurred. Show a message to the user
			       console.log("failed");
			    });

			  // access multiple numbers in a string like: '0612345678,0687654321'
			  $cordovaSocialSharing
			    .shareViaSMS($scope.itemData.content, '089521000542')
			    .then(function(result) {
			      // Success!
			       console.log("success");

			    }, function(err) {
			      // An error occurred. Show a message to the user
			       console.log("failed");
			    });

			// toArr, ccArr and bccArr must be an array, file can be either null, string or array
			  $cordovaSocialSharing
			    .shareViaEmail(message, subject, toArr, ccArr, ['bcc', 'bcc'], null)
			    .then(function(result) {
			      // Success!
			       console.log("success");

			    }, function(err) {
			      // An error occurred. Show a message to the user
			       console.log("failed");
			    });

			    $cordovaSocialSharing
			    .canShareVia('instagram', 'msg', null, null)
			    .then(function(result) {
			      // Success!
			       console.log("success");

			    }, function(err) {
			      // An error occurred. Show a message to the user
			       console.log("failed");
			    });

			  $cordovaSocialSharing
			    .canShareViaEmail()
			    .then(function(result) {
			      // Yes we can
			       console.log("success");

			    }, function(err) {
			      // Nope
			       console.log("failed");
			    });
		});
		}
		})
		.error(function(data) {
			$ionicLoading.hide();
			var alertPopup = $ionicPopup.alert({
				title: 'Get Data Failed!',
				template: 'Gagal ambil data post'
			});
		});
		$scope.profile = {};
		$scope.formKomentar={};
		$scope.formLike={};
		PostService.getUser(localStorage.getItem("userid"),localStorage.getItem("token")).success(function(data) {
		$scope.profile = data;
		$scope.formKomentar.employeeId = $scope.profile.id;		
		$scope.formKomentar.employeeName = $scope.profile.name;
		$scope.formKomentar.date = moment().format();
		$scope.formLike.employeeId = $scope.profile.id;
		$scope.formLike.employeeName = $scope.profile.name;
		$scope.profile.password="";
		console.log($scope.formKomentar.employeeId);
		console.log($scope.formLike.employeeId);
		$ionicLoading.hide();
		}).error(function(data) {
			$ionicLoading.hide();
			var alertPopup = $ionicPopup.alert({
				title: 'Error!',
				template: 'Tidak dapat mengambil profil!'
			});
		});
		//Komentar
		$scope.formKomentar={};
			$scope.addKomentar = function(){
			$scope.formKomentar.postId=$scope.itemData.id;
			console.log($scope.formKomentar.employeeId);
			PostService.tambahKomentar($scope.formKomentar).success(function(data) {
				$ionicLoading.hide();
				var alertPopup = $ionicPopup.alert({
					title: 'Succes!',
					template: 'Berhasil post data komentar'
				});
				$state.go($state.current, {}, {reload: true});
			}).error(function(data) {
				$ionicLoading.hide();
				var alertPopup = $ionicPopup.alert({
					title: 'Post Data Failed!',
					template: 'Gagal post data komentar'
				});
			});
		}
		//Komentar

		//Like
		$scope.formLike={};
		$scope.formLike.likeStatus = false;
		console.log($scope.formLike);
		console.log($scope.formLike.id);
		if($scope.formLike.id == undefined){
			console.log("asda");
			$scope.addLike = function(){
			//console.log($scope.formLike.likeStatus);	
			$scope.formLike.postId=$scope.itemData.id;
			$scope.formLike.id=$scope.formLike.employeeId+$scope.formLike.postId;
			console.log($scope.formLike.id);
			console.log($scope.formLike.employeeId);
			console.log($scope.formLike.likeStatus);
			console.log($scope.formLike.likeStatus == false);
			if($scope.formLike.likeStatus == false){
			$scope.formLike.likeStatus = true;
			console.log($scope.formLike.likeStatus);
			PostService.tambahLike($scope.formLike).success(function(data) {
				// $ionicLoading.hide();
				// var alertPopup = $ionicPopup.alert({
				// 	title: 'Succes!',
				// 	template: 'Berhasil like'
				// });
				$state.go($state.current, {}, {reload: true});
			}).error(function(data) {
				// $ionicLoading.hide();
				// var alertPopup = $ionicPopup.alert({
				// 	title: 'Post Data Failed!',
				// 	template: 'Gagal like'
				// });
			});
		}

		}
	}
		//Like
	});
})

.controller('Forgot_passwordCtrl', function($scope, $state, $ionicPopup, $ionicPlatform,$ionicLoading) {  
	//implement logic here
})

.controller('RegisterCtrl', function($scope, $state, RegisterService, $ionicPopup, $ionicPlatform,$ionicLoading) {  
	//implement logic here
	$scope.data={};
	$scope.register = function(){
		RegisterService.tambahUser($scope.data).success(function(data) {
			$ionicLoading.hide();
			var alertPopup = $ionicPopup.alert({
				title: 'Succes!',
				template: 'Berhasil register'
			});

			$state.go('login');
		}).error(function(data) {
			$ionicLoading.hide();
			var alertPopup = $ionicPopup.alert({
				title: 'Post Data Failed!',
				template: 'Gagal register'
			});
		});
	}
})

.controller('Create_postCtrl', function($scope, $state, PostService, $ionicPopup, $ionicPlatform, $ionicLoading, $cordovaImagePicker, $cordovaCamera) {  
	//implement logic here
	$scope.collection = {
        selectedImage : ''
    };
    $scope.data={};
	document.addEventListener("deviceready", function () {
		$scope.uploadImage = function() {
			var options = {
				maximumImagesCount: 1,
				width: 600,
				height: 600,
				quality: 100
			};

			$cordovaImagePicker.getPictures(options).then(function (results) {
				for (var i = 0; i < results.length; i++) {
					$scope.collection.selectedImage = results[i];
					console.log('Image URI: ' + results[i]);
					// $scope.data.category = "Healthy";
					// $scope.data.photo = $scope.image;
					
					window.plugins.Base64.encodeFile($scope.collection.selectedImage, function(base64){  // Encode URI to Base64 needed for contacts plugin
                        $scope.collection.selectedImage = base64;
                      
                    });
				}
			}, function(error) {
				$scope.data.photo="n/a"
			});
		}
	}, false);

	$scope.data.photo = $scope.collection.selectedImage;

	PostService.getUser(localStorage.getItem("userid"),localStorage.getItem("token")).success(function(data) {
		$scope.profile = data;
		$scope.data.writer = $scope.profile.username;
		$scope.data.employee = $scope.profile.id;
		$scope.profile.password="";
		console.log($scope.data.employee);
		$ionicLoading.hide();
	}).error(function(data) {
		$ionicLoading.hide();
		var alertPopup = $ionicPopup.alert({
			title: 'Error!',
			template: 'Tidak dapat mengambil profil!'
		});
	});


	$scope.profile = {};
	$scope.division={};
	$scope.data.date = moment().format();
	
	$scope.data.privacy = "Public";
	$scope.data.priority = "Low";
	
	$scope.tambahPost = function(){
		$scope.data.receiver = $scope.division.receiver1 + $scope.division.receiver2 + $scope.division.receiver3 + $scope.division.receiver4 + $scope.division.receiver5;		
		PostService.tambahPost($scope.data).success(function(data) {
			$ionicLoading.hide();
			localStorage.setItem("postid",data.id);
			console.log(localStorage.getItem("postid"));
			var alertPopup = $ionicPopup.alert({
				title: 'Succes!',
				template: 'Berhasil buat post'
			});
			// $state.go($state.current, {}, {reload: true});
			$state.go('app.home');
		}).error(function(data) {
			$ionicLoading.hide();
			console.log(data)
			var alertPopup = $ionicPopup.alert({
				title: 'Post Data Failed!',
				template: 'Gagal buat post'
			});
		});
	}
})

.controller('ProfileCtrl', function($scope, $state, $ionicPopup, $ionicPlatform, $ionicLoading, LoginService) {  
	//implement logic here
	$scope.profile = {};
	$ionicLoading.show({
		content: 'Loading',
		animation: 'fade-in',
		showBackdrop: true,
	
	});
	
	LoginService.getUser(localStorage.getItem("userid"),localStorage.getItem("token")).success(function(data) {
		$scope.profile = data;
		console.log(data);
		$scope.profile.password="";
		localStorage.setItem("profile_data", JSON.stringify(data));
		$ionicLoading.hide();
	}).error(function(data) {
		$ionicLoading.hide();
		var alertPopup = $ionicPopup.alert({
			title: 'Error!',
			template: 'Tidak dapat mengambil profil!'
		});
	});
})

// .controller('SocialCtrl', function($scope, $cordovaSocialSharing, $ionicPlatform) {

// 	$scope.shareNative = function() {
// 	     $ionicPlatform.ready(function() {
// 		  console.log($cordovaSocialSharing);
		  
// 	  $cordovaSocialSharing
// 	    .share("message", "subject", "https://www.google.nl/images/srpr/logo4w.png", "www.google.com") // Share via native share sheet
// 	    .then(function(result) {
// 	      // Success!
// 	       console.log("success");
// 	    }, function(err) {
// 	      // An error occured. Show a message to the user
// 	      console.log("failed");
// 	    });

// 	  $cordovaSocialSharing
// 	    .shareViaTwitter("message", "https://www.google.nl/images/srpr/logo4w.png", "www.google.com")
// 	    .then(function(result) {
// 	      // Success!
// 	       console.log("success");
// 	    }, function(err) {
// 	      // An error occurred. Show a message to the user
// 	       console.log("failed");
// 	    });

// 	  // $cordovaSocialSharing
// 	  //   .shareViaWhatsApp("message", "https://www.google.nl/images/srpr/logo4w.png", "www.google.com")
// 	  //   .then(function(result) {
// 	  //     // Success!
// 	  //      console.log("success");
// 	  //   }, function(err) {
// 	  //     // An error occurred. Show a message to the user
// 	  //      console.log("failed");
// 	  //   });

// 	  $cordovaSocialSharing
// 	    .shareViaFacebook("message", "https://www.google.nl/images/srpr/logo4w.png", "www.google.com")
// 	    .then(function(result) {
// 	      // Success!
// 	       console.log("success");
// 	    }, function(err) {
// 	      // An error occurred. Show a message to the user
// 	       console.log("failed");
// 	    });

// 	    $cordovaSocialSharing
// 	    .shareViaInstagram("message", "https://www.google.nl/images/srpr/logo4w.png", "www.google.com")
// 	    .then(function(result) {
// 	      // Success!
// 	       console.log("success");
// 	    }, function(err) {
// 	      // An error occurred. Show a message to the user
// 	       console.log("failed");
// 	    });

// 	  // access multiple numbers in a string like: '0612345678,0687654321'
// 	  $cordovaSocialSharing
// 	    .shareViaSMS("message", '089521000542')
// 	    .then(function(result) {
// 	      // Success!
// 	       console.log("success");

// 	    }, function(err) {
// 	      // An error occurred. Show a message to the user
// 	       console.log("failed");
// 	    });

// 	// toArr, ccArr and bccArr must be an array, file can be either null, string or array
// 	  $cordovaSocialSharing
// 	    .shareViaEmail(message, subject, toArr, ccArr, ['bcc', 'bcc'], null)
// 	    .then(function(result) {
// 	      // Success!
// 	       console.log("success");

// 	    }, function(err) {
// 	      // An error occurred. Show a message to the user
// 	       console.log("failed");
// 	    });

// 	  // $cordovaSocialSharing
// 	  //   .canShareVia('whatsapp', 'msg', null, null)
// 	  //   .then(function(result) {
// 	  //     // Success!
// 	  //      console.log("success");

// 	  //   }, function(err) {
// 	  //     // An error occurred. Show a message to the user
// 	  //      console.log("failed");
// 	  //   });

// 	    $cordovaSocialSharing
// 	    .canShareVia('instagram', 'msg', null, null)
// 	    .then(function(result) {
// 	      // Success!
// 	       console.log("success");

// 	    }, function(err) {
// 	      // An error occurred. Show a message to the user
// 	       console.log("failed");
// 	    });

// 	  $cordovaSocialSharing
// 	    .canShareViaEmail()
// 	    .then(function(result) {
// 	      // Yes we can
// 	       console.log("success");

// 	    }, function(err) {
// 	      // Nope
// 	       console.log("failed");
// 	    });
// });
// }
// });

