const express = require('express');
const router = express.Router();
const connection = require('../lib/conn');

/* GET documents listing from one user. */
router.get('/', function (req, res) {
    const userId = req.query.userId;

    if (!userId) {
        res.status(400).json({ message: 'User Id is required' });
        return;
    }

    let query = 'SELECT * FROM documents WHERE userId = ? and (softDelete = 0 or softDelete is null)';
    connection.query(query, [userId], (err, data) => {
        console.log('data är:', data);
        if (err) {
            console.error('Error fetching documents', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
        //här ska vi hitta att checka och skicka mess om table är tomt för usern
        if (data.length === 0) {
            res.status(204).json({ message: 'No content found' });
        } else {
            res.json({ documents: data });
        }
    });
});

//hämta ett specifikt dokument
router.get('/:id', (req, res) => {
    const docId = req.params.id;

    let query = 'SELECT * FROM documents WHERE id = ?';
    let value = [docId];

    connection.query(query, value, (err, data) => {
        if (err) {
            console.error('Error fetching document', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
        res.json({ document: data })
    });
});

//Create document for a user
router.post('/add', (req, res) => {
    let { id, heading, content } = req.body;

    if (!id || !heading || !content) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
    }

    let documentContent = {
        userId: id, //ska egentligen hämtas inloggat id från localstorage
        heading: heading,
        content: content
    }

    let query = 'INSERT INTO documents (userId, heading, content) VALUES (?, ?, ?)';
    let values = [documentContent.userId, documentContent.heading, documentContent.content];

    connection.query(query, values, (err, data) => {
        if (err) {
            console.error('Error creating document', err);
            res.status(500).json({ message: 'Internal server error', error: err });
            return;
        }
        res.json({ message: 'Created new document successfully', newDocument: data });
    });
});

//Edit ett dokument för en user

router.put('/', (req, res) => {
    let { id, heading, content } = req.body;

    let query = 'UPDATE documents SET heading=?, content=?, lastEdited=current_timestamp WHERE id=?';
    let values = [heading, content, id]
    connection.query(query, values, (err, data) => {
        if (err) {
            console.error('Error editing document', err);
            res.status(500).json({ message: 'Internal server error', error: err });
            return;
        }
        res.json({ message: 'Edit complete', editedDoc: data[0].id });

    });
});

//Delete ett dokument

router.delete('/:id', (req, res) => {
    const docId = req.params.id;

    let query = 'UPDATE documents SET softDelete=1 WHERE id=?';

    connection.query(query, [docId], (err, data) => {
        if (err) {
            console.error('Error deleting document', err);
            res.status(500).json({ message: 'Internal server error', error: err });
            return;
        }
        res.json({ message: 'Delete complete', deletedDoc: data[0].id });
    });
});

module.exports = router;
