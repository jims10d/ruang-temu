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
	$scope.backProfile = function(){
		$state.go('app.profile');
	}
	$scope.logout = function(){
		localStorage.removeItem("username");
		$state.go('login');
	};
})
.controller('HomeCtrl', function($scope, $state, $stateParams, $ionicPopup, $ionicPlatform,$ionicLoading, PostService, $cordovaSocialSharing, $window) { 
	 $scope.formSeen={};
	 $scope.formSeer={};

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

	$scope.profile = {};
	PostService.getUser(localStorage.getItem("userid"),localStorage.getItem("token")).success(function(data) {
		$scope.profile = data;
		$scope.formSeen.employeeId = $scope.profile.id;
		$scope.formSeer.employeeUsername = $scope.profile.name;
		$scope.profile.password="";
		$ionicLoading.hide();

		$scope.dataPost= {};

		PostService.getPostByRole($scope.profile.role).success(function(data) {
			$scope.dataPost = data;
			$ionicLoading.hide();

			data.forEach(function(entry) {	

			    // Comment Count
				PostService.getCommentCount(entry.id).success(function(datatmp) {
					$ionicLoading.hide();
					$scope.jumlahKomentar=datatmp;
					if($scope.jumlahKomentar.count==0){
						$scope.jumlahKomentar.count="";
					}

					entry.jumlahKomentar = $scope.jumlahKomentar.count;

				}).error(function(datatmp) {
					$ionicLoading.hide();
					var alertPopup = $ionicPopup.alert({
						title: 'Get Data Failed!',
						template: 'Gagal ambil jumlah komentar post'
					});
				});

			});

			data.forEach(function(entry) {
			 
				PostService.getLikeCounter(entry.id).success(function(datalike) {
					$ionicLoading.hide();
					$scope.jumlahLike=datalike;
					if($scope.jumlahLike.count==0){
						$scope.jumlahLike.count="";
					}

					entry.jumlahLike = $scope.jumlahLike.count;

				}).error(function(datalike) {
					$ionicLoading.hide();
					var alertPopup = $ionicPopup.alert({
						title: 'Get Data Failed!',
						template: 'Gagal ambil jumlah like post'
					});
				});

			});

			data.forEach(function(entry) {
			   
				PostService.getSharerCounter(entry.id).success(function(datashare) {
					$ionicLoading.hide();
					$scope.jumlahSharer=datashare;
					if($scope.jumlahSharer.count==0){
						$scope.jumlahSharer.count="";
					}

					entry.jumlahSharer = $scope.jumlahSharer.count;

				}).error(function(datashare) {
					$ionicLoading.hide();
					var alertPopup = $ionicPopup.alert({
						title: 'Get Data Failed!',
						template: 'Gagal ambil jumlah share post'
					});
				});

			});
			
		}).error(function(data) {
			$ionicLoading.hide();
			var alertPopup = $ionicPopup.alert({
				title: 'Error!',
				template: 'Tidak dapat mengambil data post'
			});
		});

		// $scope.noMoreItemsAvailable = false;
  
		// 	  $scope.loadMore = function() {
		// 	    $scope.dataPost.push({ id: $scope.dataPost.length});
			   
		// 	    if ( $scope.dataPost.length == 10 ) {
		// 	      $scope.noMoreItemsAvailable = true;
		// 	    }
		// 	    $scope.$broadcast('scroll.infiniteScrollComplete');
		// 	  };
			  
		// 	  $scope.dataPost = [];

	}).error(function(data) {
		$ionicLoading.hide();
		var alertPopup = $ionicPopup.alert({
			title: 'Error!',
			template: 'Tidak dapat mengambil profil!'
		});
	});

	$scope.postDetail = function(id){
	 
	  			$scope.formSeen.postId=id;
				$scope.formSeer.postId=id;

				PostService.addSeen($scope.formSeen).success(function(data) {
					$ionicLoading.hide();
					
				}).error(function(data) {
					$ionicLoading.hide();
					
				});

				PostService.addSeer($scope.formSeer).success(function(data) {
					$ionicLoading.hide();
					
				}).error(function(data) {
					$ionicLoading.hide();
					
				});
	  $state.go('app.post', {'dataId': id});
	 
	};

})

