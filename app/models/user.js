"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    displayName: { type: DataTypes.STRING, name: 'display_name' },
    email: { type: DataTypes.STRING, name: 'email' },
    avatar: { type: DataTypes.STRING, name: 'avatar' }
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Account, {as: 'accounts'});
      }
    }
  });

  return User;
};
