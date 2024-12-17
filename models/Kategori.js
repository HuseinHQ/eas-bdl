const pool = require('../config/connection');

class Kategori {
  static pool = pool;

  constructor({ id, nama }) {
    this.id = id;
    this.nama = nama;
  }

  static async getAll() {
    try {
      const query = `SELECT * from "Kategori"`;
      const { rows } = await this.pool.query(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Kategori;
