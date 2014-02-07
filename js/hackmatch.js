var app = angular.module("HackMatch", ["firebase", "ui.keypress"]);
//angular.module('ui.keypress',[]).

function hackmatch($scope, angularFire) {
    var ref = new Firebase("https://hackmatch.firebaseio.com/");

    $scope.testCloudCode = function() {
    	console.log('blah')
    }

    Parse.initialize("RctpMTJQ1oMw0FYc1pyPfWxaFzdJIh1WVdvGCj6V", "2cbbMkpxIUu0Epj4hOLwww4tFEFLBwNvjhCofW3w");
    

    $('#windowTitleDialog').modal('show');
    
    //Initializing variables
    $scope.sites = [];
    //have to preload so that everything works while I'm waiting for Parse
    $scope.sites[0] = {url: "https://www.thalmic.com/en/myo/", contactEmail: "stephen@thalmic.com"};
    $scope.sites[1] = {url: "https://www.watchsend.com/", contactEmail: "zain@watchsend.com"};
    $scope.user = {email: 'blah', url: 'blah'};
    //$scope.siteUrl = 'url';
    $scope.siteUrl = '';
    $scope.siteEmail = '';
    $scope.resumeURL = "";
    $scope.year = "freshman";
    //$scope.iframeOne = "http://hackny.org/a/";
    //$scope.iframeTwo = "http://www.mongodb.com/";

   	$scope.currentSite = 0;
   	$scope.hideOriginalIframe = false;
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
		else {
			query.containsAll("tags", ["hackmit"]);
		}
		query.descending("updatedAt");
		  query.find({
		    success: function(results) {
		    	mixpanel.track("Loaded Sites");
		      	for (var i = 0; i < results.length; i++) {
			      	console.log(results[i].get('contactEmail') + results[i].get('url'));
			      	//$scope.sites.push(results[i]);
			      	$scope.sites[i+1] = {url: results[i].get('url'), contactEmail: results[i].get('contactEmail')};
			      	$scope.getCurrentSite();
		      	}
		      	//making sure it's only uniques
		      	$scope.sites = _.uniq($scope.sites, false, function(site){ return site.url;});
		      	//setting currentSite to start at a random point
		      	$scope.currentSite = Math.floor((Math.random()*results.length));
		    },
		    error: function(error) {
		      alert("Error: " + error.code + " " + error.message);
		    }
		  });
	}

	$scope.loadStartupSites();

	$scope.getSites = function () {
		return _.toArray($scope.sites);
	}

	$scope.nextSite = function () {
		mixpanel.track("Next");
		console.log('Next');

		//HIDES original frame as soon as next is clicked the first time -- maybe use an if so it doesnt happen every time
		$scope.hideOriginalIframe = true;

		if ($scope.currentSite < $scope.sites.length-1) {
			$scope.currentSite++;
		}
		else {
			$scope.currentSite = 0;
		}

		$scope.hideFrameOne();
		$scope.hideFrameTwo();
	}

	$scope.getCurrentSite = function () {
		return $scope.getSiteAtIndex($scope.currentSite);
	};

	$scope.getSiteAtIndex = function (n) {
		return $scope.getSites()[n];
	}

/*
	$scope.getNextSite = function () {
		return $scope.getSites()[$scope.currentSite + 1];
	};
*/

	//FILTER Functions
	$scope.openFilter = function () {
		console.log('filter pressed');
		$('#filterDialog').modal('show');
	}

	$scope.filter = function() {
		var filters = document.getElementsByName("filterCheckBox");
		$scope.addFilters(_.filter(filters, function(tag){ return tag.checked; })); 
	}

	$scope.addFilters = function (filters) {
		//check if this is the first filter being added
		//location.search gives ? on 
		location.search = "?tags=" + _.map(filters, function(tag){ return tag.id; }).join();
	}

	//INTEREST Functions
	//**update object with the user who expressed interest...maybe make this an array and just push to the array
	$scope.expressedInterest = function () {
		console.log($scope.qs["tags"]);
		mixpanel.track("Interest");
		console.log('Interest');
		if ($scope.siteEmail=="") {
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
			startupURL: $scope.getCurrentSite().url,
			resumeURL: $scope.resumeURL,
			year: $scope.year
		},
		{
			success: function(object) {
				Parse.Cloud.run("isAlreadyUser", {contactEmail: $scope.siteEmail}, {
					success: function (object) {
						console.log('success checked:' + object);
					},
					error: function (error) {
						console.log('error onboarding');
					}
				});
				mixpanel.track("Expressed Interest");
				console.log('Expressed Interest Success');
				$scope.nextSite();
				save();
			},
			error: function(model, error) {

			}
		});
	}

	//Toast Functions
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

	//PRELOAD NEXT IFRAME Functions
	//we have $scope.currentSite at our disposal to base everything off of -- should use even/odd and display block | none
	//have to compensate for the preloaded iframe at 0 -- maybe have a third frame just for that first one -- we dont call it til next is hit so tht could help us :)
	//need a getFrameAtIndex(n) function and even getCurrentFrame should use it
	$scope.frameOneCount = 1;
	$scope.frameTwoCount = 2;

	$scope.frameOne = $scope.sites[1].url;
	$scope.frameTwo = $scope.sites[0].url;

	$scope.hideFrameOne = function () {

		if ($scope.hideInitialFrame() == "false") {
			return true;
		}
		//if odd
		else if ( $scope.currentSite % 2 ) {
			//display frameOne
			console.log('displaying frame one');
			$scope.preloadIframeOne($scope.currentSite);
			return false;
		}
		else if ($scope.currentSite < $scope.sites.length - 1) {
			//preload next odd one
			console.log('hiding frame one');
			$scope.preloadIframeOne($scope.currentSite+1);
			return true;
		}
		else {
			console.log('hiding frame one');
			$scope.preloadIframeOne(1);
			return true;
		}
	}

	$scope.hideFrameTwo = function () {
		if ($scope.hideInitialFrame() == "false") {
			return true;
		}
		//if even
		else if ( !($scope.currentSite % 2) ) {
			//display frameTwo
			//just in case it hasn't been preloaded:
			$scope.preloadIframeTwo($scope.currentSite);
			console.log('displaying frame two');
			return false;
		}
		else if ($scope.currentSite < $scope.sites.length - 1) {
			//preload next even one
			$scope.preloadIframeTwo($scope.currentSite+1);
			return true;
		}
		else {
			$scope.preloadIframeTwo(0);
			return true;
		}
	}

	$scope.hideInitialFrame = function () {
		if ($scope.currentSite > 2) {
			return true;
		}
		else {
			return false;
		}
	}

	$scope.preloadIframeOne = function(index) {
		console.log('loading iframe one:' + $scope.getSiteAtIndex(index).url);
		$scope.frameOne = $scope.getSiteAtIndex(index).url;
	}

	$scope.preloadIframeTwo = function(index) {
		console.log('loading iframe two:' + $scope.getSiteAtIndex(index).url);
		$scope.frameTwo = $scope.getSiteAtIndex(index).url;
	}



	//OLD IFRAME SHIT//

	//if true then it's displayed
	//when it's toggled to false we should load next one


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

	//**WEIRD SHIT**//
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
	}

}

	app.directive('ngEnter', function ($document) {
	    return function (scope, element, attrs) {
	        element.bind("keydown keypress", function (event) {
	            if(event.which === 39) {
	                scope.$apply(function (){
	                    scope.$eval(attrs.ngEnter);
	                });

	                event.preventDefault();
	            }
	        });
	    };
	});

//$('.website-frame').css('height', $(window).height()+'px');
