// USER MODEL USED ONLY FOR LOGIN
// ***** DO NOT CONFUSE `USER.JS MODEL` WITH `MEMBERS.JS/ETC` FUNCTIONALITY THAT ENABLES CRUD >> USER MOODS / DAILY LOGGING
// ------------------------------------------------------------------------------------------------------------------------


// Requiring bcrypt for password hashing. Using the bcrypt-nodejs version as the regular bcrypt module
// sometimes causes errors on Windows machines
var bcrypt = require("bcrypt-nodejs");
// Creating our User model


module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    // The email cannot be null, and must be a proper email before creation. It must be unique.
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    // username cannot be null. Must be unique.
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    // The password cannot be null.
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
     token: {
      type: DataTypes.STRING,
      allowNull: true
    }

  });
  // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  //Automatically hashing user password when first signing up
  User.hook("beforeCreate", function(user) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  });
   //Automatically hashing user password when resetting password
  User.hook("beforeUpdate", function(user) {
    console.log('this is before update!!!!', user.password);
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  });
  
  User.associate = function(models) {
    // We're saying that a Post should belong to an Author
    // A Post can't be created without an Author due to the foreign key constraint
    User.hasMany(models.Emotion, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return User;
};
