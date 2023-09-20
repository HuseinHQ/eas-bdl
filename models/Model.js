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
    const errors = this.formValidation(name, type, size, stock, TagId);

    if(errors.length) return cb({err: 'ValidationError', errors});

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

  static getStock(id, cb) {
    const query = `
      SELECT "stock" FROM "Shirts"
      WHERE id = ${+id}
    `

    pool.query(query, (err, res) => {
      if(err) cb(err);
      else {
        const stock = res.rows[0].stock;
        cb(null, stock);
      }
    })
  }

  static deleteShirt(id, cb) {
    const query = `
      DELETE FROM "Shirts"
      WHERE id = ${+id}
    `;

    this.getStock(id, (err, stock) => {
      if(err) cb(err);
      else {
        if(stock == 0) {
          pool.query(query, err => {
            cb(err);
          })
        } else {
          cb(null, {name: 'delete', msg: 'Cannot delete shirt because stock is still available'})
        }
      }
    })
  }

  static formValidation(name, type, size, stock, TagId) {
    const errors = []
    
    if(!name) errors.push('Name must be filled');
    if(name.split(" ").length < 2) errors.push('Name must contain minmimal 2 words');
    if(!type) errors.push('Type must be filled');
    if(!size) errors.push('Size must be filled');
    if(!stock) errors.push('Stock must be filled');
    if(stock < 0 && stock > 100) errors.push('Stock must be between 0 and 100');
    if(!TagId) errors.push('Tag must be filled');

    return errors;
  }
};

module.exports = Model;