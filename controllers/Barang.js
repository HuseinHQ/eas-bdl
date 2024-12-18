const formatRupiah = require('../helpers/formatRupiah');
const Barang = require('../models/Barang');
const Kategori = require('../models/Kategori');

class BarangController {
  static async listPage(req, res) {
    const { search = '', kategori, nama, harga, stok } = req.query;
    try {
      const kategoriList = await Kategori.getAll();
      const barang = await Barang.getAll({ search, kategori, nama, harga, stok });
      res.render('barang', { barang, formatRupiah, nama, harga, stok, search, kategoriList, kategori });
    } catch (error) {
      console.log(error);
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

  static async deleteBarang(req, res) {
    const { id } = req.params;
    try {
      await Barang.delete(id);
      res.redirect('/barang');
    } catch (error) {
      if (error.name === 'error') {
        res.redirect(`/karyawan/add?err=${error.errors}`);
      } else {
        res.status(500).json(error);
      }
    }
  }

  static async editPage(req, res) {
    const { id } = req.params;
    const errors = req.query.err;
    try {
      const barang = await Barang.getById(id);
      const kategori = await Kategori.getAll();
      res.render('editBarang', { barang, kategori, errors });
    } catch (error) {
      console.log(error);
      if (error.name === 'error') {
        res.redirect(`/barang/${id}/edit?err=${error.errors}`);
      } else {
        res.status(500).json(error);
      }
    }
  }

  static async editBarang(req, res) {
    const { id } = req.params;
    const { nama, id_kategori, harga, stok } = req.body;
    try {
      await Barang.update(id, { nama, id_kategori, harga, stok });
      res.redirect('/barang');
    } catch (error) {
      if (error.name === 'error') {
        res.redirect(`/barang/${id}/edit?err=${error.errors}`);
      } else {
        res.status(500).json(error);
      }
    }
  }
}

module.exports = BarangController;
