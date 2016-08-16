var express = require('express');
var router = express.Router();
var models  = require('../models');

router.get('/', function(req, res, next) {
  models.Team.findAll({
    attributes: ['id', 'name', 'motto', 'description', [models.sequelize.fn('COUNT', models.sequelize.col('members.id')), 'membersNumber'] ],
    include: [{
      attributes: [],
      model: models.User,
      as: 'members'
    }],
    group:  ['Team.id']
  })
  .then(function(teams) {
    res.json(teams);
  });
});

router.get('/:id', function(req, res, next) {
  models.Team.findOne({
    where: { id: req.params.id },
    attributes: ['id', 'name', 'motto', 'description'],
    include: [{
      attributes: ['id', 'displayName', 'avatar'],
      model: models.User,
      as: 'members'
    }],
    order: ['members.displayName']
  })
  .then(function(user) {
    res.json(user);
  })
});

router.post('/:id/join', function(req, res, next) {

  models.User.findOne({ where: { id: req.user.id } })
  .then(function(user) {
    if (user) {
      user.update({
        TeamId: req.params.id
      })
      .then(function () {
        res.json(user);
      });
    }
  })

});

module.exports = router;
