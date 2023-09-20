const pool = require('../config/connection');
const Model = require('../models/Model');

class Controller {
  static listPage(req, res) {
    Model.getShirts((err, shirts) => {
      if(err) res.send(err);
      else res.render('home', {shirts});
    });
  };

  static addPage(req, res) {
    Model.getTags((err, tags) => {
      if(err) {
        if(err.name === 'ValidationError') {
          res.redirect(`/shirts/add?err=${err.errors}`);
        } else {
          res.send(err);
        }
      }
      else res.render('add', {tags});
    });
  };

  static addPagePost(req, res) {
    const shirt = req.body;
    Model.postShirts(shirt, err => {
      if(err) res.send(err);
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
    Model.deleteShirt(id, err => {
      if(err) res.send(err);
      else res.redirect('/');
    })
  }
};

module.exports = Controller;