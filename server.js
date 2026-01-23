const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const port = 3000;

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};

const app = express();
app.use(express.json());

app.listen(port, () => {
    console.log('Server running on port', port);
});

app.get('/allactivities', async (req,res) => {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM defaultdb.activities');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error for all cards' });
    }
});

app.post('/addactivity', async (req, res) => {
    const { activity_name, key_pillar, points } = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('INSERT INTO cards (cativity_name, key_pillar, points) VALUES (?, ?, ?)', [activity_name, key_pillar, points]);
        res.status(201).json({ message: 'Activity '+activity_name+' added successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not add card '+activity_name });
    }
});

app.put('/updateactivity/:id', async (req, res) => {
    const { id } = req.params;
    const { activity_name, key_pillar, points } = req.body;
    try{
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('UPDATE activities SET activity_name=?, key_pillar=?, points=? WHERE id=?', [activity_name, key_pillar, points, id]);
        res.status(201).json({ message: 'Activity ' + id + ' updated successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not update activity ' + id });
    }
});

app.delete('/deleteactivity/:id', async (req, res) => {
    const { id } = req.params;
    try{
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('DELETE FROM activities WHERE id=?', [id]);
        res.status(201).json({ message: 'Activity ' + id + ' deleted successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not delete activity ' + id });
    }
});