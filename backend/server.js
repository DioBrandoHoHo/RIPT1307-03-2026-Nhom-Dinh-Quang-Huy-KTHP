const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const appRoutes = require('./routes/appRoutes');

const app = express();

app.use(express.json());

app.use(cors({
  origin: [
    'https://ript-1307-03-2026-nhom-dinh-git-209829-diobrandohohos-projects.vercel.app',
    'https://ript-1307-03-2026-nhom-dinh-quang-huy-kthp.vercel.app',
    'https://ript-1307-03-2026-nhom-dinh-quang-huy-kthp-8om4-8dbjjy0a0.vercel.app'
  ],
  credentials: true
}));

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === '123456') {
    return res.json({
      success: true,
      message: 'Đăng nhập admin thành công!',
      token: 'mock-jwt-token-admin-xyz123',
      user: { username: 'admin', role: 'admin', email: 'admin@gmail.com' }
    });
  }
  
  if (username === 'sinhvien' && password === '123456') {
    return res.json({
      success: true,
      message: 'Đăng nhập sinh viên thành công!',
      token: 'mock-jwt-token-student-abc456',
      user: { username: 'sinhvien', role: 'student', email: 'sinhvien@gmail.com' }
    });
  }

  return res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu!' });
});

app.use('/api', appRoutes);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './render_ultimate_db.sqlite',
  logging: false
});

const Device = sequelize.define('Device', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  category: { type: DataTypes.STRING },
  quantity_total: { type: DataTypes.INTEGER, allowNull: false },
  quantity_available: { type: DataTypes.INTEGER, allowNull: false },
  imageUrl: { type: DataTypes.STRING, allowNull: true } 
});

const Order = sequelize.models.Order;

sequelize.sync().then(async () => {
  console.log('Database đã được đồng bộ và cập nhật thành công!');
  try {
    const checkDevice = await Device.findOne();
    if (!checkDevice) {
      await Device.create({
        name: 'Máy tính Dell XPS 13',
        category: 'Laptop',
        quantity_total: 10,
        quantity_available: 10
      });
      await Device.create({
        name: 'Chuột Logitech G Pro X',
        category: 'Phụ kiện',
        quantity_total: 15,
        quantity_available: 15
      });
      await Device.create({
        name: 'Bàn phím cơ Neo65 Sonic HE',
        category: 'Phụ kiện',
        quantity_total: 5,
        quantity_available: 5
      });
      console.log('=== ĐÃ NẠP SẴN DANH SÁCH THIẾT BỊ KHỚP VỚI MODEL ===');
    } else {
      console.log('=== DỮ LIỆU THIẾT BỊ ĐÃ TỒN TẠI ===');
    }

  } catch (dbError) {
    console.error('Lỗi khởi tạo dữ liệu test:', dbError.message);
  }

}).catch((err) => {
  console.error('Lỗi kết nối cơ sở dữ liệu:', err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend đang chạy online mượt mà tại Port ${PORT}`);
});