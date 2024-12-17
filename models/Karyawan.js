const pool = require('../config/connection');

class Karyawan {
  static pool = pool;

  constructor(id, nama, posisi, tanggal_mulai, nomor_telepon, gaji) {
    this.id = id;
    this.nama = nama;
    this.posisi = posisi;
    this.tanggal_mulai = tanggal_mulai;
    this.nomor_telepon = nomor_telepon;
    this.gaji = gaji;
  }

  static async getAll() {
    try {
      const result = await this.pool.query('SELECT * FROM "Karyawan"');
      const karyawan = result.rows.map(
        (karyawan) =>
          new Karyawan(
            karyawan.id,
            karyawan.nama,
            karyawan.posisi,
            karyawan.tanggal_mulai,
            karyawan.nomor_telepon,
            karyawan.gaji
          )
      );
      return karyawan;
    } catch (error) {
      throw error;
    }
  }

  static getById(id) {
    return this.pool.query('SELECT * FROM "Karyawan" WHERE id = $1', [id]);
  }

  static create(karyawan) {
    return this.pool.query(
      'INSERT INTO "Karyawan" (nama, posisi, tanggal_mulai, nomor_telepon, gaji) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [karyawan.nama, karyawan.posisi, karyawan.tanggal_mulai, karyawan.nomor_telepon, karyawan.gaji]
    );
  }

  static update(id, karyawan) {
    return this.pool.query(
      'UPDATE "Karyawan" SET nama = $1, posisi = $2, tanggal_mulai = $3, nomor_telepon = $4, gaji = $5 WHERE id = $6 RETURNING *',
      [karyawan.nama, karyawan.posisi, karyawan.tanggal_mulai, karyawan.nomor_telepon, karyawan.gaji, id]
    );
  }

  static delete(id) {
    return this.pool.query('DELETE FROM "Karyawan" WHERE id = $1', [id]);
  }
}

module.exports = Karyawan;
