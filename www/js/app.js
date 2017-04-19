ons.bootstrap()
.service('StorageService', function() {
    var setLoginUser = function(user_info) {
        window.localStorage.login_user = JSON.stringify(user_info);
    };

    var getLoginUser = function(){
        return JSON.parse(window.localStorage.login_user || '{}');
    };

    return {
        getLoginUser: getLoginUser,
        setLoginUser: setLoginUser
    };
})

.controller('HomeCtrl', function($scope, StorageService, $http) {
    $scope.CheckLoginStatus = function(){
        $scope.user = StorageService.getLoginUser();
        console.log(JSON.stringify($scope.user));
        //check if there is any stored information of a login user
        if(JSON.stringify($scope.user) === "{}"){
            console.log('No login info!');
            $scope.login_status = 0;
        } else {
            console.log('Login info is found!');
            $scope.login_status = 1;
            
        }
    }
    
    $scope.Login = function(){
        TwitterConnect.login(
            function(result) {
            console.log('Successful login!');
            
            TwitterConnect.showUser(
                function(user) {
                    //Get larger profile picture
                    user.profile_url = user.profile_image_url.replace("_normal", "");
                    StorageService.setLoginUser({
                        name: user.name,
                        screen_name: user.screen_name,
                        location: user.location,
                        description: user.description,
                        profile_url: user.profile_image_url.replace("_normal", "")
                    });
                    myNavigator.resetToPage('home.html');
                }, function(error) {
                    console.log('Error retrieving user profile');
                    console.log(error);
                }
            );

            }, function(error) {
                console.log('Error logging in');
                console.log(error);
            }
        );   
    }
    
    var LogoutFromTwitter = function(){
        TwitterConnect.logout(
            function() {
                console.log('Successful logout!');
                StorageService.setLoginUser({});
                myNavigator.resetToPage("home.html");
            },
            function(error) {
                console.log('Error logging out: ' + JSON.stringify(error));
            }
        );  
    }
    
    $scope.Logout = function(){
        ons.notification.confirm({
            message: "Are you sure you want to log out?",
            title: 'Twitter Demo',
            buttonLabels: ["Yes", "No"],
            callback: function(idx) {
            switch (idx) {
                case 0:
                    LogoutFromTwitter();
                case 1:
                    break;
                break;
            }
          }
        });
    }
});