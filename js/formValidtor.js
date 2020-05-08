$(document).ready(function () {

    $('#signUpButton').on('click', function (e) {
        let form = $('#signUpForm');
        let good_username = true;
        let myMap = JSON.parse(sessionStorage.myMap);
        let username = $('#usernameSingUp').val();
        for (let i=0; i<myMap.length; i++ ){
            if(username === myMap[i][0]){
                good_username=false;
                $('#usernameSingUp').val("");
            }
        }
        if (!form[0].checkValidity() || !good_username) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            form[0].style.display;
            let myMap = JSON.parse(sessionStorage.myMap);
            let username = $('#usernameSingUp').val();
            let password = $('#passwordSignUp').val();
            myMap.push([username,password]);
            sessionStorage.myMap = JSON.stringify(myMap);
            switchDiv("login");
        }
        form.addClass('was-validated');
    });

    $('#loginSubmit').on('click', function (e) {
        let form = $('#loginForm');
        if (!form[0].checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            let username = $('#usernameSingUp').val();
            let password = $('#passwordSignUp').val();
            let myMap = JSON.parse(sessionStorage.myMap);
            let found = false;
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