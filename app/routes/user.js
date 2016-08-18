var express = require('express');
var router = express.Router();
var models  = require('../models');

/* GET users listing. */
router.get('/', function(req, res, next) {
  models.User.findAll().then(function(users) {
		res.json(users);
	});
});

router.get('/:id', function(req, res, next) {
  models.User
    .findOne({
      where : { id: req.params.id },
      include: [
        {
          attributes: ['id', 'name', 'createdAt', 'updatedAt'],
          model: models.Account,
          as: 'accounts'
        }, {
          attributes: ['id', 'name', 'shop', 'fav', 'bookmark', 'follow', 'updatedAt'],
          model: models.Setting,
          as: 'settings'
        }
      ]
    })
    .then(function(user) {
      user = user.get({ plain: true });
      //Account Syncronized
      user.sync = {};
      for(i in user.accounts) {
        var account = user.accounts[i];
        user.sync[account.name] = account;
      }
      //settings
      user.notifications = {};
      for(i in user.settings) {
        var settings = user.settings[i];
        user.notifications[settings.name] = settings;
      }
      res.json(user);
    });
});

router.put('/:id', function(req, res, next) {
  models.User
  .findOne({ where : { id: req.params.id } })
  .then(function(user) {
    user.update(req.body, { fields: ['displayName', 'company', 'location', 'bio', 'email', 'website', 'twitter', 'github', 'linkedin', 'TeamId', 'level'] })
      .then(function(user) {
        res.json(user);
      });
  });
});

router.post('/', function(req, res, next) {
	console.log(req.body);
	models.User
      .findOrCreate({where: { email: req.body.email}, defaults: req.body})
      .spread(function(user, created) {
        console.log(user.get({
          plain: true
        }))
        res.json(user);
      });
});

var teamsQuery = function(user) {
  return "select gout.id, gout.name, gout.level, team.number as members " +
        "    from Gyms gout join GymTeams as gt on gout.id = gt.GymId and gt.UserId = " + user.id +
        "    	left outer join (  " +
        "    		select g.id, g.name, count(gt.GymId) as number  " +
        "    		from Gyms as g join GymTeams as gt on g.id = gt.GymId  " +
        "    			join Users u on gt.UserId = u.id  " +
        "    			join Teams t on t.id = u.TeamId " + (user.Team ? (" and t.id = " + user.Team.id) : "") +
        "    		group by g.id  " +
        "    	) as team on gout.id = team.id  " +
        "    order by team.number desc";
}

var parseGym = function(rows) {
  var gyms = [];
  //Iterate over all rows
  for(i in rows) {
    var row = rows[i];
    var gym = {
      id: row.id,
      name: row.name,
      level: row.level,
      members: row.members
    };
    gyms.push(gym);
  }
  return gyms;
}

router.post('/:id/teams', function(req, res, next) {
  console.log('Pulling out teams listing');
  models.sequelize
    .query(teamsQuery(req.user), { type: models.sequelize.QueryTypes.SELECT})
    .then(function(rows) {
      res.json(parseGym(rows));
    });
});

// select gout.id, gout.name, team.number as members
// from Gyms gout join GymTeams as gt on gout.id = gt.GymId and gt.UserId = 1
// 	left outer join (
// 		select g.id, g.name, count(gt.GymId) as number
// 		from Gyms as g join GymTeams as gt on g.id = gt.GymId
// 			join Users u on gt.UserId = u.id
// 			join Teams t on t.id = u.TeamId and t.id = 3
// 		group by g.id
//
// 	) as team on gout.id = team.id
// order by team.number desc

module.exports = router;
