angular.module('arkeneaApp')
    .controller('viewCtrl', function ($scope, $http, $state, $stateParams) {
        console.log($stateParams.userID);
        //get users from database
        function getUsers() {
            $http.get('/users/getUserInfo/' + $stateParams.userID.toString()).
                then(function (data) {
                    if (data.data.status == 'success') {
                        $scope.userName = data.data.userData[0].fname + " " + data.data.userData[0].lname;
                        $scope.userEmail = data.data.userData[0].email;
                        $scope.userPhone = data.data.userData[0].phone;
                    }
                });
        };
        getUsers();
    })
    .controller('appCtrl', ['$scope', '$http', function ($scope, $http) {
        //phone number validation
        $scope.phoneNumbr = /^\+?\d{2}[- ]?\d{3}[- ]?\d{5}$/;
        $scope.isEdit = false;


        // File Upload 
        function validateFile(fileName) {
            var validFilesTypes = ["png", "jpg", "jpeg"],
                ext = fileName.split('.').pop().toLowerCase();

            var isValidFile = false;
            for (var i = 0; i < validFilesTypes.length; i++) {
                if (ext == validFilesTypes[i]) {
                    isValidFile = true;
                    break;
                }
            }
            return isValidFile;
        }
        //base64
        function readFile(inputElement) {
            var deferred = $.Deferred();
            if (inputElement) {
                var fr = new FileReader();
                fr.onload = function (e) {
                    deferred.resolve(e.target.result);
                };
                fr.readAsDataURL(inputElement);
            } else {
                deferred.reject({
                    success: false,
                    error: 'FILE_NOT_LOAD'
                });
            }
            return deferred.promise();
        }
        var photoList = [];
        $(document).on("change", "#photofiles", function () {
            if ($("#photofiles")[0].files.length > 1) {
                $("#photofiles").val(null);
                alert("you can upload maximum 1 photo");
            } else {
                for (var i = 0; i < $("#photofiles")[0].files.length; i++) {
                    var imgName = $("#photofiles")[0].files[i].name;

                    if (!validateFile(imgName)) {
                        $("#photofiles").val(null);
                        alert("Please upload a valid file, supported formats are .jpeg, .png and .jpg");
                        return;
                    }
                    if (photoList.length > 0) {
                        $("#photofiles").val(null);
                        alert("you can upload maximum 1 photo");
                        return;
                    }

                    readFile($("#photofiles")[0].files[i]).then(function (b64Str) {
                        //console.log(b64Str)
                        photoList.push({ 'imgName': imgName, 'b64Str': b64Str });
                    }).catch(function (err) {

                    });
                }
            }
        });

        //get users from database
        function getUsers() {
            $http.get('/users/getUsersList').
                then(function (data) {
                    if (data.data.status == 'success') {
                        $scope.usersList = data.data.usersList;
                        console.log($scope.usersList)
                    }
                });
        };

        //get users from database
        getUsers();

        $scope.refreshUsers = function () {
            //get users from database
            getUsers();
        }

        //create a new user
        $scope.createUser = function () {
            var obj = {
                fname: $scope.firstname,
                lname: $scope.lastname,
                email: $scope.emailId,
                phone: $scope.phone,
                imgName: photoList[0].imgName
            }

            //var base64Image = photoList[0].b64Str.split(';base64,').pop();
            // fs.writeFile('img/image.png', base64Image, {encoding: 'base64'}, function(err) {
            //     console.log('File created');
            // });

            // if($scope.firstname != "" || $scope.lastname != "" || )
            $http.post('/users/createUser', obj).
                then(function (data) {
                    if (data.data.status == 'added') {
                        alert("User is added!");
                        $scope.firstname = "";
                        $scope.lastname = "";
                        $scope.emailId = "";
                        $scope.phone = "";
                    } else if (data.data.status == 'exists') {
                        alert("Email is already exists!");
                    }
                });
        }

        //update the user info
        $scope.editUser = function (param) {
            $scope.isEdit = true;
            $scope.editID = param._id;
            console.log(param)
            $scope.editfirstname = param.fname;
            $scope.editlastname = param.lname;
            $scope.editemailId = param.email;
            $scope.editphone = param.phone;
        }

        $scope.updateUser = function () {
            var obj = {
                id: $scope.editID,
                fname: $scope.editfirstname,
                lname: $scope.editlastname,
                email: $scope.editemailId,
                phone: $scope.editphone
            }
            console.log("edit", obj)
            $http.put('/users/updateUser', obj).
                then(function (data) {
                    if (data.data.status == 'updated') {
                        alert("User is updated successfully!");
                        $scope.usersList = [];
                        getUsers();
                        $scope.isEdit = false;
                        $scope.editfirstname = "";
                        $scope.editlastname = "";
                        $scope.editemailId = "";
                        $scope.editphone = "";
                    }
                });
        }

        $scope.deleteUser = function (param) {
            console.log(param._id)
            $http.delete('/users/deleteUser/' + param._id,).
                then(function (data) {
                    if (data.data.status == 'deleted') {
                        alert("User is deleted successfully!");
                        getUsers();
                        $scope.isEdit = false;
                        $scope.editfirstname = "";
                        $scope.editlastname = "";
                        $scope.editemailId = "";
                        $scope.editphone = "";
                    }
                });
        }



    }])