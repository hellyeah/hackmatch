var app = angular.module("HackMatch", ["firebase"]);

function hackmatch($scope, angularFire) {
    var ref = new Firebase("https://hackmatch.firebaseio.com/");

    Parse.initialize("RctpMTJQ1oMw0FYc1pyPfWxaFzdJIh1WVdvGCj6V", "2cbbMkpxIUu0Epj4hOLwww4tFEFLBwNvjhCofW3w");
	var Site = Parse.Object.extend("testSites");
	var site = new Site();
    
    $scope.sites = [];
    $scope.user = {email: 'blah', url: 'blah'};
    //[BIND MODEL HERE]
    angularFire(ref, $scope, "sites");


	$scope.currentSite = 0;

	$scope.getSites = function () {
		//console.log(_.toArray($scope.sites));
		return _.toArray($scope.sites);
	}

//	$scope.loadSites = function () {
//		console.log($scope.userEmail);
//	}

	$scope.nextSite = function () {
		//console.log($scope.sites);
		$scope.currentSite++;
	}

	$scope.getCurrentSite = function () {
		return $scope.getSites()[$scope.currentSite];
	};


	//**update object with the user who expressed interest...maybe make this an array and just push to the array
	$scope.interested = function () {
		//set bool to true if interested or false if not interested...maybe just append to the user parse data the email of the company
		//userEmail
		//site.save(null, {
		//	success: function(site) {
		//**NEED to just find a way to update the interestingStartups column of the original testSites object so I can just addunique
		var Interest = Parse.Object.extend("interest");
		var interest = new Interest();
		//site.addUnique("interestingStartups", $scope.getCurrentSite.email);
		interest.save({
			contactEmail: $scope.user.email,
			url: $scope.user.url,
			interestingStartups: $scope.getCurrentSite().email
		},
		{
			success: function(object) {
				console.log('interest');
				$scope.nextSite();
			},
			error: function(model, error) {

			}
		});
	}


	//Filter by hackathon


	//add to firebase for hackers sites
	$scope.addSite = function () {
		//**Force this upon arrival to the site
		$scope.user = {email: $scope.siteEmail, url: $scope.siteUrl};
		//**VALIDATION
		//Checkboxes for hackathons
		//$scope.myDataRef = new Firebase('https://hackmatch.firebaseIO.com/');
		//$scope.sites.push({url: $scope.siteUrl, email: $scope.siteEmail});
		var now = new Date().valueOf();

		ref.push({url: $scope.siteUrl, email: $scope.siteEmail, time: now});

        site.save({url: $scope.siteUrl, contactEmail: $scope.siteEmail}, {
          success: function(object) {
            //$(".success").show();
            //alert('Success!');
            //$('#dialog-form').toggle();
            $scope.siteUrl = "";
			$scope.siteEmail = "";
          },
          error: function(model, error) {
            //$(".error").show();
          }
        });


		$scope.siteUrl = "";
		$scope.siteEmail = "";
	}

/*
	$scope.loadSites = function () {
		var TestSites = Parse.Object.extend("testSites");
		var query = new Parse.Query(TestSites);
		  query.find({
		    success: function(results) {
		      //alert("Successfully retrieved " + results.length + " sites.");
		      // Do something with the returned Parse.Object values
		      $scope.sites = results;
		      console.log($scope.sites);
		      console.log($scope.sites[1]);
		      //for (var i = 0; i < results.length; i++) { 
		      //  var object = results[i];
		      //  $('iframe').attr("src", object.get('url'));
		      //  window.name = object.get('contactEmail');
		      //}
		    },
		    error: function(error) {
		      alert("Error: " + error.code + " " + error.message);
		    }
		  });
	}

	//save new url/email to firebase
	$scope.addSite = function () {
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
*/

}