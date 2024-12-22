const express = require('express');
const port = 3000;
const app = express();
const path = require('path');
const KaryawanController = require('./controllers/Karyawan');
const BarangController = require('./controllers/Barang');
const TransaksiController = require('./controllers/Transaksi');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));

app.get('/', TransaksiController.dashboard);

app.get('/karyawan', KaryawanController.listPage);
app.get('/karyawan/add', KaryawanController.addPage);
app.post('/karyawan', KaryawanController.addKaryawan);
app.get('/karyawan/:id/edit', KaryawanController.editPage);
app.post('/karyawan/:id', KaryawanController.editKaryawan);
app.get('/karyawan/:id/delete', KaryawanController.deleteKaryawan);

app.get('/barang', BarangController.listPage);
app.get('/barang/add', BarangController.addPage);
app.post('/barang', BarangController.addBarang);
app.get('/barang/:id/edit', BarangController.editPage);
app.post('/barang/:id', BarangController.editBarang);
app.get('/barang/:id/delete', BarangController.deleteBarang);

app.get('/transaksi', TransaksiController.listPage);
app.get('/transaksi/:id', TransaksiController.detailPage);

app.listen(port, () => console.log(`app listen to localhost:${port}`));
