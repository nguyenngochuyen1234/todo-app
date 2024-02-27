const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const connection = mysql.createConnection({
    host: 'bzfb6kzzfovy92oo6q8z-mysql.services.clever-cloud.com',
    user: 'udsbjqd3tgmnylgf',
    password: 'JWkkGksQRgblts5PVSFL',
    database: 'bzfb6kzzfovy92oo6q8z',
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/todos', (req, res) => {
    connection.query('SELECT * FROM todos', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});
app.get('/todos/:id', (req, res) => {
    const todoId = req.params.id;
    connection.query('SELECT * FROM todos WHERE id = ?', [todoId], (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: 'Todo not found' });
        }
    });
});

app.post('/todos', (req, res) => {
    const { title, description } = req.body;
    connection.query('INSERT INTO todos (title, description) VALUES (?, ?)', [title, description], (error, results) => {

        if (error) throw error;
        res.json({ id: results.insertId });
    });
});

app.delete('/todos/:id', (req, res) => {
    const todoId = req.params.id;
    connection.query('DELETE FROM todos WHERE id = ?', [todoId], (error, results) => {
        if (error) throw error;
        res.json({ message: 'Deleted successfully' });
    });
});
app.put('/todos/:id', (req, res) => {
    const todoId = req.params.id;
    console.log({todoId})
    const { title, description } = req.body;
    connection.query('UPDATE todos SET title = ?, description = ? WHERE id = ?', [title, description, todoId], (error, results) => {
        if (error) throw error;
        res.json({ message: 'Updated successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
