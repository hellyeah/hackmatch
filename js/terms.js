function Terms($scope) {
    Parse.initialize("RctpMTJQ1oMw0FYc1pyPfWxaFzdJIh1WVdvGCj6V", "2cbbMkpxIUu0Epj4hOLwww4tFEFLBwNvjhCofW3w");

    $scope.todos = [
        {text:'Learn AngularJS', done:false}, 
        {text:'Build an app', done:false}
    ];

    $scope.signUp = function () {
        console.log('blah')
        Parse.Cloud.run("signTerms", {
            signerName: $scope.signerName,
            companyWebsite: $scope.companyWebsite,
            companyEmail: $scope.companyEmail
            }, {
             success: function (object) {
                 console.log('success checked:' + object);
             },
             error: function (error) {
                 console.log('error onboarding');
             }
         });
    }

}