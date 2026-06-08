const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('student', 'admin'), defaultValue: 'student' },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false }
});

const Device = sequelize.define('Device', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  category: { type: DataTypes.STRING },
  quantity_total: { type: DataTypes.INTEGER, allowNull: false },
  quantity_available: { type: DataTypes.INTEGER, allowNull: false },
  imageUrl: { type: DataTypes.STRING, allowNull: true } 
});

const Order = sequelize.define('Order', {
  username: { type: DataTypes.STRING, allowNull: false },
  deviceName: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  startDate: { type: DataTypes.STRING, allowNull: true }, 
  endDate: { type: DataTypes.STRING, allowNull: true },   
  reason: { type: DataTypes.STRING, allowNull: true },
  status: { type: DataTypes.ENUM('Chờ duyệt', 'Đã duyệt', 'Từ chối', 'Đã trả', 'Quá hạn', 'Yêu cầu trả'), defaultValue: 'Chờ duyệt' }
});

Order.belongsTo(Device, { 
  foreignKey: 'deviceName', 
  targetKey: 'name', 
  as: 'Device' 
});
Device.hasMany(Order, { 
  foreignKey: 'deviceName', 
  sourceKey: 'name' 
});

Order.belongsTo(User, { 
  foreignKey: 'username', 
  targetKey: 'username', 
  as: 'User' 
});
User.hasMany(Order, { 
  foreignKey: 'username', 
  sourceKey: 'username' 
});

module.exports = { sequelize, User, Device, Order };