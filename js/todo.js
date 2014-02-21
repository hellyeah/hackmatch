function TodoCtrl($scope) {
	$scope.todos = [
		{text:'Learn AngularJS', done:false}, 
		{text:'Build an app', done:false}
	];

	$scope.getTotalTodos = function () {
		return $scope.todos.length;
	};

	$scope.addTodo = function () {
		$scope.todos.push({text:$scope.formTodoText, done:false});
		$scope.formTodoText = "";
	};

	$scope.clearCompleted = function () {
		$scope.todos = _.filter($scope.todos, function(todo) {
			return !todo.done;
		})
	};

}

/*
function HackMatch($scope) {

	//Hackmatch stuff

	//load from parse/firebase and then keep track of index?
	$scope.sites = [
		{url: 'http://rjvir.com', email: 'raj@rjvir.com'},
		{url: 'http://davefontenot.com', email: 'gailees@umich.edu'}
	];

	$scope.currentSite = 0;

	$scope.nextSite = function () {
		$scope.currentSite++;
	}

	$scope.getCurrentSite = function () {
		return $scope.sites[$scope.currentSite];
		//return 5;
	};

	//save new url/email to firebase
	$scope.addSite = function () {
		$scope.myDataRef = new Firebase('https://kwcvibr57kn.firebaseio-demo.com/');
		//set
		$scope.myDataRef.push({url: $scope.siteUrl, email: $scope.siteEmail});

		$scope.siteUrl = "";
		$scope.siteEmail = "";
	}

	$scope.getSites = function () {
		$scope.myDataRef = new Firebase('https://kwcvibr57kn.firebaseio-demo.com/');
	}
}
*/