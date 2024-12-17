const express = require('express');
const port = 3000;
const app = express();
const KaryawanController = require('./controllers/Karyawan');
const BarangController = require('./controllers/Barang');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/karyawan', KaryawanController.listPage);
app.get('/karyawan/add', KaryawanController.addPage);
app.post('/karyawan', KaryawanController.addKaryawan);
app.get('/karyawan/:id/edit', KaryawanController.editPage);
app.post('/karyawan/:id', KaryawanController.editKaryawan);

app.get('/barang', BarangController.listPage);
app.get('/barang/add', BarangController.addPage);
app.post('/barang', BarangController.addBarang);
app.delete('/barang/:id');

app.listen(port, () => console.log(`app listen to localhost:${port}`));
