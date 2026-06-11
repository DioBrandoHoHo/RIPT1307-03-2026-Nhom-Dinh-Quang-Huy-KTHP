const express = require('express');
const router = express.Router();
const { sendOverdueNotification } = require('../services/emailService');

router.post('/test-email', async (req, res) => {
  const { toEmail } = req.body;

  try {
    await sendOverdueNotification(
      toEmail || 'genshinplayer616@gmail.com',
      'Sinh Viên Test',
      'Giáo trình Cơ sở Dữ liệu & Thiết bị Switch HE',
      new Date().toLocaleDateString('vi-VN')
    );
    res.status(200).json({ success: true, message: 'Đã kích hoạt gửi mail quá hạn thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;