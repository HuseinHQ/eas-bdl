const formatRupiah = require('../helpers/formatRupiah');
const Barang = require('../models/Barang');
const Kategori = require('../models/Kategori');

class BarangController {
  static async listPage(req, res) {
    try {
      const search = req.query.search || '';
      const barang = await Barang.getAll(search);
      res.render('barang', { barang, formatRupiah });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async addPage(req, res) {
    try {
      const errors = req.query.err;
      const kategori = await Kategori.getAll();
      res.render('addBarang', { kategori, errors });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async addBarang(req, res) {
    const { nama, id_kategori, harga, stok } = req.body;
    try {
      await Barang.create({ nama, id_kategori, harga, stok });
      res.redirect('/barang');
    } catch (error) {
      if (error.name === 'error') {
        res.redirect(`/karyawan/add?err=${error.errors}`);
      } else {
        res.status(500).json(error);
      }
    }
  }
}

module.exports = BarangController;
