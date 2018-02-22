// FOR DAILY MOODS / LOGGING MOODS-BY-DAY
// ------------------------------------------------------------------------
module.exports = function(sequelize, DataTypes) {
  var Active_Mission = sequelize.define("Active_Mission", {
    Mission_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Activation_Date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    }
  });

  Active_Mission.associate = function(models) {
    Active_Mission.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    })
  };
  return Active_Mission;
};
