var express = require('express');
var router = express.Router();
var models  = require('../models');
var extend = require('util')._extend;

var query = function(userId, gymId) {
    return "select g.id, g.name, g.latitude, g.longitude, COALESCE(SUM(gt.UserId), 0) as member, t.id as teamId, t.name as teamName, t.avatar as teamAvatar, COALESCE(SUM(summary.members), 0) AS members  " +
    "from Gyms as g left outer join Teams t " +  (gymId == undefined? "" : (" on g.id = " + gymId)) +
    "	left outer join GymTeams gt on g.id = gt.GymId " + (userId == undefined? "" : ("and gt.UserId = " + userId)) +
    "	left outer join (  " +
    "		select g.id as GymId, ut.id as TeamId, count(u.id) as members  " +
    "		from Gyms as g  " +
    "			join GymTeams as gt on g.id = gt.GymId " +  (gymId == undefined? "" : (" and g.id = " + gymId)) +
    "			join Users as u on u.id = gt.UserId  " +
    "			join Teams ut on ut.id = u.TeamId  " +
    "			group by g.id, ut.id  " +
    "	)  as summary on g.id = summary.GymId and t.id= summary.TeamId  " +
    (gymId == undefined? "" : (" where g.id = " + gymId)) +
    "	group by g.id, t.id  ";
}

var parseGym = function(rows) {
  var gymsHash = {},  gyms = [];
  //Iterate over all rows
  for(i in rows) {
    var row = rows[i];
    var gym = gymsHash[row.id];
    //We have not parsed this gym
    if(gym == undefined) {
      gym = {
        id: row.id,
        name: row.name,
        latitude: row.latitude,
        longitude: row.longitude,
        member: row.member == 0 ? false : true,
        teams: []
      };
      gyms.push(gym);
      gymsHash[row.id] = gym;
    }

    //We parse the team information
    gym.teams.push({
      id: row.teamId,
      name: row.teamName,
      avatar: row.teamAvatar,
      members: row.members
    });
  }
  return gyms;
}

router.get('/', function(req, res, next) {
  var userId = req.user == undefined ? 0 : req.user.id;
  models.sequelize.query(query(userId), { type: models.sequelize.QueryTypes.SELECT})
  .then(function(rows) {
    res.json(parseGym(rows));
  });
});

router.get('/:id', function(req, res, next) {
  models.Gym.findOne({
    where: { id: req.params.id },
    attributes: ['id', 'name', 'latitude', 'longitude'],
    include: [{
      attributes: ['id', 'displayName', 'level', 'avatar', 'bio', 'website'],
      model: models.User,
      as: 'players',
      through: {
        attributes: [],
        model: models.GymTeam
      },
      where: { TeamId: req.user.Team.id}
    }],
    order: [[{model: models.User, as: 'players'}, 'level', 'DESC']]
  })
  .then(function(gym) {
    res.json(gym);
  });
});

router.get('/:id/top', function(req, res, next) {
  models.Gym.findOne({
    where: { id: req.params.id },
    attributes: ['id', 'name', 'latitude', 'longitude'],
    include: [{
      attributes: ['id', 'displayName', 'level', 'avatar', 'bio', 'website'],
      model: models.User,
      as: 'players',
      through: {
        attributes: [],
        model: models.GymTeam
      },
      where: { TeamId: req.user.Team.id}
    }],
    order: [[{model: models.User, as: 'players'}, 'level', 'DESC']],
    limit: 7
  })
  .then(function(gym) {
    res.json(gym.players);
  });

});

router.post('/', function(req, res, next) {
  //Make creation link
  req.body.UserId = req.user.id;

  //Create Gym
  models.Gym
    .findOrCreate({where: { name: req.body.name}, defaults: req.body})
    .spread(function(gym, created) {
      console.log('Gym has been created: ' + gym.name);
      models.sequelize.query(query(req.user.id, gym.id), { type: models.sequelize.QueryTypes.SELECT})
      .then(function(rows) {
        res.json(parseGym(rows)[0]);
      });
    });
});

router.post('/:id/join', function(req, res, next) {
  console.log('Joining Gym: ' + req.params.id);
  //Join the Gym
  var team = {
    GymId: req.params.id,
    UserId: req.user.id,
    tag: req.body.tag
  };

  models.GymTeam
    .findOrCreate({where: team, defaults: team })
    .spread(function(team, created) {
      models.sequelize.query(query(req.user.id, req.params.id), { type: models.sequelize.QueryTypes.SELECT})
      .then(function(rows) {
        res.json(parseGym(rows)[0]);
      });
    });
});

router.post('/:id/leave', function(req, res, next) {
  console.log('Leaving Gym: ' + req.params.id);
  //Leave the Gym
  models.GymTeam
  .destroy({
    where : {
      GymId: req.params.id,
      UserId: req.user.id
    }
  })
  .then(function() {
    models.sequelize.query(query(req.user.id, req.params.id), { type: models.sequelize.QueryTypes.SELECT})
    .then(function(rows) {
      res.json(parseGym(rows)[0]);
    });
  });
});

module.exports = router;

// select g.id, g.name, g.latitude, g.longitude, COALESCE(SUM(gt.UserId), 0) as member, t.name as teamName, COALESCE(SUM(summary.members), 0) AS members
// from Gyms as g left outer join Teams t on g.id = 2
// 	left outer join GymTeams gt on g.id = gt.GymId and gt.UserId = 1
// 	left outer join (
// 		select g.id as GymId, ut.id as TeamId, count(u.id) as members
// 		from Gyms as g
// 			join GymTeams as gt on g.id = gt.GymId and g.id = 2
// 			join Users as u on u.id = gt.UserId
// 			join Teams ut on ut.id = u.TeamId
// 			group by g.id, ut.id
// 	)  as summary on g.id = summary.GymId and t.id= summary.TeamId
// 	where g.id = 2
// 	group by g.id, t.id
