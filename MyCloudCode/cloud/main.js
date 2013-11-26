
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.define("averageStars", function(request, response) {
  var query = new Parse.Query("Review");
  query.equalTo("movie", request.params.movie);
  query.find({
    success: function(results) {
      var sum = 0;
      for (var i = 0; i < results.length; ++i) {
        sum += results[i].get("stars");
      }
      response.success(sum / results.length);
    },
    error: function() {
      response.error("movie lookup failed");
    }
  });
});

var Mailgun = require('mailgun');
Mailgun.initialize('hackmatch.com', 'key-2787lpq0ilh16bhm2hex9ijc88hngq68');

var onboardEmail = function () {
	Mailgun.sendEmail({
	  to: "davidhfontenot@gmail.com",
	  from: "Dave Fontenot <dave@hackmatch.com>",
	  subject: "Hello from Cloud Code!",
	  text: "Using Parse and Mailgun is great!",
	  html: '<html><head> <style type="text/css"> body { font-family: arial, sans, sans-serif; margin: 0; } iframe { border: 0; frameborder: 0; height: 100%; width: 100%; } #header, #footer { background: #f0f0f0; padding: 10px 10px; } #header { border-bottom: 1px #ccc solid; } #footer { border-top: 1px #ccc solid; border-bottom: 1px #ccc solid; font-size: 13; } #contents { margin: 6px; } .dash { padding: 0 6px; } </style></head><body><div id="header">Let&#39;s find you the perfect startup!</div><div id="contents"><style type="text/css">ol{margin:0;padding:0}.c7{max-width:468pt;background-color:#ffffff;padding:72pt 72pt 72pt 72pt}.c4{color:#333333;font-size:17pt;font-weight:bold}.c3{color:inherit;text-decoration:inherit}.c0{height:11pt;direction:ltr}.c2{color:#1155cc;text-decoration:underline}.c1{direction:ltr}.c6{color:#ff0000}.c5{text-align:center}.title{padding-top:0pt;line-height:1.15;text-align:left;color:#000000;font-size:21pt;font-family:"Trebuchet MS";padding-bottom:0pt}.subtitle{padding-top:0pt;line-height:1.15;text-align:left;color:#666666;font-style:italic;font-size:13pt;font-family:"Trebuchet MS";padding-bottom:10pt}li{color:#000000;font-size:11pt;font-family:"Arial"}p{color:#000000;font-size:11pt;margin:0;font-family:"Arial"}h1{padding-top:10pt;line-height:1.15;text-align:left;color:#000000;font-size:16pt;font-family:"Trebuchet MS";padding-bottom:0pt}h2{padding-top:10pt;line-height:1.15;text-align:left;color:#000000;font-size:13pt;font-family:"Trebuchet MS";font-weight:bold;padding-bottom:0pt}h3{padding-top:8pt;line-height:1.15;text-align:left;color:#666666;font-size:12pt;font-family:"Trebuchet MS";font-weight:bold;padding-bottom:0pt}h4{padding-top:8pt;line-height:1.15;text-align:left;color:#666666;font-size:11pt;text-decoration:underline;font-family:"Trebuchet MS";padding-bottom:0pt}h5{padding-top:8pt;line-height:1.15;text-align:left;color:#666666;font-size:11pt;font-family:"Trebuchet MS";padding-bottom:0pt}h6{padding-top:8pt;line-height:1.15;text-align:left;color:#666666;font-style:italic;font-size:11pt;font-family:"Trebuchet MS";padding-bottom:0pt}</style><p class="c1"><span>Welcome to HackMatch, the easiest way to join an awesome startup.</span></p><p class="c0"><span></span></p><p class="c1"><span>I’m Dave, the founder of HackMatch, and </span><span>I’m here to find the perfect startup </span><span>for you! All the way from founder intros and preparing for interviews to finding housing for your new position, HackMatch has got you covered.</span></p><p class="c0"><span></span></p><p class="c1 c5"><span class="c4">We do everything except interview for you!</span></p><p class="c0"><span></span></p><p class="c1"><span>After you take a look at</span><span class="c6"> </span><span>the startups</span><span> on </span><span class="c2"><a class="c3" href="http://hackmatch.com">HackMatch</a></span><span>, </span><span>we</span><span> can jump on a short call to figure out what </span><span>you’re</span><span> looking for and how</span><span> I</span><span> can help you get there. </span><span>I</span><span> spend a lot of time and energy with </span><span>each hacker</span><span> to make sure </span><span>they </span><span>know everything </span><span>they </span><span>need to get offers from the hottest startups in the country (and abroad).</span></p><p class="c0"><span></span></p><p class="c1"><span>To get started finding the perfect startup: [link to schedule a call]</span></p><p class="c0"><span></span></p><p class="c1"><span>Feel free to email me, add me on F</span><span>acebook</span><span>, hit me up on T</span><span>witter</span><span>, or shoot me a call at any time. I would love to hear from you.</span></p><p class="c0"><span></span></p><p class="c1"><span>Pumped to have you onboard!</span></p><p class="c1"><span>Dave Fontenot</span></p><p class="c1"><span>Facebook: </span><span class="c2"><a class="c3" href="https://www.facebook.com/davefontenot">facebook.com/davefontenot</a></span></p><p class="c1"><span>Twitter: </span><span class="c2"><a class="c3" href="https://twitter.com/davefontenot">twitter.com/davefontenot</a></span></p><p class="c1"><span>Mobile: 954.260.4240</span></p><p class="c0"><span></span></p><p class="c1"><span>P.S. </span><span>If you are a senior graduating this year or you’re looking for a full-time job right now</span><span>, please reply to this email right away, so we can get started immediately.</span></p></div> </body></html>'
	}, {
	  success: function(httpResponse) {
	    console.log(httpResponse);
	    response.success("Email sent!");
	  },
	  error: function(httpResponse) {
	    console.error(httpResponse);
	    response.error("Uh oh, something went wrong");
	  }
	});
}

