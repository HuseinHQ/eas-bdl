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
      if(err) res.send(err);
      else res.render('add', {tags});
    });
  };
};

module.exports = Controller;