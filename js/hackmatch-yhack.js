var app = angular.module("HackMatch", ["firebase", "ui.keypress"]);
//angular.module('ui.keypress',[]).

function hackmatch($scope, angularFire) {
    var ref = new Firebase("https://hackmatch.firebaseio.com/");

    Parse.initialize("RctpMTJQ1oMw0FYc1pyPfWxaFzdJIh1WVdvGCj6V", "2cbbMkpxIUu0Epj4hOLwww4tFEFLBwNvjhCofW3w");

    //$('#windowTitleDialog').modal('show');
    
    //Initializing variables
    $scope.sites = [];
    $scope.sites[0] = {url: "https://www.apptimize.com/", contactEmail: "nancy@apptimize.com"};
    $scope.user = {email: 'blah', url: 'blah'};
    //$scope.siteUrl = 'url';
    $scope.siteUrl = 'personal website or github';
    $scope.siteEmail = 'email';
    $scope.iframeOne = "http://hackny.org/a/";
    $scope.iframeTwo = "http://www.mongodb.com/";

   	$scope.currentSite = 0;
    //[BIND MODEL HERE]
    //angularFire(ref, $scope, "sites");

    //qs==Query String -- takes url params and hands them to me in a JSON
    $scope.qs = (function(a) {
	    if (a == "") return {};
	    var b = {};
	    for (var i = 0; i < a.length; ++i)
	    {
	        var p=a[i].split('=');
	        if (p.length != 2) continue;
	        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
	    }
	    return b;
	})(window.location.search.substr(1).split('&'));

	$scope.setInitialFilters = function() {
		//just iterate through param tags and check boxes
		var tags = $scope.qs["tags"].split(",");
		for (var i=0; i < tags.length; i++) {
			var checkbox = document.getElementById(tags[i]);
			if (checkbox) {
				checkbox.checked=true;			
			}
		}
	}

	$scope.loadStartupSites = function () {
		var TestSites = Parse.Object.extend("sponsorSites");
		var query = new Parse.Query(TestSites);
		console.log($scope.qs["tags"]);
		if ($scope.qs["tags"]) {
			$scope.setInitialFilters();
			query.containsAll("tags", $scope.qs["tags"].split(","));
		}
		query.descending("updatedAt");
		//if (QueryString) {
		//	console.log('passed');
		//	query.containsAll("tags", [QueryString]);
		//}
		  query.find({
		    success: function(results) {
		    	mixpanel.track("Loaded Sites");
		      //alert("Successfully retrieved " + results.length + " sites.");
		      // Do something with the returned Parse.Object values
		      console.log('blah');
		      //$scope.sites = results;
		      //console.log($scope.sites);
		      console.log(results);
		      //$scope.getCurrentSite();
		      //console.log($scope.sites);
		      //console.log($scope.sites[1]);
		      for (var i = 0; i < results.length; i++) {
		      	console.log(results[i].get('contactEmail') + results[i].get('url'));
		      	//$scope.sites.push(results[i]);
		      	$scope.sites[i+1] = {url: results[i].get('url'), contactEmail: results[i].get('contactEmail')};
		      	$scope.getCurrentSite();
		        //var sites[i] = results[i];
		        console.log('new site');
		      }
		      //making sure it's only uniques
		      console.log('check for uniques')
		      $scope.sites = _.uniq($scope.sites, false, function(site){ return site.url;});
		      console.log($scope.sites);
		      $scope.currentSite = Math.floor((Math.random()*results.length));
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

	$scope.getSites = function () {
		//console.log(_.toArray($scope.sites));
		return _.toArray($scope.sites);
	}

//	$scope.loadSites = function () {
//		console.log($scope.userEmail);
//	}

	$scope.nextSite = function () {
		mixpanel.track("Next");
		//console.log($scope.sites);
		console.log('Next');
		if ($scope.currentSite < $scope.sites.length-1) {
			//angularFire(ref, $scope, "sites");
			$scope.currentSite++;
			//$scope.getCurrentSite();
			//console.log($scope.getSites());
			//$scope.nextSite();
		}
		else {
			$scope.currentSite = 0;
		}
		//$scope.toggle();
	}

	$scope.getCurrentSite = function () {
		return $scope.getSites()[$scope.currentSite];
	};

	$scope.getNextSite = function () {
		return $scope.getSites()[$scope.currentSite + 1];
	};

	$scope.openFilter = function () {
		console.log('filter pressed');
		$('#filterDialog').modal('show');
	}

	$scope.filter = function() {
		var filters = document.getElementsByName("filterCheckBox");
		$scope.addFilters(_.filter(filters, function(tag){ return tag.checked; })); 
		/*
		for (i=0; i < filters.length; i++) {
			if (filters[i].checked) {
				console.log(filters[i].id);
				$scope.addFilter(filters[i].id);
			}
			else {
				console.log('unchecked');
			}
		}
		*/
	}

	$scope.addFilters = function (filters) {
		//check if this is the first filter being added
		//location.search gives ? on 
		location.search = "?tags=" + _.map(filters, function(tag){ return tag.id; }).join();
		/*
		if (location.search) {
			console.log('blahblah');
			location.search += "," + filter;
		}
		else {
			console.log('first filter');
			location.search = "?tags=" + filter;
		}
		*/
	}



	//**update object with the user who expressed interest...maybe make this an array and just push to the array
	$scope.expressedInterest = function () {
		console.log($scope.qs["tags"]);
		mixpanel.track("Interest");
		console.log('Interest');
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
				mixpanel.track("Expressed Interest");
				console.log('Expressed Interest Success');
				$scope.nextSite();
				save();
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

	$scope.toggle = function () {
		if ($scope.currentFrame) {
			$scope.currentFrame = 0;
		}
		else {
			$scope.currentFrame = 1;
		}
	}

	$scope.getFrameOne = function () {
		if (!$scope.currentFrame) {
			return $scope.getCurrentSite().url;
		}
		else {
			return $scope.getNextSite().url;
		}
	}

	$scope.getFrameTwo = function () {
		if ($scope.currentFrame) {
			return $scope.getCurrentSite().url;
		}
		else {
			return $scope.getNextSite().url;
		}
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

	function drawToast(message){
		
		var alert = document.getElementById("toast");
		
		if (alert == null){
			var toastHTML = '<div id="toast">' + message + '</div>';
			document.body.insertAdjacentHTML('beforeEnd', toastHTML);
		}
		else{
			alert.style.opacity = .9;
		}
		
		intervalCounter = setTimeout("hideToast()", 1000);
	}

	function save(){
		//maybe do _startupname_ saved
		//lines = lines.replace("http://","")
    	//lines = lines.replace("www.", "") # May replace some false positives ('www.com')
    	//lines.replace(".com", "") 
    	//lines.replace(".co", "") 
    	//lines.replace(".io", "") 
    	//urls = [url.split('/')[0] for url in lines.split()]
		drawToast("Startup Saved");
	}

}

//$('.website-frame').css('height', $(window).height()+'px');
