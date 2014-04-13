var app = angular.module("HackMatch", ["firebase", "ui.keypress"]);
//angular.module('ui.keypress',[]).

function hackmatch($scope, angularFire) {
    Parse.initialize("RctpMTJQ1oMw0FYc1pyPfWxaFzdJIh1WVdvGCj6V", "2cbbMkpxIUu0Epj4hOLwww4tFEFLBwNvjhCofW3w");
    
    //Initializing variables
    $scope.index = 0;
    $scope.hack = function () {
        return $scope.hacks[$scope.index];
    }
    $scope.hacks = [];
    //have to preload so that everything works while I'm waiting for Parse
    $scope.hacks[0] = {
        title: "Vulse", 
        media: {
            video: "http://www.youtube.com/embed/sGZ4UaVXTAg?rel=0",
            images: ["https://i1.ytimg.com/vi/sGZ4UaVXTAg/hqdefault.jpg", "https://seelio.com/media/ca/d6/cad66cc4ba29e15bd16c85b299c5ee3c72ad.jpg"]
        },
        tags: ["iOS", "hardware", "audio engineering", "objective-c"],
        url: "http://vulseapp.com/",
        github: "https://github.com/gailees/hackmatch",
        description: "A multi-touch effects processor for guitar. Built in 36 hours at Mhacks 2013. Currently under further development. Coming to iOS App Store soon!"
    };
    $scope.hacks[1] = {    
        title: "Oculus Quidditch", 
        media: {
            video: "http://www.youtube.com/embed/8I2tAC7BR20?rel=0",
            images: ["https://i1.ytimg.com/vi/sGZ4UaVXTAg/hqdefault.jpg", "https://seelio.com/media/ca/d6/cad66cc4ba29e15bd16c85b299c5ee3c72ad.jpg"]
        },
        tags: ["js", "oculus", "unity"],
        url: "http://vulseapp.com/",
        github: "https://github.com/gailees/hackmatch",
        description: "together we made a broom flight simulator straight from the Harry Potter Universe. Combining the Oculus Rift and Nintendo Wiimote technologies"
    };
    $scope.user = {
        email: ""
    }

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

    /*
    $scope.addHacks = function (currentHacks, newHacks) {
        $scope.hacks = currentHacks.concat(newHacks);
    }
    */

    $scope.loadHacks = function () {
        var TestSites = Parse.Object.extend("hacks");
        var query = new Parse.Query(TestSites);
        query.limit(1000);
        //console.log($scope.qs["tags"]);
        query.descending("updatedAt");
          query.find({
            success: function(results) {
                mixpanel.track("Loaded hacks");
                for (var i = 0; i < results.length; i++) {
                    //console.log(results[i].get('contactEmail') + results[i].get('url'));
                    //$scope.sites.push(results[i]);
                    $scope.hacks[i+2] = {
                        title: results[i].get('title'), 
                        media: results[i].get('media'),
                        tags: results[i].get('tags'),
                        url: results[i].get('url'),
                        github: results[i].get('github'),
                        description: results[i].get('description'),
                    };
                }
                //setting currentSite to start at a random point
                //$scope.currentSite = Math.floor((Math.random()*results.length));
            },
            error: function(error) {
              alert("Error: " + error.code + " " + error.message);
            }
          });
    }

    $scope.loadHacks();

    $scope.getHacks = function () {
        return _.toArray($scope.hacks);
    }

    $scope.nextHack = function () {
        mixpanel.track("Next hack");
        console.log('Next clicked');
        $scope.numberOfNext++;
        $scope.index++;

        //was manually adding hacks here
        //var TestObject = Parse.Object.extend("hacks");
        //var testObject = new TestObject();
        //testObject = $scope.hacks[0];
        //testObject.save($scope.hacks[1]);
    }


    //INTEREST Functions
    //**update object with the user who expressed interest...maybe make this an array and just push to the array
    $scope.expressedInterest = function () {
        //console.log($scope.qs["tags"]);
        if ($scope.user.email=="") {
            //$('#userInfo').modal('show');
            //ask for email
        }
        else {
            mixpanel.track("Interest");
            console.log('Interested in: ');
            console.log($scope.hack().url);
            console.log('hack number: ' + $scope.index);
            $scope.interested($scope.hack(), $scope.user);
            $scope.nextHack();
        }
    }

    $scope.interested = function (hack, user) {
        //console.log("Interested Info")
        //console.log($scope.siteEmail);
        //console.log($scope.siteUrl);
        //console.log($scope.getCurrentSite().url);
        //if ($scope.siteEmail=="email") {
        //  $('#windowTitleDialog').modal('show');
        //}
        //set bool to true if interested or false if not interested...maybe just append to the user parse data the email of the company
        //userEmail
        //site.save(null, {
        //  success: function(site) {
        //**NEED to just find a way to update the interestinghacks column of the original testSites object so I can just addunique
        var Interest = Parse.Object.extend("interest");
        var interest = new Interest();
        //site.addUnique("interestinghacks", $scope.getCurrentSite.email);
        interest.save({
            contactEmail: user.email,
            //url: user.url,
            //interestingHacks: hack.email,
            hackURL: hack.url,
            //resumeURL: $scope.resumeURL,
            //year: $scope.year
        },
        {
            success: function(object) {
                /*
                Parse.Cloud.run("isAlreadyUser", {contactEmail: user.email}, {
                    success: function (object) {
                        console.log('success checked:' + object);
                    },
                    error: function (error) {
                        console.log('error onboarding');
                    }
                });
                */
                mixpanel.track("Expressed Interest");
                console.log('Expressed Interest Success');
                saveToast();
                //$scope.nextSite();
                //$scope.getCurrentSite();
            },
            error: function(model, error) {

            }
        });
    }

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

    function saveToast(){
        drawToast("hack Saved");
    }

    //**WEIRD SHIT**//
    //add to firebase for hackers sites
    $scope.addHack = function () {
        var Site = Parse.Object.extend("testSites");
        var site = new Site();
        $scope.user.email;
        //$scope.user.url;
        //$scope.toggle();
        //**Force this upon arrival to the site
        //$scope.user = {email: $scope.siteEmail, url: $scope.siteUrl};
        //**VALIDATION
        //Checkboxes for hackathons
        //$scope.myDataRef = new Firebase('https://hackmatch.firebaseIO.com/');
        //$scope.sites.push({url: $scope.siteUrl, email: $scope.siteEmail});
        var now = new Date().valueOf();

        ref.push({url: $scope.user.url, email: $scope.user.email, time: now});

        site.save({url: $scope.user.url, contactEmail: $scope.user.email}, {
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
