
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


//let loginButton = document.getElementById('loginButton');
let loginDiv = document.getElementById('loginDiv');
let logoutDiv = document.getElementById('logoutDiv');
let documentList = document.getElementById('documentList');
let documentContainer = document.getElementById('documentContainer');
let buttonHolder = document.getElementById('buttonHolder');
let newUserDiv = document.getElementById('newUserDiv');

function init() {
    printLogin();
    //Is user logged in?
    if (getUser() !== null) {
        printDocList();
        createDocButton();
        printLogout();
        loginDiv.innerHTML = '';
        loginDiv.classList.add('hidden');
    }
}


function printLogin() {
    loginDiv.innerHTML = '';
    loginDiv.classList.remove('hidden');

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

    let loginButton = document.createElement('button');
    loginButton.id = 'loginButton';
    loginButton.innerText = 'Login';
    loginButton.addEventListener('click', () => {

        let email = document.getElementById('emailInput').value;
        let password = document.getElementById('passwordInput').value;

        if (email === '' || password === '') {
            alert('Please fill in both email and password fields.');
            return;
        }

        fetch('http://localhost:3000/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        })
        .then(async (res) => {
            const result = await res.json();
            console.log(result);
            if (!res.ok) {
                throw new Error( result.message );
            }

            storeUser(result);
    
            document.getElementById('emailInput').value = '';
            document.getElementById('passwordInput').value = '';
            
            printDocList();
            createDocButton();
            loginDiv.innerHTML = '';
            loginDiv.classList.add('hidden');
            printLogout();
        })
        .catch (err => {
            console.error('error from catch', err);
            alert(err);
        });
    })

    let newUserButton = document.createElement('button');
    newUserButton.innerText = 'New user';
    newUserButton.id = 'newUserButton';
    newUserButton.addEventListener('click', () => {
    
        createNewUserForm();
        loginDiv.innerHTML = '';
        loginDiv.classList.add('hidden');
        
    })

    loginDiv.appendChild(inputEmail);
    loginDiv.appendChild(inputPassword);
    loginDiv.appendChild(loginButton);
    loginDiv.appendChild(newUserButton);
}

function printLogout() {
    logoutDiv.classList.remove('hidden');
    logoutDiv.innerHTML = '';
    const user = getUser();
    let nameP = document.createElement('p');
    nameP.innerText = user.name;
    let logoutButton = document.createElement('button');
    logoutButton.id = 'logoutButton';
    logoutButton.innerText = 'Logout';
    logoutButton.addEventListener('click', () => {
        logoutUser();
        documentList.innerHTML = '';
        buttonHolder.innerHTML = '';
        documentContainer.innerHTML = '';
        printLogin();
        logoutDiv.innerHTML = '';
    });
    logoutDiv.appendChild(nameP);
    logoutDiv.appendChild(logoutButton);
}

//Skapa ny användar-formulär
function createNewUserForm() {
    newUserDiv.classList.remove('hidden');
    newUserDiv.innerHTML = '';
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

    let backButton = document.createElement('button');
    backButton.innerText = 'Back';
    backButton.addEventListener('click', () => {

        newUserDiv.innerHTML = '';
        newUserDiv.classList.add('hidden');
        printLogin();

    });

    let saveButton = document.createElement('button');
    saveButton.innerText = 'Save and Login';
    saveButton.addEventListener('click', () => {
        
        const name = inputName.value;
        const email = inputEmail.value;
        const password = inputPassword.value;
        saveNewUser(name, email, password);
       
    });

    newUserDiv.appendChild(inputName);
    newUserDiv.appendChild(inputEmail);
    newUserDiv.appendChild(inputPassword);
    newUserDiv.appendChild(saveButton);
    newUserDiv.appendChild(backButton);
}

function saveNewUser(name, email, password) {

    fetch('http://localhost:3000/users/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name, email: email, password: password })
    })
        .then(async (res) => {
            const result = await res.json();
            if (!res.ok) {
                throw new Error(result.message);
            }
            storeUser(result);
            newUserDiv.innerHTML = '';
            printLogout();
            printDocList();
            createDocButton();
        }) 
        .catch(err => {
            console.error('error', err);
            alert(err);
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
    documentContainer.classList.remove('hidden');
    const article = document.createElement('article');
    article.classList.add('edit_document');
    article.id = 'createDocument';

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
    button.id = 'saveDocumentButton';
    button.innerText = 'Save';
    button.addEventListener('click', () => {
        console.log('On click save this to DB: ', input.value, textarea.value);
        const content = textarea.value;
        const heading = input.value;

        saveNewDocToDB(content, heading);

        // Uppdatera dokumentlistan för att reflektera det nya dokumentet
        printDocList();
        const newDoc = { heading: heading, content: content, };
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

//printa dok-listan
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
                button.innerText = 'X';
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

//delete dokument
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
    tinymce.remove();
    documentContainer.classList.remove('hidden');

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
        printEditDoc(doc);
    })

    const closeButton = document.createElement('button');
    closeButton.id = 'closeButton';
    closeButton.innerText = 'Close';
    closeButton.addEventListener('click', () => {
        documentContainer.innerHTML = '';
        documentContainer.classList.add('hidden');
    })

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
    button.innerText = 'Save';
    button.addEventListener('click', () => {
        console.log('On click save this to DB: ', input.value, textarea.value);
        const editedContent = textarea.value;
        const editedHeading = input.value;
        const docId = doc.id;

        saveEditToDB(editedContent, editedHeading, docId);
        printDocList();

        const editedDoc = { id: docId, heading: editedHeading, content: editedContent };
        printReadDoc(editedDoc);
    });
    const buttonBack = document.createElement('button');
    buttonBack.id = 'backEditButton';
    buttonBack.innerText = 'Back';
    buttonBack.addEventListener('click', () => {
        tinymce.remove();
        printDocList();
        documentContainer.innerHTML = '';
        printReadDoc(doc);
        
    });

    article.appendChild(input);
    article.appendChild(textarea);
    article.appendChild(button);
    article.appendChild(buttonBack);

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

init();