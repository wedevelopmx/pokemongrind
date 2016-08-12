"use strict";

module.exports = function(sequelize, DataTypes) {
  var Setting = sequelize.define("Setting", {
    name: { type: DataTypes.STRING, name: 'name' },
    bookmark: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, name: 'bookmark'},
    fav: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, name: 'favorite'},
    shop: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, name: 'shop' },
    follow: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, name: 'follow' }
  }, {
    classMethods: {
      associate: function(models) {
        Setting.belongsTo(models.User);
      }
    }
  });

  return Setting;
};
