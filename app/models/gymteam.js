"use strict";

module.exports = function(sequelize, DataTypes) {
  var GymTeam = sequelize.define("GymTeam", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tag: { type: DataTypes.STRING, name: 'tag' }
  }, {
    classMethods: {
      associate: function(models) {

      }
    }
  });

  return GymTeam;
};
