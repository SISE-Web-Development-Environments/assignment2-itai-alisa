function switchDiv(newOne) {
    var item = localStorage.getItem("current");
    if (newOne != item) {
        let divToRemove = document.getElementById(item);
        let divToAdd = document.getElementById(newOne);
        if(newOne == "welcome"){
            divToAdd.style.display = "flex";
        }else {
            divToAdd.style.display = "block";
        }
        divToRemove.style.display = "none";
        if(item == "ourGame"){
            gameOver(EXIT_GAME);
        }
        localStorage.setItem("current", newOne);
    }
}

localStorage.setItem("current", "welcome");