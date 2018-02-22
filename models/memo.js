// ------------------------------------------------------------------------
module.exports = function(sequelize, DataTypes) {
  var Memo = sequelize.define("Memo", {
    Memo_Text: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Memo_Date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    }
  });

  Memo.associate = function(models) {
    Memo.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    })
  };
  return Memo;
};
