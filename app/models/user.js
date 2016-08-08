"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    displayName: { type: DataTypes.STRING, name: 'display_name' },
    email: { type: DataTypes.STRING, name: 'email' },
    avatar: { type: DataTypes.STRING, name: 'avatar' },
    team: { type: DataTypes.STRING, name: 'team' }
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Account, {as: 'accounts'});

        User.belongsToMany(models.Gym, { as: 'teams', through: 'Team' });
      }
    }
  });

  return User;
};
