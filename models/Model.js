const pool = require('../config/connection');
const { Shirt } = require('./Class');

class Model {
  static getShirts(cb) {
    const query = `
      SELECT s.*, t.name AS "tagName" FROM "Shirts" s 
      INNER JOIN "Tags" t ON s."TagId" = t.id 
    `;

    pool.query(query, (err, res) => {
      if(err) cb(err);
      else {
        res = res.rows.map(el => new Shirt(el.id, el.name, el.type, el.size, el.stock, el.TagId, el.tagName));
        cb(null, res);
      }
    })
  }

  static getTags(cb) {
    const query = `SELECT * FROM "Tags"`

    pool.query(query, (err, res) => {
      if(err) cb(err);
      else {
        res = res.rows.map()
      }
    })
  }
}

module.exports = Model;