tinymce.init({
    selector: '#editArea',
    plugins: 'code',
    toolbar: 'undo redo | forecolor backcolor | styleselect bold italic underline | alignleft aligncenter alignright | code',

    setup: function(editor) {
        editor.on('change', function() {
            editor.save();
        })
    }
});

import {storeUser, getUser, logoutUser} from "./modules/user.js";


let loginButton = document.getElementById('loginButton');
let loginDiv = document.getElementById('loginDiv');
let logoutDiv = document.getElementById('logoutDiv');
let documentList = document.getElementById('documentList');
let documentContainer = document.getElementById('documentContainer');

function init() {
    //Is user logged in?
    if (getUser() !== null ) {
        toggleHiddenClass();
        printDocList();
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
    .then(async (data) => {
        console.log('detta är data', data);
        //lägga in user i localstorage
        storeUser(data);
        //rensa inputfälten
        
        document.getElementById('emailInput').value = '';
        document.getElementById('passwordInput').value = '';
        
        //dölja loginfälten
        toggleHiddenClass();
        //printa userns dokument i en lista
        await printDocList();

    })
});

logoutButton.addEventListener('click', () => {
    logoutUser();
    loginDiv.classList.remove('hidden');
    logoutDiv.classList.add('hidden');
    documentList.innerHTML = '';
});

async function printDocList() {
    try {
        const user = await getUser();
        const response = await fetch(`http://localhost:3000/documents/?userId=${user.id}`)
        const data = await response.json();

        //console.log('detta är printdatan:', data.documents);
        documentList.innerHTML = '';
        data.documents.map(doc => {
            let li = document.createElement('li')
            li.innerText = doc.heading;

            li.addEventListener('click', () => {

                console.log('du klickar på: ', doc.id);
                //funktion för att öppna doc i läsläge
                printReadDoc(doc);
            })

            documentList.appendChild(li);
        })



    } catch (error) {
        console.error('Error fetching list', error);
        response.status(500).json({message: 'Internal server error', error: error});
    }


}


//funktion för att visa i read-mode
function printReadDoc(doc) {
   
    const article = document.createElement('article');
    article.classList.add('read_document_container');

    const heading = document.createElement('h3');
    heading.innerText = doc.heading;
    heading.id = 'readDocumentHeading';

    const created = document.createElement('p');
    created.innerText = `Created: ${doc.created}`;
    created.id = 'readCreated';

    const lastEdited = document.createElement('p');
    lastEdited.innerText = `Last edited: ${doc.lastEdited}`;
    lastEdited.id = 'readLastEdited';

    const content = document.createElement('div');
    content.classList.add('read_document');
    content.id = 'readDocumentContent';
    content.innerText = doc.content;

    const editButton = document.createElement('button');
    editButton.id = 'editButton';
    editButton.innerText = 'Edit';
    editButton.addEventListener('click', () => {
        console.log('clicketiclack');
    })

    const closeButton = document.createElement('button');
    closeButton.id = 'closeButton';
    closeButton.innerText = 'Close';
    closeButton.addEventListener('click', () => {
        documentContainer.innerHTML = ''; 
    })


    // Lägg till de skapade elementen i article-elementet
    article.appendChild(heading);
    article.appendChild(created);
    article.appendChild(lastEdited);
    article.appendChild(content);
    article.appendChild(editButton);
    article.appendChild(closeButton);

    documentContainer.innerHTML = ''; 
    documentContainer.appendChild(article);
}

//funktion för att visa i edit-mode
//spara editerat dokument i databas
//Skapa nytt dokument, 2 fields ett för heading ett för content
//spara dokument i databas

init();