const express = require('express');
const cors = require('cors');
require('dotenv').config();

const appRoutes = require('./routes/appRoutes');
const appController = require('./controllers/appController');
const { sendEmail, sendOverdueNotification } = require('./services/emailService');
const { sequelize, Device, User, Order } = require('./models');

const app = express();

app.use(express.json());

app.use(cors({
  origin: [
    'https://luminous-biscotti-a9c907.netlify.app'
  ],
  credentials: true
}));

app.post('/api/register', appController.register);
app.post('/api/check-username', appController.checkUsername);
app.post('/api/auth/login', appController.login);

app.use('/api', appRoutes);

sequelize.sync()
  .then(async () => {
    console.log('Database đồng bộ thành công');

    try {
      const checkDevice = await Device.findOne();

      if (!checkDevice) {
        await Device.bulkCreate([
          {
            name: 'Máy tính Dell XPS 13',
            category: 'Laptop',
            quantity_total: 10,
            quantity_available: 10
          },
          {
            name: 'Chuột Logitech G Pro X',
            category: 'Phụ kiện',
            quantity_total: 15,
            quantity_available: 15
          },
          {
            name: 'Bàn phím cơ Neo65 Sonic HE',
            category: 'Phụ kiện',
            quantity_total: 5,
            quantity_available: 5
          }
        ], { ignoreDuplicates: true });

        console.log('Đã nạp dữ liệu mẫu');
      }
    } catch (error) {
      console.error('Lỗi tạo dữ liệu mẫu:', error);
    }

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server chạy tại port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Lỗi kết nối database:', error);
  });