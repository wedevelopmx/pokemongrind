var express = require('express');
var router = express.Router();
var models  = require('../models');

router.put('/:id', function(req, res, next) {
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
