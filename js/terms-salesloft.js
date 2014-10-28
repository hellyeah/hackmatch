function Terms($scope) {
    Parse.initialize("RctpMTJQ1oMw0FYc1pyPfWxaFzdJIh1WVdvGCj6V", "2cbbMkpxIUu0Epj4hOLwww4tFEFLBwNvjhCofW3w");

    $scope.signUp = function () {
        console.log('blah')
        var SignedTerms = Parse.Object.extend("SignedTerms");
        var signedTerms = new SignedTerms();
        signedTerms.save({
            signerName: $scope.signerName,
            companyWebsite: $scope.companyWebsite,
            companyEmail: $scope.companyEmail,
            fee: "10%",
            specialTerms: "payment due 30 days after actual start date"
        }).then(function(object) {
            response.success("yay! it worked");
        });
    }

}