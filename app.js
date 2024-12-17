const express = require('express');
const port = 3000;
const app = express();
const KaryawanController = require('./controllers/Karyawan');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/karyawan', KaryawanController.listPage);
app.get('/karyawan/add', KaryawanController.addPage);
app.post('/karyawan/add', KaryawanController.addKaryawan);
app.get('/karyawan/:id/edit', KaryawanController.editPage);
app.post('/karyawan/:id/edit', KaryawanController.editKaryawan);
// app.get('/', Controller.listPage);
// app.get('/shirts/add', Controller.addPage);
// app.post('/shirts/add', Controller.addPagePost);
// app.get('/shirts/increase-stock/:id', Controller.increaseStock);
// app.get('/shirts/decrease-stock/:id', Controller.decreaseStock);
// app.get('/shirts/delete/:id', Controller.deleteShirt);

app.listen(port, () => console.log(`app listen to localhost:${port}`));
