var app = angular.module("HackMatch", ["firebase"]);

function hackmatch($scope, angularFire) {
    var ref = new Firebase("https://hackmatch.firebaseIO.com/");
    Parse.initialize("RctpMTJQ1oMw0FYc1pyPfWxaFzdJIh1WVdvGCj6V", "2cbbMkpxIUu0Epj4hOLwww4tFEFLBwNvjhCofW3w");
    
    //$scope.messages = [];
    //[BIND MODEL HERE]
    //angularFire(ref, $scope, "sites");

    //$scope.site = $scope.sites.url;
    //$scope.site = 

	//Hackmatch stuff

	//load from parse/firebase and then keep track of index?
	$scope.sites = [
		{url: 'http://rjvir.com', email: 'raj@rjvir.com'},
		{url: 'http://davefontenot.com', email: 'gailees@umich.edu'}
	];

	$scope.currentSite = 0;

	$scope.nextSite = function () {
		$scope.currentSite++;
	}

	$scope.getCurrentSite = function () {
		//return $scope.sites[$scope.currentSite];
		console.log($scope.sites)
		return $scope.sites;
		//return 5;
	};

	//save new url/email to firebase
	$scope.addSite = function () {
		//$scope.myDataRef = new Firebase('https://hackmatch.firebaseIO.com/');
		//$scope.sites.push({url: $scope.siteUrl, email: $scope.siteEmail});
		//var now = new Date(); 
		//var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());

		//ref.push({url: $scope.siteUrl, email: $scope.siteEmail, time: now_utc});

		var TestObject = Parse.Object.extend("TestObject");
		var testObject = new TestObject();
		testObject.save({foo: "bar"}, {
		  success: function(object) {
		    alert("yay! it worked");
		  }
		});

		var Site = Parse.Object.extend("testSites");
        var site = new Site();
          site.save({url: $scope.siteUrl, contactEmail: $scope.siteEmail}, {
          success: function(object) {
            //$(".success").show();
            alert('Success!');
            //$('#dialog-form').toggle();
            $scope.siteUrl = "";
			$scope.siteEmail = "";
          },
          error: function(model, error) {
            //$(".error").show();
          }
        });

	}

	$scope.getSites = function () {
		return $scope.sites;
	}

}