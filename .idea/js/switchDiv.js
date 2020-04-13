window.addEventListener("load",function () {
    addToAll();
});

function addToAll() {
    let buttons = document.getElementsByClassName("switch");
    for(i=o; i<buttons.length; i++){
        buttons[i].addEventListener("click",function () {
            switchDiv(buttons[i].id);

        });
    }
}

function switchDiv(newOne) {
    let divToRemove = current;
    let divToAdd = document.getElementById(newOne);
    divToAdd.style.display = "block";
    divToRemove.style.display = "none";
    current=newOne;
}

let current = 'welcome';