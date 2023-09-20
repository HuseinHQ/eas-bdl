const express = require('express');
const port = 3000;
const app = express();
const Controller = require('./controllers/Controller');

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));

app.get('/', Controller.listPage);
app.get('/shirts/add', Controller.addPage);

app.listen(port, () => console.log(`app listen to localhost:${port}`));