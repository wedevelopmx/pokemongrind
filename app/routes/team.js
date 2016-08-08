var express = require('express');
var router = express.Router();
var models  = require('../models');

router.get('/', function(req, res, next) {
  var user = ;

  if(req.query.userId !== undefined)
    user.where = {
      id: req.user.id
    };

  model.User.findAll({
    attributes: ['id', 'name', 'avatar'],
    where: { id: req.user.id },
    include: [{
      attributes: ['id', 'name', 'level'],
      model: models.Gym
      through: {
        attributes: ['tag'],
        model: models.Team
      },
      include: [{
        attributes: ['id', 'name', 'avatar']
        model: models.User,
        through: {
          attributes: [],
          model: models: models.Team
        }
      }]
    }]
  })
  .then(function(users) {
    res.json(users);
  });

});

module.exports = router;
