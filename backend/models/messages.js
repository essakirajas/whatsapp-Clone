module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('messages', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',

    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    }
  }, { tableName: 'messages' });

  Message.associate = function (models) {
    Message.belongsTo(models.users, { foreignKey: 'userId' });
  };

  return Message;
};
