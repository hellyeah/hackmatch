function Terms($scope) {
    Parse.initialize("RctpMTJQ1oMw0FYc1pyPfWxaFzdJIh1WVdvGCj6V", "2cbbMkpxIUu0Epj4hOLwww4tFEFLBwNvjhCofW3w");

    $scope.signUp = function () {
        console.log('blah')
        Parse.Cloud.run("signTerms", {
            signerName: $scope.signerName,
            companyWebsite: $scope.companyWebsite,
            companyEmail: $scope.companyEmail,
            fee: "10%",
            specialTerms: "payment due 30 days after actual start date"
            }, {
             success: function (object) {
                 console.log('success checked:' + object);
                 alert("Welcome to HackMatch!")
                 $scope.signerName = "";
                 $scope.companyWebsite = "";
                 $scope.companyEmail = "";
             },
             error: function (error) {
                 console.log('error onboarding');
             }
         });
    }

}