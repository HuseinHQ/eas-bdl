const pool = require('./connection');

const dropTables = `DROP TABLE IF EXISTS "LaporanTransaksi", "DetailTransaksi", "Transaksi", "Barang", "Kategori", "Karyawan" CASCADE`;

// Tabel Karyawan
const createKaryawanTable = `
CREATE TABLE IF NOT EXISTS "Karyawan" (
  id serial PRIMARY KEY,
  nama varchar NOT NULL,
  posisi varchar NOT NULL,
  tanggal_mulai timestamp NOT NULL,
  nomor_telepon varchar NOT NULL,
  gaji integer NOT NULL
)
`;

// Tabel Kategori
const createKategoriTable = `
CREATE TABLE IF NOT EXISTS "Kategori" (
  id serial PRIMARY KEY,
  nama varchar NOT NULL
)
`;

// Tabel Barang
const createBarangTable = `
CREATE TABLE IF NOT EXISTS "Barang" (
  id serial PRIMARY KEY,
  nama varchar NOT NULL,
  id_kategori integer REFERENCES "Kategori"(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  harga integer NOT NULL,
  stok integer NOT NULL
)
`;

// Tabel Transaksi
const createTransaksiTable = `
CREATE TABLE IF NOT EXISTS "Transaksi" (
  id serial PRIMARY KEY,
  tanggal timestamp NOT NULL,
  id_karyawan integer REFERENCES "Karyawan"(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
)
`;

// Tabel Detail Transaksi (Many-to-Many)
const createDetailTransaksiTable = `
CREATE TABLE IF NOT EXISTS "DetailTransaksi" (
  id_transaksi integer REFERENCES "Transaksi"(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  id_barang integer REFERENCES "Barang"(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  jumlah_barang integer NOT NULL,
  PRIMARY KEY (id_transaksi, id_barang)
)
`;

// Tabel Laporan Transaksi
const createLaporanTransaksiTable = `
CREATE TABLE IF NOT EXISTS "LaporanTransaksi" (
  id serial PRIMARY KEY,
  tanggal_mulai timestamp NOT NULL,
  tanggal_akhir timestamp NOT NULL,
  laporan_text text NOT NULL
)
`;

pool.query(dropTables, (err) => {
  if (err) return console.log('FAILED DROP TABLES');
  else {
    console.log('SUCCESS DROP TABLES');

    pool.query(createKaryawanTable, (err) => {
      if (err) console.log('FAILED CREATE TABLE KARYAWAN');
      else {
        console.log('SUCCESS CREATE TABLE KARYAWAN');

        pool.query(createKategoriTable, (err) => {
          if (err) console.log('FAILED CREATE TABLE KATEGORI');
          else {
            console.log('SUCCESS CREATE TABLE KATEGORI');

            pool.query(createBarangTable, (err) => {
              if (err) console.log('FAILED CREATE TABLE BARANG');
              else {
                console.log('SUCCESS CREATE TABLE BARANG');

                pool.query(createTransaksiTable, (err) => {
                  if (err) console.log('FAILED CREATE TABLE TRANSAKSI');
                  else {
                    console.log('SUCCESS CREATE TABLE TRANSAKSI');

                    pool.query(createDetailTransaksiTable, (err) => {
                      if (err) console.log('FAILED CREATE TABLE DETAIL TRANSAKSI');
                      else {
                        console.log('SUCCESS CREATE TABLE DETAIL TRANSAKSI');

                        pool.query(createLaporanTransaksiTable, (err) => {
                          if (err) console.log('FAILED CREATE TABLE LAPORAN TRANSAKSI');
                          else console.log('SUCCESS CREATE TABLE LAPORAN TRANSAKSI');
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  }
});
