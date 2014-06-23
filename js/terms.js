function Terms($scope) {
    $scope.todos = [
        {text:'Learn AngularJS', done:false}, 
        {text:'Build an app', done:false}
    ];

    $scope.signUp = function () {
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