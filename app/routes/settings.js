var express = require('express');
var router = express.Router();
var models  = require('../models');
var isLoggedIn = require('../modules/auth').isLoggedIn;

router.put('/:id', isLoggedIn, function(req, res, next) {
  models.Setting
  .findOne({ where : { id: req.params.id } })
  .then(function(setting) {
    setting.update(req.body, { fields: ['shop', 'fav', 'bookmark', 'follow'] })
      .then(function(setting) {
        res.json(setting);
      });
  });
});

module.exports = router;