.controller('PostDetailCtrl', function($scope, $state, $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, PostService, ionicMaterialInk, ionicMaterialMotion, $cordovaSocialSharing) {  
	//implement logic here
	ionicMaterialInk.displayEffect();
	$scope.itemData={};
	$scope.$on('$ionicView.enter', function(){
		$scope.checked = false;
		$scope.profile = {};
		$scope.formKomentar={};
		$scope.formLike={};
		$scope.formLiker={};
		$scope.formShared={};
		$scope.formSharer={};
		PostService.getPost($stateParams.dataId).success(function(data) {
			$scope.itemData=data;
		
			PostService.getUser(localStorage.getItem("userid"),localStorage.getItem("token")).success(function(data) {
			$scope.profile = data;
	
			$scope.formKomentar.employeeId = $scope.profile.id;		
			$scope.formKomentar.employeeName = $scope.profile.name;
			$scope.formKomentar.date = moment().format();
			$scope.formLike.employeeId = $scope.profile.id;
			$scope.formLiker.employeeUsername = $scope.profile.name;
			$scope.formShared.employeeId = $scope.profile.id;
			$scope.formSharer.employeeUsername = $scope.profile.name;
			$scope.profile.password="";
			
			$ionicLoading.hide();

			$scope.postLikedArray = $scope.itemData.liker.split(',');
			
			for(var i = 0; i < $scope.postLikedArray.length; i++){
				
				if($scope.postLikedArray[i] === $scope.profile.name){
					$scope.checked = true;
					
				}
			}
			}).error(function(data) {
				$ionicLoading.hide();
				var alertPopup = $ionicPopup.alert({
					title: 'Error!',
					template: 'Tidak dapat mengambil profil!'
				});
			});


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
					
				}

			}).error(function(data) {
				$ionicLoading.hide();
				var alertPopup = $ionicPopup.alert({
					title: 'Get Data Failed!',
					template: 'Gagal ambil jumlah komentar post'
				});
			});
			//Komentar 

			PostService.getLikeCounter(data.id).success(function(data) {
				$ionicLoading.hide();
				$scope.jumlahLike=data;
				if($scope.jumlahLike.count==0){
					$scope.jumlahLike.count="";
					
				}
			
			}).error(function(data) {
				$ionicLoading.hide();
				var alertPopup = $ionicPopup.alert({
					title: 'Get Data Failed!',
					template: 'Gagal ambil jumlah like post'
				});
			});

			PostService.getSharerCounter(data.id).success(function(data) {
				$ionicLoading.hide();
				$scope.jumlahSharer=data;
				if($scope.jumlahSharer.count==0){
					$scope.jumlahSharer.count="";
					
				}
			
			}).error(function(data) {
				$ionicLoading.hide();
				var alertPopup = $ionicPopup.alert({
					title: 'Get Data Failed!',
					template: 'Gagal ambil jumlah share post'
				});
			});

			$scope.shareNative = function() {

				$scope.formShared.postId=$scope.itemData.id;
				$scope.formSharer.postId=$scope.itemData.id;

				PostService.addShared($scope.formShared).success(function(data) {
					$ionicLoading.hide();
					
					$state.go($state.current, {}, {reload: true});
				}).error(function(data) {
					$ionicLoading.hide();
					
				});

				PostService.addSharer($scope.formSharer).success(function(data) {
					$ionicLoading.hide();
					
					$state.go($state.current, {}, {reload: true});
				}).error(function(data) {
					$ionicLoading.hide();
					
				});

		     $ionicPlatform.ready(function() {
			  console.log($cordovaSocialSharing);
				  
			  $cordovaSocialSharing
			    .share($scope.itemData.content, $scope.itemData.title, $scope.itemData.photo, "www.ruangtemu.com") // Share via native share sheet
			    .then(function(result) {
			      // Success!
			       console.log("success");
			    }, function(err) {
			      // An error occured. Show a message to the user
			      console.log("failed");
			    });

			    $cordovaSocialSharing
			    .shareViaInstagram($scope.itemData.content, $scope.itemData.photo, "www.ruangtemu.com")
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
		
		//Komentar
		$scope.formKomentar={};
			$scope.addKomentar = function(){
			$scope.formKomentar.postId=$scope.itemData.id;

			PostService.tambahKomentar($scope.formKomentar).success(function(data) {
				$ionicLoading.hide();
				$state.go($state.current, {}, {reload: true});
			}).error(function(data) {
				$ionicLoading.hide();
			});
		}
		//Komentar
		
		$scope.addLike = function(){
			$scope.checked=true;
			
			$scope.formLike.postId=$scope.itemData.id;
			$scope.formLiker.postId=$scope.itemData.id;

			PostService.addLike($scope.formLike).success(function(data) {
				$ionicLoading.hide();
				
				$state.go($state.current, {}, {reload: true});
			}).error(function(data) {
				$ionicLoading.hide();
				
			});

			PostService.addLiker($scope.formLiker).success(function(data) {
				$ionicLoading.hide();
				
				$state.go($state.current, {}, {reload: true});
			}).error(function(data) {
				$ionicLoading.hide();
				
			});
		}

		$scope.addUnlike = function(){
			$scope.checked=false;

			$scope.formLike.postId=$scope.itemData.id;
			$scope.formLiker.postId=$scope.itemData.id;
			
			PostService.addUnlike($scope.formLike).success(function(data) {
				$ionicLoading.hide();
				
				$state.go($state.current, {}, {reload: true});
			}).error(function(data) {
				$ionicLoading.hide();
				
			});

			PostService.addUnliker($scope.formLiker).success(function(data) {
				$ionicLoading.hide();
				
				$state.go($state.current, {}, {reload: true});
			}).error(function(data) {
				$ionicLoading.hide();
				
			});
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
	$scope.data.postLiked = "";
	$scope.data.postShared = "";
	$scope.data.postSeen = "";
	$scope.data.badges = [{}];
	$scope.data.badgeCount = 0;
	$scope.data.poin = 0;
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
					$scope.image = results[i];
					
					window.plugins.Base64.encodeFile($scope.image, function(base64){  // Encode URI to Base64 needed for contacts plugin
                        $scope.data.photo = base64;
						$scope.data.photo = $scope.data.foto.replace(/(\r\n|\n|\r)/gm,"");
						
                    });
				}
			}, function(error) {
				$scope.data.photo="n/a"
			});
		}
	}, false);

	$scope.profile = {};
	PostService.getUser(localStorage.getItem("userid"),localStorage.getItem("token")).success(function(data) {
		$scope.profile = data;
		$scope.data.writer = $scope.profile.username;
		$scope.data.employee = $scope.profile.id;
		$scope.profile.password="";

		$ionicLoading.hide();
	}).error(function(data) {
		$ionicLoading.hide();
		var alertPopup = $ionicPopup.alert({
			title: 'Error!',
			template: 'Tidak dapat mengambil profil!'
		});
	});
	
	$scope.division={};
	$scope.data.date = moment().format();
	$scope.data.privacy = "Public";
	$scope.data.priority = "Low";
	$scope.data.seen = "";
	$scope.data.liker = "";
	$scope.data.sharer = "";
	
	$scope.tambahPost = function(){
		$scope.data.receiver = $scope.division.receiver1 + $scope.division.receiver2 + $scope.division.receiver3 + $scope.division.receiver4 + $scope.division.receiver5;		
		PostService.tambahPost($scope.data).success(function(data) {
			$ionicLoading.hide();
			localStorage.setItem("postid",data.id);
			
			var alertPopup = $ionicPopup.alert({
				title: 'Succes!',
				template: 'Berhasil buat post'
			});
			$state.go('app.home');

		}).error(function(data) {
			$ionicLoading.hide();
		
			var alertPopup = $ionicPopup.alert({
				title: 'Post Data Failed!',
				template: 'Gagal buat post'
			});
		});
	}
})

