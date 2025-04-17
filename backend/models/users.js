const bcrypt = require('bcrypt');
const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
      unique: true
    },
    phoneNo: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    otp: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    imgUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, { tableName: 'users' });

  User.beforeSave(async (user) => {
    if (user.changed('password')) {
      const saltRounds = crypto.randomInt(4, 10);
      const salt = await bcrypt.genSalt(saltRounds);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  User.associate = function (models) {
    User.hasOne(models.messages, { foreignKey: 'userId' });
  };

  return User;
};
