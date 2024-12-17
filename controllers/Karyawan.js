const pool = require('../config/connection');
const formatDate = require('../helpers/formatDate');
const formatRupiah = require('../helpers/formatRupiah');
const Karyawan = require('../models/Karyawan');

class KaryawanController {
  static async listPage(req, res) {
    try {
      const karyawan = await Karyawan.getAll();
      res.render('karyawan', { karyawan, formatRupiah, formatDate });
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
module.exports = KaryawanController;
