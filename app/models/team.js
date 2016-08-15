"use strict";

module.exports = function(sequelize, DataTypes) {
  var Team = sequelize.define("Team", {
    name: { type: DataTypes.STRING, name: 'name' },
    motto: { type: DataTypes.STRING, name: 'motto' },
    description: { type: DataTypes.STRING, name: 'description' },
    avatar: { type: DataTypes.STRING, name: 'avatar' }
  }, {
    classMethods: {
      associate: function(models) {

      }
    }
  });

  return Team;
};
