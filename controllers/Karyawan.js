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

  static async addPage(req, res) {
    const errors = req.query.err;
    const posisi = Karyawan.posisi;
    res.render('addKaryawan', { errors, posisi });
  }

  static async addKaryawan(req, res) {
    const { nama, nomor_telepon, gaji, posisi } = req.body;
    try {
      await Karyawan.create({ nama, nomor_telepon, gaji, posisi });
      res.redirect('/karyawan');
    } catch (error) {
      if (error.name === 'error') {
        res.redirect(`/karyawan/add?err=${error.errors}`);
      } else {
        res.status(500).json(error);
      }
    }
  }

  static async editPage(req, res) {
    const errors = req.query.err;
    const { id } = req.params;
    try {
      const karyawan = await Karyawan.getById(id);
      const posisi = Karyawan.posisi;
      res.render('editKaryawan', { karyawan, posisi, errors });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async editKaryawan(req, res) {
    const { id, tanggal_mulai, nama, nomor_telepon, gaji, posisi } = req.body;
    try {
      await Karyawan.update(id, { nama, tanggal_mulai, nomor_telepon, gaji, posisi });
      res.redirect('/karyawan');
    } catch (error) {
      if (error.name === 'error') {
        console.log(error);
        res.redirect(`/karyawan/${id}/edit?err=${error.errors}`);
      } else {
        res.status(500).json(error);
      }
    }
  }
}
module.exports = KaryawanController;