.controller('ProfileCtrl', function($scope, $state, $ionicPopup, $ionicPlatform, $ionicLoading, LoginService, $cordovaImagePicker, $cordovaCamera) {  
	//implement logic here
	$scope.profile = {};
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
					$scope.image = results[i];
					
					window.plugins.Base64.encodeFile($scope.image, function(base64){  // Encode URI to Base64 needed for contacts plugin
                        $scope.profile.photo = base64;
						$scope.profile.photo = $scope.profile.foto.replace(/(\r\n|\n|\r)/gm,"");
						
                    });
				}
			}, function(error) {
				$scope.profile.photo="n/a"
			});
		}
	}, false);

	$ionicLoading.show({
		content: 'Loading',
		animation: 'fade-in',
		showBackdrop: true,
	
	});
	
	LoginService.getUser(localStorage.getItem("userid"),localStorage.getItem("token")).success(function(data) {
		$scope.profile = data;
		$ionicLoading.hide();

		 $scope.editProfil = function(){
		 
		 	$scope.profile = data;
	    	LoginService.editUser(localStorage.getItem("userid"),localStorage.getItem("token"),data).success(function(data) {
	    		$ionicLoading.hide();
	    		$scope.profile = data;
	    		var alertPopup = $ionicPopup.alert({
	    			title: 'Edit Data Berhasil!',
	    			template: 'Edit data profil berhasil dilakukan'
	    		});
	    		$state.go('app.profile');
	    	}).error(function(data) {
	    		$ionicLoading.hide();
	    		var alertPopup = $ionicPopup.alert({
	    			title: 'Get Data Failed!',
	    			template: 'Gagal edit profil'
	    		});
	    	});
	    }

	}).error(function(data) {
		$ionicLoading.hide();
		var alertPopup = $ionicPopup.alert({
			title: 'Error!',
			template: 'Tidak dapat mengambil profil!'
		});
	});

})

