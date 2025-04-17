'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { CONFIG } = require('../config/config');
const basename = path.basename(__filename);
const db = {};

const sequelize = new Sequelize(CONFIG.DB_NAME, CONFIG.DB_USERNAME, CONFIG.DB_PASS, {
  host: CONFIG.HOST,
  dialect: 'mysql',
  port: CONFIG.DB_PORT,
  define: {
    timestamps: false,
  },
  dialectOptions: {
    decimalNumbers: true,
  },
  pool: {
    max: Number(CONFIG.MAX_POOL_CONN),
    min: Number(CONFIG.MIN_POOL_CONN),
    idle: CONFIG.CONN_IDLE_TIME,
  },
});

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

db.connect = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = db;
