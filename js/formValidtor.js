$(document).ready(function () {

    $('#signUpButton').on('click', function (e) {
        let form = $('#signUpForm');
        let good_username = true;
        var myMap = JSON.parse(sessionStorage.myMap);
        let username = document.getElementById("usernameSingUp").value;
        for (let i=0; i<myMap.length; i++ ){
            if(username === myMap[i][0]){
                good_username=false;
                document.getElementById("usernameSingUp").value="";
            }
        }
        if (!form[0].checkValidity() || !good_username) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            form[0].style.display;
            let password = document.getElementById("passwordSignUp").value;
            myMap.push([username,password]);
            sessionStorage.myMap = JSON.stringify(myMap);
            switchDiv("welcome");
        }
        form.addClass('was-validated');
    });

    $('#loginSubmit').on('click', function (e) {
        let form = $('#loginForm');
        if (!form[0].checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            var username = document.getElementById("loginUserName").value;
            var password = document.getElementById("loginPassword").value;

            var myMap = JSON.parse(sessionStorage.myMap);
            var found = false;

            for (let i = 0; i < myMap.length; i++) {
                if ((username == myMap[i][0] && password == myMap[i][1])) {
                    switchDiv('settings');
                    sessionStorage.setItem("currentUser",username);
                    found = true;
                } else if (username == myMap[i][0] && password != myMap[i][1]) {
                    alert("incorrect password");
                    found = true;
                }
            }
            if (!found) {
                alert("This username doesn't exist");
            }


        }

        form.addClass('was-validated');
    });
});