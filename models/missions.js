// FOR DAILY MOODS / LOGGING MOODS-BY-DAY
// ------------------------------------------------------------------------
module.exports = function(sequelize, DataTypes) {
  var Mission = sequelize.define("Mission", {
    Mission_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Mission_Result: {
      type: DataTypes.STRING
    },
    Mission_Date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    }
  });

  Mission.associate = function(models) {
    Mission.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    })
  };
  return Mission;
};
