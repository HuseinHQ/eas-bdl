const express = require('express');
const port = 3000;
const app = express();
const KaryawanController = require('./controllers/Karyawan');
const BarangController = require('./controllers/Barang');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/karyawan', KaryawanController.listPage);
app.get('/karyawan/add', KaryawanController.addPage);
app.post('/karyawan/add', KaryawanController.addKaryawan);
app.get('/karyawan/:id/edit', KaryawanController.editPage);
app.post('/karyawan/:id/edit', KaryawanController.editKaryawan);

app.get('/barang', BarangController.listPage);

app.listen(port, () => console.log(`app listen to localhost:${port}`));
