const express = require('express');
const cors = require('cors');
const { sequelize, User, Device } = require('./models');
const appRoutes = require('./routes/appRoutes');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', appRoutes);


sequelize.sync({ force: true }).then(async () => {
  console.log('Database đã được làm sạch và đồng bộ thành công!');

  try {
    await User.create({
      username: 'admin',
      password: '123456', 
      role: 'admin',      
      email: 'admin@gmail.com',
      phone: '0123456789'
    });
    console.log('=== ĐÃ TỰ ĐỘNG TẠO TÀI KHOẢN TEST: admin / 123456 ===');


    await User.create({
      username: 'sinhvien',
      password: '123456', 
      role: 'student',   
      email: 'sinhvien@gmail.com',
      phone: '0987654321'
    });
    console.log('=== ĐÃ TỰ ĐỘNG TẠO TÀI KHOẢN TEST: sinhvien / 123456 ===');

  

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
    }

  } catch (dbError) {
    console.error('Lỗi khởi tạo dữ liệu test:', dbError.message);
  }

}).catch((err) => {
  console.error('Lỗi kết nối cơ sở dữ liệu:', err);
});

app.listen(5000, () => {
  console.log('Backend đang chạy tại Port 5000');
});