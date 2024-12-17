const pool = require('./connection');
const fs = require('fs');

const karyawans = JSON.parse(fs.readFileSync('../data/karyawan.json', 'utf-8'))
  .map(
    (karyawan) =>
      `('${karyawan.nama}', '${karyawan.posisi}', '${new Date(karyawan.tanggal_mulai).toISOString()}', '${
        karyawan.nomor_telepon
      }', ${karyawan.gaji})`
  )
  .join();

const kategoris = JSON.parse(fs.readFileSync('../data/kategori.json', 'utf-8'))
  .map((kategori) => `('${kategori.nama}')`)
  .join();

const barangs = JSON.parse(fs.readFileSync('../data/barang.json', 'utf-8'))
  .map((barang) => `('${barang.nama}', ${barang.id_kategori}, ${barang.harga}, ${barang.stok})`)
  .join();

const transaksis = JSON.parse(fs.readFileSync('../data/transaksi.json', 'utf-8'))
  .map((transaksi) => `('${new Date(transaksi.tanggal).toISOString()}', ${transaksi.id_karyawan})`)
  .join();

const detailTransaksis = JSON.parse(fs.readFileSync('../data/detailTransaksi.json', 'utf-8'))
  .map(
    (detailTransaksi) =>
      `(${detailTransaksi.id_transaksi}, ${detailTransaksi.id_barang}, ${detailTransaksi.jumlah_barang})`
  )
  .join();

const queryKaryawans = `
INSERT INTO "Karyawan" ("nama", "posisi", "tanggal_mulai", "nomor_telepon", "gaji")
VALUES ${karyawans}
`;

const queryKategoris = `
INSERT INTO "Kategori" ("nama")
VALUES ${kategoris}
`;

const queryBarangs = `
INSERT INTO "Barang" ("nama", "id_kategori", "harga", "stok")
VALUES ${barangs}
`;

const queryTransaksis = `
INSERT INTO "Transaksi" ("tanggal", "id_karyawan")
VALUES ${transaksis}
`;

const queryDetailTransaksis = `
INSERT INTO "DetailTransaksi" ("id_transaksi", "id_barang", "jumlah_barang")
VALUES ${detailTransaksis}
`;

pool.query(queryKaryawans, (err) => {
  if (err) console.log('FAILED INSERT INTO KARYAWAN');
  else {
    console.log('SUCCESS INSERT INTO KARYAWAN');

    pool.query(queryKategoris, (err) => {
      if (err) console.log('FAILED INSERT INTO KATEGORI');
      else {
        console.log('SUCCESS INSERT INTO KATEGORI');

        pool.query(queryBarangs, (err) => {
          if (err) console.log('FAILED INSERT INTO BARANG', err);
          else {
            console.log('SUCCESS INSERT INTO BARANG');

            pool.query(queryTransaksis, (err) => {
              if (err) console.log('FAILED INSERT INTO TRANSAKSI');
              else {
                console.log('SUCCESS INSERT INTO TRANSAKSI');

                pool.query(queryDetailTransaksis, (err) => {
                  if (err) console.log('FAILED INSERT INTO DETAIL TRANSAKSI');
                  else {
                    console.log('SUCCESS INSERT INTO DETAIL TRANSAKSI');
                    pool.end();
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
