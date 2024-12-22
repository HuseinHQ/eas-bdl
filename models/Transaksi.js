const pool = require('../config/connection');

class Transaksi {
  static pool = pool;

  static async getAll({ limit = 10, page = 1, tanggal, total_harga } = {}) {
    const offset = (page - 1) * limit;

    const orderQuery = `ORDER BY ${tanggal ? 'sub.tanggal' : 'sub.total_harga'} ${
      tanggal && tanggal === 'DESC'
        ? 'DESC'
        : tanggal === 'ASC'
        ? 'ASC'
        : total_harga && total_harga === 'ASC'
        ? 'ASC'
        : 'DESC'
    }`;

    try {
      const countQuery = `
        SELECT COUNT(*) AS total
        FROM (
            SELECT t.id
            FROM "Transaksi" t
            JOIN "Karyawan" k ON t.id_karyawan = k.id
            JOIN "DetailTransaksi" dt ON dt.id_transaksi = t.id
            JOIN "Barang" b ON b.id = dt.id_barang
            GROUP BY t.id, k.nama
        ) sub
      `;

      const countResult = await this.pool.query(countQuery);
      const totalRecords = parseInt(countResult.rows[0].total, 10);
      const totalPage = Math.ceil(totalRecords / limit);

      const query = `
        SELECT sub.* 
        FROM (
            SELECT t.*,
                  k.nama AS nama_karyawan,
                  SUM(b.harga * dt.jumlah_barang)::integer AS total_harga
            FROM "Transaksi" t
            JOIN "Karyawan" k ON t.id_karyawan = k.id
            JOIN "DetailTransaksi" dt ON dt.id_transaksi = t.id
            JOIN "Barang" b ON b.id = dt.id_barang
            GROUP BY t.id, k.nama
        ) sub
        ${orderQuery}
        LIMIT $1
        OFFSET $2
      `;

      const { rows } = await this.pool.query(query, [limit, offset]);

      const result = rows.map((row) => ({
        ...row,
      }));

      return {
        data: result,
        pagination: {
          page,
          isLastPage: page >= totalPage,
          isFirstPage: page <= 1,
          totalPage,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  static async getCharData() {
    try {
      // Define the queries for each period
      const queries = {
        daily: `
          SELECT 
              t.id AS id_transaksi,
              t.tanggal tanggal_transaksi,
              SUM(b.harga * dt.jumlah_barang)::integer AS total_pemasukan
          FROM "Transaksi" t
          JOIN "DetailTransaksi" dt ON t.id = dt.id_transaksi
          JOIN "Barang" b ON b.id = dt.id_barang
          JOIN "Karyawan" k ON t.id_karyawan = k.id
          WHERE t.tanggal::date = CURRENT_DATE
          GROUP BY t.id, t.tanggal, k.nama
          ORDER BY t.tanggal;
        `,
        weekly: `
          SELECT 
              t.tanggal, 
              SUM(b.harga * dt.jumlah_barang)::integer AS total_pemasukan
          FROM "Transaksi" t
          JOIN "DetailTransaksi" dt ON t.id = dt.id_transaksi
          JOIN "Barang" b ON b.id = dt.id_barang
          WHERE t.tanggal >= CURRENT_DATE - INTERVAL '6 days'
          GROUP BY t.tanggal
          ORDER BY t.tanggal;
        `,
        monthly: `
          SELECT 
              DATE_TRUNC('week', t.tanggal)::date AS minggu, 
              SUM(b.harga * dt.jumlah_barang)::integer AS total_pemasukan
          FROM "Transaksi" t
          JOIN "DetailTransaksi" dt ON t.id = dt.id_transaksi
          JOIN "Barang" b ON b.id = dt.id_barang
          WHERE t.tanggal >= CURRENT_DATE - INTERVAL '1 month'::interval
          GROUP BY DATE_TRUNC('week', t.tanggal)
          ORDER BY minggu;
        `,
        annually: `
          SELECT 
              DATE_TRUNC('month', t.tanggal)::date AS bulan, 
              SUM(b.harga * dt.jumlah_barang)::integer AS total_pemasukan
          FROM "Transaksi" t
          JOIN "DetailTransaksi" dt ON t.id = dt.id_transaksi
          JOIN "Barang" b ON b.id = dt.id_barang
          WHERE t.tanggal >= CURRENT_DATE - INTERVAL '1 year'
          GROUP BY DATE_TRUNC('month', t.tanggal)
          ORDER BY bulan;
        `,
      };

      // Execute all queries and store the results
      const results = {};
      for (const [period, query] of Object.entries(queries)) {
        const { rows } = await this.pool.query(query);
        results[period] = rows;
      }

      // Return the results for all periods
      return results;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const query = `
      SELECT 
        t.id AS transaksi_id,
        t.tanggal,
        k.id AS karyawan_id,
        k.nama AS nama_karyawan,
        k.posisi AS jabatan_karyawan,
        dt.jumlah_barang,
        b.nama AS nama_barang,
        b.harga AS harga_barang,
        (b.harga * dt.jumlah_barang)::integer AS total_per_item,
        SUM(b.harga * dt.jumlah_barang) OVER (PARTITION BY t.id)::integer AS total_harga
      FROM "Transaksi" t
      JOIN "Karyawan" k ON t.id_karyawan = k.id
      JOIN "DetailTransaksi" dt ON dt.id_transaksi = t.id
      JOIN "Barang" b ON b.id = dt.id_barang
      WHERE t.id = $1
    `;

      const result = await this.pool.query(query, [id]);

      if (result.rows.length === 0) {
        return null;
      }

      const transaksi = {
        id: result.rows[0].transaksi_id,
        tanggal: result.rows[0].tanggal,
        karyawan: {
          id: result.rows[0].karyawan_id,
          nama: result.rows[0].nama_karyawan,
          posisi: result.rows[0].jabatan_karyawan,
        },
        detail: result.rows.map((row) => ({
          nama_barang: row.nama_barang,
          jumlah_barang: row.jumlah_barang,
          harga_barang: row.harga_barang,
          total: row.total_per_item,
        })),
        total_harga: result.rows[0].total_harga,
      };

      return transaksi;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Transaksi;
