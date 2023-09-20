const pool = require('../config/connection');
const { Tag, Shirt } = require('./Class');

class Model {
  static getTags(cb) {
    const query = `SELECT * FROM "Tags"`

    pool.query(query, (err, res) => {
      if(err) cb(err);
      else {
        res = res.rows.map(el => new Tag(el.id, el.name));
        cb(null, res);
      };
    });
  };
  
  static getShirts(cb) {
    const query = `
      SELECT s.*, t.name AS "tagName" FROM "Shirts" s 
      INNER JOIN "Tags" t ON s."TagId" = t.id
      ORDER BY s.id
    `;

    pool.query(query, (err, res) => {
      if(err) cb(err);
      else {
        res = res.rows.map(el => new Shirt(el.id, el.name, el.type, el.size, el.stock, el.TagId, el.tagName));
        cb(null, res);
      };
    });
  };

  static postShirts(shirt, cb) {
    const { name, type, size, stock, TagId } = shirt;

    const query = `
    INSERT INTO "Shirts" ("name", "type", "size", "stock", "TagId")
    VALUES ($1, $2, $3, $4, $5)
    `;

    pool.query(query, [name, type, size, stock, TagId], err => {
      cb(err);
    });
  };

  static updateStock(tag, id, cb) {
    const getStock = `
      SELECT "stock" FROM "Shirts"
      WHERE id = ${+id}
    `

    let updateStock = `
    UPDATE "Shirts"
    `

    if(tag === 'increase') {
      updateStock += `SET "stock" = "stock" + 1`
    } else {
      updateStock += `SET "stock" = "stock" - 1`
    };

    updateStock += ` WHERE id = ${+id}`;

    pool.query(getStock, (err, res) => {
      if(err) cb(err);
      else {
        const stock = res.rows[0].stock;
        if(stock == 0 && tag === 'decrease') {
          cb({name: 'stock', msg: 'stock is empty'});
        } else if (stock == 100 && tag === 'increase') {
          cb({name: 'stock', msg: 'stock is full'});
        } else {
          pool.query(updateStock, err => {
            cb(err);
          });
        };
      };
    });
  };

  static getStock(cb) {
    const getStock = `
      SELECT "stock" FROM "Shirts"
      WHERE id = ${+id}
    `
  }

  static deleteShirt(id, cb) {
    
  }
};

module.exports = Model;