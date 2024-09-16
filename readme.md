
Inlämningsuppgift: Notes

Vi bygger ett dokumenthanteringssystem med en relationsdatabas!

Bakgrund

Du har fått en kund som vill bygga ett eget system för att skapa digitala dokument och önskar att se en demo på detta.
Kunden vill kunna logga in på sitt system, där se en lista på alla skapade dokument, kunna skapa nya och redigera de som redan finns där. Samt ta bort ett dokument. När kunden tittar på ett skapat dokument så skall det finnas möjlighet att se dokumentet både “live” dvs utan redigeringsläget samt att se dokumentet i redigeringsläge.

G krav

Det skall finnas en inloggning, men nivån på säkerhet för prototyp bestämmer du själv (dokumentera hur du har valt att göra). 
Dokument skall skapas och sparas i en MySql databas.
Projektet skall utformas som en headless applikation, dvs med ett frontend projekt och ett API.
För dokument skall det finnas en enkel redigering, där det går att skriva och ändra text. 
Ett dokument skall kunna visas i både redigerings och “vanligt” läge.
Förutom dessa tekniska krav är resten utav arkitekturen upp till dig. 
Alla CRUD operationer skall användas. Create, Read, Update, Delete.

VG Krav

Det skall gå att skapa nya användare som kan skapa sina egna dokument. Och enbart se sina skapade dokument.
Det skall finnas en WYSIWYG editorn där det går att ändra både textfärg och bakgrundsfärg i editorn, samt att det skall gå att spara. 
Du skall även bifoga ett enklare dokument som visar hur databasen och dess relationer är konstruerat. 


Inlämning

Projektet skall genomföras enligt headless principen men skapa strukturen för projektet i ett repo. Dvs i rooten kommer du ha en mapp som heter tex “frontend” och en mapp som heter “backend”. Dokumentera i readme.md hur projektet startas och är uppbyggt.

Skicka in länken till ert repo.

Bifoga även en databasdump (export) med lite innehåll så att projektet går att testa.
Samt dokumentera användarnamn och lösenord för databasen.




# Simple document system with a relations database

An assignment for school. An application to create, read, and edit documents and store them to a SQL database. I chose to edit with tinyMCE.



## Screenshots

![QuickNotes Login](frontend/src/assets/screenshots/QuickNotes_login.jpg)

![QuickNotes readDoc](frontend/src/assets/screenshots/QuickNotes_readDoc.jpg)

![QuickNotes editDoc](frontend/src/assets/screenshots/QuickNotes_editDoc.jpg)


## Built with
 
The project is built using the following:
 

### Frontend
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) 
![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) 

### Backend
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)	
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
 

### WYSIWYG

TinyMCE


## SQL Relations

![alt text](backend/database/QuickNotesEER.JPG)


## Run Locally

Clone the project

```bash
  git clone https://github.com/plugga-tech/notes-Annika-Nyholm-1
```

Go to the project directory

```bash
  cd backend/
```

Install dependencies

```bash
  npm install 
  npx express-generator --no-view
  npm install cors mysql2 dotenv
```

Run database scripts
backend/databse
users.sql
documents.sql

Start the server

```bash
  nodemon start
```

Frontend

```bash
  cd frontend/
```
Install dependencies

```bash
  npm install 
  npm install -g sass
  npm install normalize tinymce
```
Open with live server




