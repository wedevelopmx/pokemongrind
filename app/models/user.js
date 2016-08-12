"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    displayName: { type: DataTypes.STRING, name: 'display_name' },
    company: { type: DataTypes.STRING, name: 'company' },
    location: { type: DataTypes.STRING, name: 'location' },
    bio: { type: DataTypes.TEXT, name: 'bio' },
    email: { type: DataTypes.STRING, name: 'email' },
    website: { type: DataTypes.STRING, name: 'website' },
    twitter: { type: DataTypes.STRING, name: 'twitter' },
    github: { type: DataTypes.STRING, name: 'github' },
    linkedin:{ type: DataTypes.STRING, name: 'linkedin' },
    avatar: { type: DataTypes.STRING, name: 'avatar' },
    providerId: { type: DataTypes.STRING, name: 'providerId'}
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Setting, { as: 'settings'});
        User.hasMany(models.Account, { as: 'accounts'});

        User.belongsTo(models.Team, {
          as: 'team',
          foreignKey: {
            allowNull: true
          }
        });

        User.belongsToMany(models.Gym, { as: 'gyms', through: 'GymTeam' });
      }
    }
  });

  return User;
};
