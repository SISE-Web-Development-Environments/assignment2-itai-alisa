1

$(document).ready(function(){

    $('#signUpButton').on('click', function(e) {
        let form = $('#signUpForm');
        if (!form[0].checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
        }
        else{
          form[0].style.display;
        }

        form.addClass('was-validated');
    });

});