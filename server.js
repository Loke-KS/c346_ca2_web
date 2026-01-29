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
        res.status(500).json({ message: 'Server error for all activities' });
    }
});

app.post('/addactivity', async (req, res) => {
    const { name, category, points, date, notes, created_at } = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('INSERT INTO activities (name, category, points, date, notes) VALUES (?, ?, ?, ?, ?)', [name, category, points, date, notes ,created_at]);
        res.status(201).json({ message: 'Activity '+name+' added successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not add activity '+name });
    }
});

app.put('/updateactivity/:id', async (req, res) => {
    const { id } = req.params;
    const { name, category, points, date, notes, created_at  } = req.body;
    try{
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('UPDATE activities SET name=?, category=?, points=?, date=?, notes=? WHERE id=?', [name, category, points, date, notes, id]);
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

app.get('/allpoints', async (req,res) => {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT points FROM defaultdb.activities');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error for all points' });
    }
});