const Barang = require('../models/Barang');

class BarangController {
  static async listPage(req, res) {
    try {
      const search = req.query.search || '';
      const barang = await Barang.getAll(search);
      res.render('barang', { barang });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async postBarang(req, res) {
    res.send('Post Barang');
  }

  static async putBarang(req, res) {
    res.send('Put Barang');
  }

  static async deleteBarang(req, res) {
    res.send('Delete Barang');
  }
}

module.exports = BarangController;
