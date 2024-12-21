const res = require('express/lib/response');
const Transaksi = require('../models/Transaksi');
const formatDate = require('../helpers/formatDate');
const formatRupiah = require('../helpers/formatRupiah');

class TransaksiController {
  static async listPage(req, res) {
    const { tanggal, total_harga, search } = req.query;
    try {
      const transaksi = await Transaksi.getAll({ tanggal, total_harga });
      res.render('transaksi', { transaksi, tanggal, total_harga, search, formatDate, formatRupiah });
    } catch (error) {
      throw error;
    }
  }

  static async dashboard(req, res) {
    const { filter } = req.query;
    try {
      const chartData = await Transaksi.getCharData(filter);
      res.render('dashboard', { chartData, filter });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TransaksiController;
