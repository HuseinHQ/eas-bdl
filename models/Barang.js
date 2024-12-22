const pool = require('../config/connection');

class Barang {
  static pool = pool;

  static async getAll({ search, kategori, nama, harga, stok }) {
    let query =
      'SELECT b.id, b.nama, b.id_kategori, k.nama as kategori,  b.harga, b.stok FROM "Barang" b JOIN "Kategori" k ON b.id_kategori = k.id';
    if (search) {
      query += ` WHERE (b.nama ILIKE '%${search}%' OR b.harga::text ILIKE '%${search}%' OR b.stok::text ILIKE '%${search}%')`;
    }
    if (kategori && kategori !== 'all') {
      query += ` ${search ? 'AND' : 'WHERE'} b.id_kategori = ${kategori}`;
    }
    if (nama === 'ASC') {
      query += ' ORDER BY b.nama ASC';
    } else if (nama === 'DESC') {
      query += ' ORDER BY b.nama DESC';
    }
    if (harga === 'ASC') {
      query += ' ORDER BY b.harga ASC';
    } else if (harga === 'DESC') {
      query += ' ORDER BY b.harga DESC';
    }
    if (stok === 'ASC') {
      query += ' ORDER BY b.stok ASC';
    } else if (stok === 'DESC') {
      query += ' ORDER BY b.stok DESC';
    }

    try {
      const { rows } = await this.pool.query(query);
      return rows;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  static async getById(id) {
    try {
      const { rows } = await this.pool.query('SELECT * FROM "Barang" WHERE id = $1', [id]);
      return rows[0];
    } catch (error) {
      throw error;
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

  static async delete(id) {
    try {
      return this.pool.query('DELETE FROM "Barang" WHERE id = $1', [id]);
    } catch (error) {
      throw error;
    }
  }

  static async update(id, { nama, id_kategori, harga, stok }) {
    try {
      return this.pool.query('UPDATE "Barang" SET nama = $1, id_kategori = $2, harga = $3, stok = $4 WHERE id = $5', [
        nama,
        id_kategori,
        harga,
        stok,
        id,
      ]);
    } catch (error) {
      throw error;
    }
  }

  static async mostSold() {
    try {
      const query = `
            SELECT 
        b.id,
        b.nama,
        b.harga,
        total_penjualan
      FROM 
        "Barang" b
      JOIN (
        SELECT 
          dt.id_barang,
          SUM(dt.jumlah_barang) AS total_penjualan
        FROM 
          "DetailTransaksi" dt
        GROUP BY 
          dt.id_barang
      ) sub ON b.id = sub.id_barang
      ORDER BY 
        total_penjualan DESC;
      `;
      const { rows } = await this.pool.query(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Barang;
