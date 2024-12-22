const res = require('express/lib/response');
const Transaksi = require('../models/Transaksi');
const formatDate = require('../helpers/formatDate');
const formatRupiah = require('../helpers/formatRupiah');
const Barang = require('../models/Barang');

class TransaksiController {
  static async listPage(req, res) {
    const { tanggal, total_harga, page } = req.query;
    try {
      const transaksi = await Transaksi.getAll({ tanggal, total_harga, page });
      res.render('transaksi', {
        transaksi: transaksi.data,
        pagination: transaksi.pagination,
        tanggal,
        total_harga,
        formatDate,
        formatRupiah,
        page,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async dashboard(req, res) {
    const { filter } = req.query;
    try {
      const chartData = await Transaksi.getCharData(filter);
      const mostSold = await Barang.mostSold();
      res.render('dashboard', { chartData, mostSold, filter });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async detailPage(req, res) {
    const { id } = req.params;
    try {
      const transaksi = await Transaksi.getById(id);
      res.render('detailTransaksi', { transaksi, formatDate, formatRupiah });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
}

module.exports = TransaksiController;
