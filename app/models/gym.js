"use strict";

module.exports = function(sequelize, DataTypes) {
  var Gym = sequelize.define("Gym", {
    name: { type: DataTypes.STRING, name: 'name' },
    level: { type: DataTypes.INTEGER, name: 'level' },
    latitude: { type: DataTypes.REAL, name: 'lat' },
    longitude: { type: DataTypes.REAL, name: 'lon' }
  }, {
    classMethods: {
      associate: function(models) {
        Gym.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });

        Gym.belongsToMany(models.User, { as: 'players', through: 'GymTeam' });
      }
    }
  });

  return Gym;
};
