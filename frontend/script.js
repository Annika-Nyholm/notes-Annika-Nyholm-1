
function initTinymce() {
    tinymce.init({
        selector: '#editArea',
        plugins: 'code',
        statusbar: false,
        menubar: false,
        toolbar: 'undo redo | forecolor backcolor | styleselect bold italic underline | alignleft aligncenter alignright | code',

        setup: function (editor) {
            editor.on('change', function () {
                editor.save();
            })
        }
    });
}

import { storeUser, getUser, logoutUser } from "./modules/user.js";


let loginButton = document.getElementById('loginButton');
let loginDiv = document.getElementById('loginDiv');
let logoutDiv = document.getElementById('logoutDiv');
let documentList = document.getElementById('documentList');
let documentContainer = document.getElementById('documentContainer');
let buttonHolder = document.getElementById('buttonHolder');
let newUserDiv = document.getElementById('newUserDiv');

function init() {
    createNewUserButton();
    //Is user logged in?
    if (getUser() !== null) {
        toggleHiddenClass();
        printDocList();
        createDocButton();
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
            createDocButton();

        })
});

logoutButton.addEventListener('click', () => {
    logoutUser();
    loginDiv.classList.remove('hidden');
    logoutDiv.classList.add('hidden');
    documentList.innerHTML = '';
    buttonHolder.innerHTML = '';
});

//Skapa knapp för new user
function createNewUserButton() {
    let button = document.createElement('button');
    button.innerText = 'New user';
    button.id = 'newUserButton';
    button.addEventListener('click', () => {
        console.log('klicketi-kuu');
        //Skapa ny användarformulär
        createNewUserForm();
        loginDiv.classList.add('hidden');

    })
    loginDiv.appendChild(button);
}

//Skapa ny användar-formulär
function createNewUserForm() {
    let inputName = document.createElement('input');
    inputName.type = 'text';
    inputName.name = 'name';
    inputName.placeholder = 'First and Last name';

    let inputEmail = document.createElement('input');
    inputEmail.type = "email";
    inputEmail.name = "email";
    inputEmail.id = "emailInput";
    inputEmail.placeholder = "email";

    let inputPassword = document.createElement('input');
    inputPassword.type = "password";
    inputPassword.name = "password";
    inputPassword.id = "passwordInput";
    inputPassword.placeholder = "password";

    let button = document.createElement('button');
    button.innerText = 'Save';
    button.addEventListener('click', () => {
        console.log('kackelikack');
        const name = inputName.value;
        const email = inputEmail.value;
        const password = inputPassword.value;
        //spara new user från input till databasen
        saveNewUser(name, email, password);
    })

    newUserDiv.appendChild(inputName);
    newUserDiv.appendChild(inputEmail);
    newUserDiv.appendChild(inputPassword);
    newUserDiv.appendChild(button);
}

//skapa new user
function saveNewUser(name, email, password) {

    fetch('http://localhost:3000/users/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name, email: email, password: password })
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            storeUser(data);
            newUserDiv.innerHTML = '';
        })
        .catch(error => {
            console.error('error', error);
        });
}

//skapa knapp för skapa dokument
function createDocButton() {
    let button = document.createElement('button');
    button.innerText = 'Create document';
    button.id = 'createDocument';
    button.addEventListener('click', () => {
        console.log('kliiiiiick');
        createNewDocument();
    })
    buttonHolder.appendChild(button);
}

//Skapa nytt dokument
function createNewDocument() {

    const article = document.createElement('article');
    article.classList.add('edit_document');
    article.id = 'editDocument';

    const input = document.createElement('input');
    input.id = 'documentHeading';
    input.name = 'documentHeading';
    input.type = 'text';
    input.placeholder = 'Enter document title';

    const textarea = document.createElement('textarea');
    textarea.id = 'editArea';
    textarea.name = 'editArea';
    textarea.cols = '60';
    textarea.rows = '30';
    textarea.placeholder = 'Enter document content';

    const button = document.createElement('button');
    button.id = 'saveEditButton';
    button.innerText = 'Save';
    button.addEventListener('click', () => {
        console.log('On click save this to DB: ', input.value, textarea.value);
        const content = textarea.value;
        const heading = input.value;

        // Skicka det nya dokumentet till servern för lagring
        saveNewDocToDB(content, heading);

        // Uppdatera dokumentlistan för att reflektera det nya dokumentet
        printDocList();
        const newDoc = { heading: heading, content: content };
        printReadDoc(newDoc);
    });

    article.appendChild(input);
    article.appendChild(textarea);
    article.appendChild(button);

    documentContainer.innerHTML = '';
    documentContainer.appendChild(article);
    initTinymce();

};

