// FOR DAILY MOODS / LOGGING MOODS-BY-DAY
// ------------------------------------------------------------------------
module.exports = function(sequelize, DataTypes) {
  var Emotion = sequelize.define("Emotion", {
    Emotion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Emotion_Date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    Positive_Emotion: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });

  Emotion.associate = function(models) {
    Emotion.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    })
  };

  return Emotion;
};
