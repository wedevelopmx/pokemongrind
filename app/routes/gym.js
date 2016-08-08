var express = require('express');
var router = express.Router();
var models  = require('../models');

router.get('/', function(req, res, next) {
  models.Gym.findAll().then(function(gyms) {
		res.json(gyms);
	});
});

router.post('/', function(req, res, next) {

  //Make creation link
  req.body.UserId = req.user.id;

  //Create Gym
  models.Gym
    .findOrCreate({where: { name: req.body.name}, defaults: req.body})
    .spread(function(gym, created) {
      res.json(gym);
    });
});

router.post('/:id/join', function(req, res, next) {
  //Join the Gym
  var team = {
    GymId: req.params.id,
    UserId: req.user.id,
    tag: req.body.tag
  };

  models.Team
    .findOrCreate({where: team, defaults: team })
    .spread(function(team, created) {
      res.json(team);
    });

});

module.exports = router;
