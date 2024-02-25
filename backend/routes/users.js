const express = require('express');
const router = express.Router();
const connection = require('../lib/conn');

// Create new user
router.post('/add', (req, res) => {
    const {name, email, password} = req.body;

    if (!name || !email || !password) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
    }

    let queryCheckExists = 'SELECT * FROM users WHERE email = ?';
    connection.query(queryCheckExists, [email], (existErr, existResult) => {
        if (existErr) {
            console.log('error with query', existErr);
            res.status(500).json({ error: 'internal server error' });
            return;
        }

        if (existResult.length !== 0) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
    
        let query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        let values = [name, email, password];
    
        connection.query(query, values, (err, data) => {
            if (err) {
                console.log('error with query', err);
                res.status(500).json({ error: 'internal server error' });
                return;
            }
            let newUserData = {
                id: data.insertId,
                name: name,
                email: email
            }
            res.json({message: 'New user created', newUser: newUserData});
            return;
        });
    
    });
});


// Login user
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (email) {
        //validate email
        if(!email.includes('@')) {
            res.status(400).json({message: 'Invalid email address'});
            return; 
        }

        let query = 'SELECT * FROM users WHERE email = ?';
        connection.query(query, [email], (err, result) => {
            if (err) {
                console.log('error with query', err);
                res.status(500).json({ message: 'internal server error' });
                return;
            }
            if (result.length === 0) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            const user = result[0];
            if (password === user.password) {
                res.json({id: user.id, email: user.email, name: user.name });
                return;
            } else {
                res.status(401).json({ message: 'Incorrect password' });
                return;
            }
        });
    } else {
        res.status(404).json({ message: 'Please enter email' });
        return;
    }

});



module.exports = router;
