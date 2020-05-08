// Get the modal
var modal = document.getElementById("about");

// Get the button that opens the modal
var btn = document.getElementById("aboutButton");

// Get the <span> element that closes the modal
var span = document.getElementById("aboutClose");

$(document).keydown(function (e) {
    var code = e.keyCode || e.which;
    if (code == 27) modal.style.display = "none";
});

// When the user clicks the button, open the modal
btn.onclick = function () {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// Get the modal
var modalS = document.getElementById("signInFirst");

// Get the button that opens the modal
var btnS = document.getElementById("settingsButton");

// Get the <span> element that closes the modal
var spanS = document.getElementById("settingsClose");

$(document).keydown(function (e) {
    var code = e.keyCode || e.which;
    if (code == 27) modalS.style.display = "none";
});

// When the user clicks the button, open the modal
btnS.onclick = function () {
    if (sessionStorage.getItem("currentUser"))
        switchDiv('settings');
    else
        modalS.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
spanS.onclick = function () {
    modalS.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    else if (event.target == modalS) {
        modalS.style.display = "none";
    }
}