const express = require('express');
const router = express.Router();
const connection = require('../lib/conn');


/* GET users listing. */
router.get('/', (req, res) => {
  res.send('Here will users lie around and wait for something better to do');
});



// Login user check email/password-match
router.post('/login', (req, res) => {
  const {email, password} = req.body;

  let query = 'SELECT * FROM users WHERE email = ?';
  

  if (email) {
    connection.query(query, [email], function(err, result) {
      if (err) {
        console.log('error with query', err);
        res.status(500).json({error: 'internal server error'});
        return;
      }
      if (result.length === 0) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const user = result[0];
      if (password === user.password) {
        res.json({message:'Login successful', id: user.id, email: user.email, name: user.name });
        return;
      } else {
        res.status(401).json({message: 'Incorrect password'});
        return;
      }
    });
  } else {
    res.status(404).json({message: 'Please enter email'});
    return;
  }

});



module.exports = router;
