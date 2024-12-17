const pool = require('../config/connection');

class Barang {
  static pool = pool;

  constructor({ id, id_kategori, nama, harga, stok }) {
    this.id = id;
    this.id_kategori = id_kategori;
    this.nama = nama;
    this.harga = harga;
    this.stok = stok;
  }

  static async getAll(search = '') {
    const query =
      'SELECT b.id, b.nama, b.id_kategori, k.nama as kategori,  b.harga, b.stok FROM "Barang" b JOIN "Kategori" k ON b.id_kategori = k.id';
    if (search) {
      query += ` WHERE b.nama ILIKE '%${search}%' OR k.nama ILIKE '%${search}%'`;
    }
    try {
      const { rows } = await this.pool.query(query);
      console.log(rows, '<><><>');
      return rows.map((row) => new Barang(row));
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

module.exports = Barang;
