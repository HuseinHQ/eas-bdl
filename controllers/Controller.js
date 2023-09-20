const pool = require('../config/connection');
const Model = require('../models/Model');

class Controller {
  static listPage(req, res) {
    const info = req.query.info;
    Model.getShirts((err, shirts) => {
      if(err) res.send(err);
      else res.render('home', {shirts, info});
    });
  };

  static addPage(req, res) {
    const errors = req.query.err;
    Model.getTags((err, tags) => {
      if(err) res.send(err);
      else res.render('add', {tags, errors});
    });
  };

  static addPagePost(req, res) {
    const shirt = req.body;
    Model.postShirts(shirt, err => {
      if(err) {
        if(err.name === 'ValidationError') {
          res.redirect(`/shirts/add?err=${err.errors}`);
        } else {
          res.send(err);
        }
      }
      else res.redirect('/');
    });
  };

  static increaseStock(req, res) {
    const id = req.params.id;
    Model.updateStock('increase', id, err => {
      if(err) {
        if(err.name === 'stock') {
          res.redirect('/')
        } else {
          res.send(err);
        }
      }
      else res.redirect('/');
    });
  };

  static decreaseStock(req, res) {
    const id = req.params.id;
    Model.updateStock('decrease', id, err => {
      if(err) {
        if(err.name === 'stock') {
          res.redirect('/')
        } else {
          res.send(err);
        }
      }
      else res.redirect('/');
    });
  };

  static deleteShirt(req, res) {
    const id = req.params.id;
    Model.deleteShirt(id, (err, data) => {
      if(err) res.send(err);
      else {
        if(data.name === 'delete') {
          res.redirect(`/?info=${data.msg}`)
        } else {
          res.redirect('/');
        }
      }
    })
  }
};

module.exports = Controller;