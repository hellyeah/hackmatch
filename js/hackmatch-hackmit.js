var app = angular.module("HackMatch", ["firebase", "ui.keypress"]);
//angular.module('ui.keypress',[]).

function hackmatch($scope, angularFire) {
    var ref = new Firebase("https://hackmatch.firebaseio.com/");

    Parse.initialize("RctpMTJQ1oMw0FYc1pyPfWxaFzdJIh1WVdvGCj6V", "2cbbMkpxIUu0Epj4hOLwww4tFEFLBwNvjhCofW3w");
    
    //Initializing variables
    $scope.sites = [];
    $scope.user = {email: 'blah', url: 'blah'};
    $scope.siteUrl = 'url';
    $scope.siteEmail = 'email'
    $scope.iframeOne = "http://hackny.org/a/"
    $scope.iframeTwo = "http://www.mongodb.com/"
    //[BIND MODEL HERE]
    angularFire(ref, $scope, "sites");

    var QueryString = function () {
	  // This function is anonymous, is executed immediately and 
	  // the return value is assigned to QueryString!
	  var query_string = {};
	  var query = window.location.search.substring(1);
	  var vars = query.split("&");
	  for (var i=0;i<vars.length;i++) {
	    var pair = vars[i].split("=");
	    	// If first entry with this name
	    if (typeof query_string[pair[0]] === "undefined") {
	      query_string[pair[0]] = pair[1];
	    	// If second entry with this name
	    } else if (typeof query_string[pair[0]] === "string") {
	      var arr = [ query_string[pair[0]], pair[1] ];
	      query_string[pair[0]] = arr;
	    	// If third or later entry with this name
	    } else {
	      query_string[pair[0]].push(pair[1]);
	    }
	  } 
	  if (query_string) {
	    return _.toArray(query_string);
	  }
	  else {
	  	return [""];
	  }
	} ();

	console.log(QueryString);

   	$scope.loadSites = function () {
		var TestSites = Parse.Object.extend("hackerSites");
		var query = new Parse.Query(TestSites);
		//query.containsAll("tags", [QueryString]);
		  query.find({
		    success: function(results) {
		      //alert("Successfully retrieved " + results.length + " sites.");
		      // Do something with the returned Parse.Object values
		      $scope.sites = results;
		      console.log(results);
		      console.log('blah');
		      //$scope.getCurrentSite();
		      //console.log($scope.sites);
		      //console.log($scope.sites[1]);
		      //for (var i = 0; i < results.length; i++) { 
		      //  var sites[i] = results[i];
		        //$('iframe').attr("src", object.get('url'));
		        //window.name = object.get('contactEmail');
		      //}
		    },
		    error: function(error) {
		      alert("Error: " + error.code + " " + error.message);
		    }
		  });
	}

	$scope.loadStartupSites = function () {
		var TestSites = Parse.Object.extend("sponsorSites");
		var query = new Parse.Query(TestSites);
		//query.containsAll("tags", [QueryString]);
		query.containsAll("tags", ["mhacks","hackmit"]);
		  query.find({
		    success: function(results) {
		      //alert("Successfully retrieved " + results.length + " sites.");
		      // Do something with the returned Parse.Object values
		      console.log('blah');
		      $scope.sites = results;
		      console.log($scope.sites);
		      console.log(results);
		      //$scope.getCurrentSite();
		      //console.log($scope.sites);
		      //console.log($scope.sites[1]);
		      for (var i = 0; i < results.length; i++) {
		      	console.log(results[i].get('contactEmail'));
		      	//$scope.sites.push(results[i]);
		      	$scope.sites.push({url: results[i].get('url'), contactEmail: results[i].get('contactEmail')});

		        //var sites[i] = results[i];
		      }
		        //$('iframe').attr("src", object.get('url'));
		        //window.name = object.get('contactEmail');
		      //}
		    },
		    error: function(error) {
		      alert("Error: " + error.code + " " + error.message);
		    }
		  });
	}

	$scope.loadStartupSites();



	$scope.currentSite = 0;

	$scope.getSites = function () {
		//console.log(_.toArray($scope.sites));
		return _.toArray($scope.sites);
	}

//	$scope.loadSites = function () {
//		console.log($scope.userEmail);
//	}

	$scope.nextSite = function () {
		console.log($scope.sites);
		$scope.currentSite++;
		//$scope.toggle();
	}

	$scope.getCurrentSite = function () {
		console.log($scope.getSites()[$scope.currentSite])
		return $scope.getSites()[$scope.currentSite];
	};

	$scope.getNextSite = function () {
		return $scope.getSites()[$scope.currentSite + 1];
	};


	//**update object with the user who expressed interest...maybe make this an array and just push to the array
	$scope.expressedInterest = function () {
		if ($scope.siteEmail=="email") {
			$('#windowTitleDialog').modal('show');
		}
		else {
			$scope.interested();
		}
	}

	$scope.interested = function () {
		console.log($scope.siteEmail);
		console.log($scope.siteUrl);
		//if ($scope.siteEmail=="email") {
		//	$('#windowTitleDialog').modal('show');
		//}
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
			interestingStartups: $scope.getCurrentSite().email,
			startupURL: $scope.getCurrentSite().url
		},
		{
			success: function(object) {
				console.log('interest');
				//$scope.nextSite();
			},
			error: function(model, error) {

			}
		});
	}


	//Filter by hackathon


	//add to firebase for hackers sites
	$scope.addSite = function () {
		var Site = Parse.Object.extend("testSites");
		var site = new Site();
		$scope.user.email = $scope.siteEmail;
		$scope.user.url = $scope.siteUrl;
		//$scope.toggle();
		//**Force this upon arrival to the site
		//$scope.user = {email: $scope.siteEmail, url: $scope.siteUrl};
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
            //$scope.siteUrl = "";
			//$scope.siteEmail = "";
			$scope.interested();
          },
          error: function(model, error) {
            //$(".error").show();
          }
        });


		//$scope.siteUrl = "";
		//$scope.siteEmail = "";
	}

	$scope.iframeSite = function () {
		return $scope.getCurrentSite().url;
	}

	$scope.currentFrame = 0;
/*
	$scope.toggle = function () {
		if ($scope.currentFrame) {
			$scope.currentFrame = 0;
			$scope.iframeOne = $scope.getCurrentSite().url;
			$scope.iframeTwo = $scope.getNextSite().url;
		}
		else {
			$scope.currentFrame = 1;
			$scope.iframeTwo = $scope.getCurrentSite().url;
			$scope.iframeOne = $scope.getNextSite().url;
		}
	}
*/

	$scope.myValue = function () {
		return ($scope.currentSite) % 2;
	}

	$scope.yourValue = function () {
		return !$scope.myValue;
	}


}

//$('.website-frame').css('height', $(window).height()+'px');