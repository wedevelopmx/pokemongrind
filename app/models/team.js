"use strict";

module.exports = function(sequelize, DataTypes) {
  var Team = sequelize.define("Team", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tag: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {

      }
    }
  });

  return Team;
};
