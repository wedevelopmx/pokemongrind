var express = require('express');
var router = express.Router();
var models  = require('../models');

router.delete('/:id', function(req, res, next) {
  models.Account
  .findOne({ where : { id: req.params.id } })
  .then(function(account) {
    console.log(account.get({ plain: true}));
    account.destroy();
    res.json({ txt: 'instance deleted'});
  });
});

module.exports = router;
