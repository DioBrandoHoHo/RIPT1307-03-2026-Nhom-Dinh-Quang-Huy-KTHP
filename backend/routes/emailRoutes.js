const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, htmlContent) => {
  const mailOptions = {
    from: `"Academy Gear" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: subject,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions);
};

const sendOverdueNotification = async (studentEmail, studentName, deviceName, dueDate) => {
  const subject = `[CẢNH BÁO QUÁ HẠN] Trả Thiết Bị Kỹ Thuật - Academy Gear`;
  
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
      <div style="background-color: #0f172a; padding: 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px; letter-spacing: 0.5px;">ACADEMY GEAR HUB</h1>
        <p style="color: #f97316; margin: 4px 0 0 0; font-size: 12px; font-weight: bold; text-transform: uppercase;">Thông Báo Nhắc Nhở Vi Phạm</p>
      </div>
      <div style="padding: 30px; background-color: #ffffff; color: #334155;">
        <p style="font-size: 16px; margin-top: 0;">Chào <strong>${studentName}</strong>,</p>
        <p style="line-height: 1.6; font-size: 14px;">Hệ thống ghi nhận đơn mượn thiết bị kỹ thuật phục vụ học tập của ông hiện đã <strong>quá thời hạn hoàn trả</strong> theo quy định của Học viện.</p>
        
        <div style="background-color: #f8fafc; border-left: 4px solid #ef4444; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr>
              <td style="padding: 4px 0; color: #64748b; width: 120px;"><strong>Thiết bị mượn:</strong></td>
              <td style="padding: 4px 0; color: #0f172a;"><strong>${deviceName}</strong></td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b;"><strong>Hạn trả ban đầu:</strong></td>
              <td style="padding: 4px 0; color: #ef4444; font-weight: bold;">${dueDate}</td>
            </tr>
          </table>
        </div>

        <p style="line-height: 1.6; font-size: 14px;">Vui lòng sắp xếp thời gian mang thiết bị qua phòng quản lý kho đồ tại campus để bàn giao lại cho Ban quản trị, tránh ảnh hưởng đến điểm rèn luyện cũng như lượt mượn đồ lần sau.</p>
        
        <div style="text-align: center; margin-top: 30px;">
          <span style="display: inline-block; padding: 12px 24px; background-color: #ef4444; color: #ffffff; font-weight: bold; border-radius: 6px; text-decoration: none; font-size: 14px;">Hãy Hoàn Trả Thiết Bị Sớm</span>
        </div>
      </div>
      <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
        Đây là thư gửi tự động từ hệ thống quản lý vật tư thông tin. Vui lòng không trả lời thư này.
      </div>
    </div>
  `;

  return sendEmail(studentEmail, subject, htmlContent);
};

module.exports = {
  sendEmail,
  sendOverdueNotification
};