.controller('LeaderboardCtrl', function($scope, $state, $ionicPopup, $ionicPlatform, $ionicLoading, LoginService, ProfileService) {  
	//implement logic here
	$scope.leaderboard = {};
	$scope.pemenangPertama = {};
	$scope.pemenangKedua = {};
	$scope.pemenangKetiga = {};
	$scope.myLeaderboard = {};
	$scope.myLeaderboardend = false;
	$scope.menuProfile = {}
	$scope.data = {}

	LoginService.getLeaderboard(localStorage.getItem("token")).success(function(data) {

		ProfileService.getProfile(localStorage.getItem("userid"),localStorage.getItem("token")).success(function(dataprofile) {
			$scope.menuProfile = dataprofile;
			$scope.menuProfile.password="";
			$ionicLoading.hide();
			var i = 1;

			data.forEach(function(entry) {	

				if($scope.menuProfile.username === entry.username){
					// console.log("hai");
					$scope.myLeaderboard = entry;
				}
				if($scope.menuProfile.username === entry.username && i>10){
					// console.log("hai");
					$scope.myLeaderboardend = true;
					$scope.myLeaderboard.position = i;
				}
				i++;

			});

			
		}).error(function(dataprofile) {
			$ionicLoading.hide();
			var alertPopup = $ionicPopup.alert({
				title: 'Request Failed!',
				template: 'Error get user profile data'
			});
		});

		$scope.leaderboard = data;
		console.log(data);
		$ionicLoading.hide();

		$scope.pemenangPertama = data[0];
		$scope.pemenangKedua = data[1];
		$scope.pemenangKetiga = data[2];
		console.log($scope.pemenangPertama);


	}).error(function(data) {
		$ionicLoading.hide();
		var alertPopup = $ionicPopup.alert({
			title: 'Error!',
			template: 'Tidak dapat mengambil data leaderboard'
		});
	});
})