var isAlreadyUser = function(contactEmail) {
  	var query = new Parse.Query("interest");
	  query.equalTo("contactEmail", contactEmail);
	  query.count({
	    success: function(count) {
	    	if (count < 1) {
	    		response.success('onboard email sent');
	    		onboardEmail(contactEmail);
	    	}
	    	else {
	    		response.success('already onboarded');
	    	}
	    },
	    error: function() {
	      response.error("user lookup failed");
	    }
	});
}
//before save
Parse.Cloud.beforeSave("interest", function(request, response) {
	isAlreadyUser(request.object.get('contactEmail'));
});

//take email and respond with true if that email has already expressed interest. false otherwise.
Parse.Cloud.define("isAlreadyUser", function(request, response) {
  	var query = new Parse.Query("interest");
	  query.equalTo("contactEmail", request.params.contactEmail);
	  query.count({
	    success: function(count) {
	    	if (count < 1) {
	    		response.success('onboard email sent');
	    		onboardEmail(request.params.contactEmail);
	    	}
	    	else {
	    		response.success('already onboarded');
	    	}
	    },
	    error: function() {
	      response.error("user lookup failed");
	    }
	});
});


//mailgun


Parse.Cloud.define("onboardEmail", function (request, response) {
	Mailgun.sendEmail({
	  to: "davidhfontenot@gmail.com",
	  from: "Dave Fontenot <dave@hackmatch.com>",
	  subject: "Let's find you the perfect startup!",
	  text: "Using Parse and Mailgun is great!",
	  html: '<html><head> <style type="text/css"> body { font-family: arial, sans, sans-serif; margin: 0; } iframe { border: 0; frameborder: 0; height: 100%; width: 100%; } #header, #footer { background: #f0f0f0; padding: 10px 10px; } #header { border-bottom: 1px #ccc solid; } #footer { border-top: 1px #ccc solid; border-bottom: 1px #ccc solid; font-size: 13; } #contents { margin: 6px; } .dash { padding: 0 6px; } </style></head><body><div id="contents"><style type="text/css">ol{margin:0;padding:0}.c7{max-width:468pt;background-color:#ffffff;padding:72pt 72pt 72pt 72pt}.c4{color:#333333;font-size:17pt;font-weight:bold}.c3{color:inherit;text-decoration:inherit}.c0{height:11pt;direction:ltr}.c2{color:#1155cc;text-decoration:underline}.c1{direction:ltr}.c6{color:#ff0000}.c5{text-align:center}.title{padding-top:0pt;line-height:1.15;text-align:left;color:#000000;font-size:21pt;font-family:"Trebuchet MS";padding-bottom:0pt}.subtitle{padding-top:0pt;line-height:1.15;text-align:left;color:#666666;font-style:italic;font-size:13pt;font-family:"Trebuchet MS";padding-bottom:10pt}li{color:#000000;font-size:11pt;font-family:"Arial"}p{color:#000000;font-size:11pt;margin:0;font-family:"Arial"}h1{padding-top:10pt;line-height:1.15;text-align:left;color:#000000;font-size:16pt;font-family:"Trebuchet MS";padding-bottom:0pt}h2{padding-top:10pt;line-height:1.15;text-align:left;color:#000000;font-size:13pt;font-family:"Trebuchet MS";font-weight:bold;padding-bottom:0pt}h3{padding-top:8pt;line-height:1.15;text-align:left;color:#666666;font-size:12pt;font-family:"Trebuchet MS";font-weight:bold;padding-bottom:0pt}h4{padding-top:8pt;line-height:1.15;text-align:left;color:#666666;font-size:11pt;text-decoration:underline;font-family:"Trebuchet MS";padding-bottom:0pt}h5{padding-top:8pt;line-height:1.15;text-align:left;color:#666666;font-size:11pt;font-family:"Trebuchet MS";padding-bottom:0pt}h6{padding-top:8pt;line-height:1.15;text-align:left;color:#666666;font-style:italic;font-size:11pt;font-family:"Trebuchet MS";padding-bottom:0pt}</style><p class="c1"><span>Welcome to HackMatch, the easiest way to join an awesome startup.</span></p><p class="c0"><span></span></p><p class="c1"><span>I’m Dave, the founder of HackMatch, and </span><span>I’m here to find the perfect startup </span><span>for you! All the way from founder intros and preparing for interviews to finding housing for your new position, HackMatch has got you covered.</span></p><p class="c0"><span></span></p><p class="c1 c5"><span class="c4">We do everything except interview for you!</span></p><p class="c0"><span></span></p><p class="c1"><span>After you take a look at</span><span class="c6"> </span><span>the startups</span><span> on </span><span class="c2"><a class="c3" href="http://hackmatch.com">HackMatch</a></span><span>, </span><span>we</span><span> can jump on a short call to figure out what </span><span>you’re</span><span> looking for and how</span><span> I</span><span> can help you get there. </span><span>I</span><span> spend a lot of time and energy with </span><span>each hacker</span><span> to make sure </span><span>they </span><span>know everything </span><span>they </span><span>need to get offers from the hottest startups in the country (and abroad).</span></p><p class="c0"><span></span></p><p class="c1"><span>To get started finding the perfect startup: [link to schedule a call]</span></p><p class="c0"><span></span></p><p class="c1"><span>Feel free to email me, add me on F</span><span>acebook</span><span>, hit me up on T</span><span>witter</span><span>, or shoot me a call at any time. I would love to hear from you.</span></p><p class="c0"><span></span></p><p class="c1"><span>Pumped to have you onboard!</span></p><p class="c1"><span>Dave Fontenot</span></p><p class="c1"><span>Facebook: </span><span class="c2"><a class="c3" href="https://www.facebook.com/davefontenot">facebook.com/davefontenot</a></span></p><p class="c1"><span>Twitter: </span><span class="c2"><a class="c3" href="https://twitter.com/davefontenot">twitter.com/davefontenot</a></span></p><p class="c1"><span>Mobile: 954.260.4240</span></p><p class="c0"><span></span></p><p class="c1"><span>P.S. </span><span>If you are a senior graduating this year or you’re looking for a full-time job right now</span><span>, please reply to this email right away, so we can get started immediately.</span></p></div> </body></html>'
	}, {
	  success: function(httpResponse) {
	    console.log(httpResponse);
	    response.success("Email sent!");
	  },
	  error: function(httpResponse) {
	    console.error(httpResponse);
	    response.error("Uh oh, something went wrong");
	  }
	});
})

