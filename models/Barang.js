const pool = require('../config/connection');

class Barang {
  static pool = pool;

  static async getAll(search = '') {
    const query =
      'SELECT b.id, b.nama, b.id_kategori, k.nama as kategori,  b.harga, b.stok FROM "Barang" b JOIN "Kategori" k ON b.id_kategori = k.id';
    if (search) {
      query += ` WHERE b.nama ILIKE '%${search}%' OR k.nama ILIKE '%${search}%'`;
    }
    try {
      const { rows } = await this.pool.query(query);
      return rows;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  static async create({ nama, id_kategori, harga, stok }) {
    try {
      return this.pool.query(
        'INSERT INTO "Barang" (nama, id_kategori, harga, stok) VALUES ($1, $2, $3, $4) RETURNING *',
        [nama, id_kategori, harga, stok]
      );
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Barang;