function saveNewDocToDB(content, heading) {
    const userId = getUser().id;

    fetch('http://localhost:3000/documents/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: userId, heading: heading, content: content })

    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log('Edit saved successfully: ', data);
            tinymce.remove();

        })
        .catch(error => {
            console.error('Error saving edit:', error);
        });


}


async function printDocList() {
    try {
        const user = await getUser();
        const response = await fetch(`http://localhost:3000/documents/?userId=${user.id}`)
        const data = await response.json();
        console.log('detta är datan: ', data.documents);

        documentList.innerHTML = '';

        if (data.documents.length === 0) {
            documentList.innerHTML = '<li>No documents available</li>';
        } else {
            data.documents.map(doc => {
                let li = document.createElement('li')
                li.innerText = doc.heading;

                li.addEventListener('click', () => {

                    console.log('du klickar på: ', doc.id);
                    //funktion för att öppna doc i läsläge
                    printReadDoc(doc);
                });
                let button = document.createElement('button');
                button.innerText = 'delete';
                button.addEventListener('click', () => {
                    console.log('du klickar på: ', doc.id);
                    //delete doc funktion (doc.id)?
                    deleteDocument(doc.id);
                    printDocList();
                });
                documentList.appendChild(button);
                documentList.appendChild(li);
            });

        }

    } catch (error) {
        console.error('Error fetching list', error);
        documentList.innerHTML = '<li>No documents available</li>';
    }
}

//funktion för att delete dokument
function deleteDocument(docId) {
    fetch(`http://localhost:3000/documents/${docId}`, {
        method: 'DELETE',
    })
        .then(res => res.json())
        .then(data => {
            console.log('raderad', data);

        })
        .catch(error => {
            console.error('Error deleting document', error);
        });
};


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
    content.innerHTML = doc.content;

    const editButton = document.createElement('button');
    editButton.id = 'editButton';
    editButton.innerText = 'Edit';
    editButton.addEventListener('click', () => {
        console.log('clicketiclack');
        printEditDoc(doc);
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

function printEditDoc(doc) {

    const article = document.createElement('article');
    article.classList.add('edit_document');
    article.id = 'editDocument';

    const input = document.createElement('input');
    input.id = 'documentHeading';
    input.name = 'documentHeading';
    input.type = 'text';
    input.placeholder = 'Document title';
    input.value = doc.heading;
    input.addEventListener('input', () => {
        console.log('Document title: ', input.value);
    });

    const textarea = document.createElement('textarea');
    textarea.id = 'editArea';
    textarea.name = 'editArea';
    textarea.cols = '60';
    textarea.rows = '30';
    textarea.value = doc.content;

    const button = document.createElement('button');
    button.id = 'saveEditButton';
    button.innerText = 'Save edit';
    button.addEventListener('click', () => {
        console.log('On click save this to DB: ', input.value, textarea.value);
        const editedContent = textarea.value;
        const editedHeading = input.value;
        const docId = doc.id;

        //uppdatera heading i db och content och lastEdited
        saveEditToDB(editedContent, editedHeading, docId);
        printDocList();

        const editedDoc = { id: docId, heading: editedHeading, content: editedContent };
        printReadDoc(editedDoc);
    });

    article.appendChild(input);
    article.appendChild(textarea);
    article.appendChild(button);

    documentContainer.innerHTML = '';
    documentContainer.appendChild(article);
    initTinymce();
}

//spara editerat dokument i databas

function saveEditToDB(editedContent, editedHeading, docId) {
    fetch('http://localhost:3000/documents', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: editedContent, heading: editedHeading, id: docId })
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log('Edit saved successfully: ', data);

        })
        .catch(error => {
            console.error('Error saving edit:', error);
        });

    tinymce.remove();
}
//Skapa nytt dokument, 2 fields ett för heading ett för content
//spara dokument i databas

init();