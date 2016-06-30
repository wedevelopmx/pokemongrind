"use strict";

module.exports = function(sequelize, DataTypes) {
  var Account = sequelize.define("Account", {
    name: { type: DataTypes.STRING, name: 'name' },
    profileId: { type: DataTypes.INTEGER, name: 'profile_id' },
    joinedAt: { type: DataTypes.DATE, name: 'joined_at'},
    updatedAt: { type: DataTypes.DATE, name: 'updated_at'},
    token: { type: DataTypes.STRING, name: 'token' }
  }, {
    classMethods: {
      associate: function(models) {
        Account.belongsTo(models.User);
      }
    }
  });

  return Account;
};
