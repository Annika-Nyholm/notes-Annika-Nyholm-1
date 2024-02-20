
import {storeUser, getUser, logoutUser} from "./modules/user.js";


const loginButton = document.getElementById('loginButton');
const loginDiv = document.getElementById('loginDiv');
const logoutDiv = document.getElementById('logoutDiv');

function init() {
    console.log(getUser());
    if (getUser() !== null ) {
        toggleHiddenClass();
    } 
}

function toggleHiddenClass() {
    loginDiv.classList.add('hidden');
    logoutDiv.classList.remove('hidden');
}

loginButton.addEventListener('click', () => {
    console.log('clicketiclick');
    let email = document.getElementById('emailInput').value;
    let password = document.getElementById('passwordInput').value;

    fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
    })
    .then(res => res.json())
    .then(data => {
        console.log('detta är data', data);
        //lägga in user i localstorage
        storeUser(data);
        //rensa inputfälten
        
        document.getElementById('emailInput').value = '';
        document.getElementById('passwordInput').value = '';
        
        //dölja loginfälten
        toggleHiddenClass();
        //printa userns dokument i en lista

    })
});

logoutButton.addEventListener('click', () => {
    logoutUser();
    loginDiv.classList.remove('hidden');
});
//funktion för att printa dokument
//funktion för att visa i edit-mode
//funktion för att visa i read-mode
//spara editerat dokument i databas
//Skapa nytt dokument, 2 fields ett för heading ett för content
//spara dokument i databas

init();