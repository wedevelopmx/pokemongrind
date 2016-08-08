"use strict";

module.exports = function(sequelize, DataTypes) {
  var Gym = sequelize.define("Gym", {
    name: { type: DataTypes.STRING, name: 'name' },
    level: { type: DataTypes.INTEGER, name: 'level' },
    lat: { type: DataTypes.INTEGER, name: 'lat' },
    lon: { type: DataTypes.INTEGER, name: 'lon' }
  }, {
    classMethods: {
      associate: function(models) {
        Gym.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });

        Gym.belongsToMany(models.User, { as: 'teamMembers', through: 'Team' });
      }
    }
  });

  return Gym;
};
