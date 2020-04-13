function switchDiv(newOne) {
    let divToRemove = current;
    let divToAdd = document.getElementById(newOne);
    divToAdd.style.display = "block";
    divToRemove.style.display = "none";
    current=divToAdd;
}

let current =  document.getElementById('welcome');