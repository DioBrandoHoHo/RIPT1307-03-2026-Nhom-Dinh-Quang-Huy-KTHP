const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'accclone6106@gmail.com',
    pass: process.env.EMAIL_PASS || 'wjqg jdwu klgk pcje'
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.log('EMAIL ERROR:', error);
  } else {
    console.log('EMAIL SERVER READY');
  }
});

const sendEmail = async (to, subject, htmlContent) => {
  const mailOptions = {
    from: `"Trung Tâm Quản Lý Thiết Bị Lab" <${process.env.EMAIL_USER || 'accclone6106@gmail.com'}>`,
    to: to,
    subject: subject,
    html: htmlContent
  };

  return transporter.sendMail(mailOptions);
};

const sendAutomatedEmail = async (toEmail, studentName, deviceName, quantity, endDate, type) => {
  let subject = '';
  let htmlContent = '';

  if (type === 'APPROVED') {
    subject = '[Quản lý Thiết bị Lab] - Đơn mượn thiết bị của bạn đã được phê duyệt';
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px;">
        <h2 style="color: #0f766e;">Thông báo Phê duyệt Đơn mượn</h2>
        <p>Chào bạn <strong>${studentName}</strong>,</p>
        <p>Đơn đăng ký mượn thiết bị của bạn đã được phê duyệt thành công bởi Ban quản trị trung tâm.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <tr>
            <td style="padding: 8px; background: #f8fafc; font-weight: bold; width: 35%;">Thiết bị mượn:</td>
            <td style="padding: 8px; background: #f8fafc;">${deviceName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Số lượng:</td>
            <td style="padding: 8px;">${quantity} cái</td>
          </tr>
          <tr>
            <td style="padding: 8px; background: #f8fafc; font-weight: bold;">Hạn trả dự kiến:</td>
            <td style="padding: 8px; background: #f8fafc; color: #ef4444; font-weight: bold;">${endDate}</td>
          </tr>
        </table>
        <p style="background: #f0fdfa; padding: 12px; border-left: 4px solid #14b8a6; color: #0f766e; border-radius: 4px;">
          <strong>* Hướng dẫn nhận đồ:</strong> Vui lòng mang theo thẻ sinh viên đến phòng Lab của trung tâm vào giờ hành chính để ký nhận và nhận bàn giao thiết bị vật tư.
        </p>
        <p style="font-size: 12px; color: #64748b; margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 15px;">Đây là email tự động từ hệ thống, vui lòng không phản hồi lại thư này.</p>
      </div>
    `;
  } else if (type === 'RETURNED') {
    subject = '[Quản lý Thiết bị Lab] - Xác nhận hoàn trả thiết bị thành công';
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px;">
        <h2 style="color: #2563eb;">Xác nhận Nhập kho Thành công</h2>
        <p>Chào bạn <strong>${studentName}</strong>,</p>
        <p>Ban quản trị trung tâm xác nhận đã thu hồi kiểm đếm và nhập kho thành công thiết bị từ đơn mượn của bạn.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <tr>
            <td style="padding: 8px; background: #f8fafc; font-weight: bold; width: 35%;">Thiết bị đã trả:</td>
            <td style="padding: 8px; background: #f8fafc;">${deviceName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Số lượng hoàn trả:</td>
            <td style="padding: 8px;">${quantity} cái</td>
          </tr>
          <tr>
            <td style="padding: 8px; background: #f8fafc; font-weight: bold; color: #10b981;">Trạng thái đơn:</td>
            <td style="padding: 8px; background: #f8fafc; color: #10b981; font-weight: bold;">Đã nhập kho thành công</td>
          </tr>
        </table>
        <p style="background: #eff6ff; padding: 12px; border-left: 4px solid #3b82f6; color: #1e40af; border-radius: 4px;">
          Cảm ơn bạn đã bảo quản và hoàn trả thiết bị vật tư đúng quy trình của trung tâm. Lịch sử mượn đồ sạch sẽ giúp đơn đăng ký lần sau của bạn được duyệt nhanh hơn.
        </p>
        <p style="font-size: 12px; color: #64748b; margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 15px;">Đây là email tự động từ hệ thống, vui lòng không phản hồi lại thư này.</p>
      </div>
    `;
  } else if (type === 'REJECTED') {
    subject = '[Quản lý Thiết bị Lab] - Thông báo từ chối yêu cầu mượn thiết bị';
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #fee2e2; padding: 20px; border-radius: 12px;">
        <h2 style="color: #dc2626;">Yêu cầu mượn thiết bị bị từ chối</h2>
        <p>Chào bạn <strong>${studentName}</strong>,</p>
        <p>Rất tiếc, yêu cầu đăng ký mượn thiết bị của bạn đã không được phê duyệt bởi Ban quản trị trung tâm.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <tr>
            <td style="padding: 8px; background: #fdf2f2; font-weight: bold; width: 35%;">Thiết bị đăng ký:</td>
            <td style="padding: 8px; background: #fdf2f2;">${deviceName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Số lượng:</td>
            <td style="padding: 8px;">${quantity} cái</td>
          </tr>
        </table>
        <p style="background: #fff5f5; padding: 12px; border-left: 4px solid #ef4444; color: #991b1b; border-radius: 4px;">
          Để biết thêm thông tin lý do chi tiết hoặc có sự nhầm lẫn về số lượng vật tư khả dụng, vui lòng liên hệ trực tiếp với Admin tại phòng máy trung tâm để được hỗ trợ giải quyết.
        </p>
        <p style="font-size: 12px; color: #64748b; margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 15px;">Đây là email tự động từ hệ thống, vui lòng không phản hồi lại thư này.</p>
      </div>
    `;
  } else if (type === 'REMIND') {
    subject = '[⚠️ Nhắc nhở] - Thiết bị mượn của bạn sắp đến hạn hẹn trả';
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #cbd5e1; padding: 20px; border-radius: 12px;">
        <h2 style="color: #b45309;">Thông báo Sắp đến hạn trả đồ</h2>
        <p>Chào bạn <strong>${studentName}</strong>,</p>
        <p>Hệ thống ghi nhận bạn đang giữ thiết bị của trung tâm và thời gian mượn sắp kết thúc trong 3 ngày tới.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <tr>
            <td style="padding: 8px; background: #f8fafc; font-weight: bold; width: 35%;">Thiết bị mượn:</td>
            <td style="padding: 8px; background: #f8fafc;">${deviceName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Số lượng:</td>
            <td style="padding: 8px;">${quantity} cái</td>
          </tr>
          <tr>
            <td style="padding: 8px; background: #f8fafc; font-weight: bold;">Hạn cuối trả đồ:</td>
            <td style="padding: 8px; background: #f8fafc; color: #b45309; font-weight: bold;">${endDate}</td>
          </tr>
        </table>
        <p style="background: #fffbeb; padding: 12px; border-left: 4px solid #f59e0b; color: #b45309; border-radius: 4px;">
          Vui lòng sắp xếp thời gian hoàn trả thiết bị đúng lịch hẹn để đảm bảo quyền lợi mượn đồ cho các lần tiếp theo và tránh phát sinh phí phạt.
        </p>
        <p style="font-size: 12px; color: #64748b; margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 15px;">Đây là email tự động từ hệ thống, vui lòng không phản hồi lại thư này.</p>
      </div>
    `;
  } else if (type === 'OVERDUE') {
    subject = '[🚨 CẢNH BÁO QUÁ HẠN] - Bạn đã quá hạn trả thiết bị và phát sinh phí';
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 2px solid #fee2e2; padding: 20px; border-radius: 12px;">
        <h2 style="color: #dc2626;">Cảnh báo Vi phạm Hạn trả Thiết bị</h2>
        <p>Chào bạn <strong>${studentName}</strong>,</p>
        <p>Hiện tại đơn mượn thiết bị của bạn đã vượt quá thời gian đăng ký mà trung tâm chưa tiếp nhận bàn giao trả kho.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <tr>
            <td style="padding: 8px; background: #fdf2f2; font-weight: bold; width: 35%; color: #991b1b;">Thiết bị vi phạm:</td>
            <td style="padding: 8px; background: #fdf2f2; color: #991b1b;">${deviceName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Số lượng giữ:</td>
            <td style="padding: 8px;">${quantity} cái</td>
          </tr>
          <tr>
            <td style="padding: 8px; background: #fdf2f2; font-weight: bold; color: #991b1b;">Ngày phải trả:</td>
            <td style="padding: 8px; background: #fdf2f2; color: #dc2626; font-weight: bold;">${endDate}</td>
          </tr>
        </table>
        <div style="background: #fdf2f2; padding: 14px; border-left: 5px solid #ef4444; color: #991b1b; border-radius: 4px; margin-bottom: 15px;">
          <strong>⚠️ Quy định xử lý phạt:</strong> Theo quy chế mới của phòng máy, tài khoản của bạn tạm thời bị khóa chức năng đăng ký đơn mới và bạn phải chịu một khoản phí phạt đền bù quá hạn tích lũy theo từng ngày cho tới khi thiết bị được nhập kho thành công.
        </div>
        <p>Yêu cầu bạn mang ngay thiết bị tới phòng Lab trung tâm để thực hiện thủ tục thu hồi trả hàng và quyết toán chi phí vi phạm.</p>
        <p style="font-size: 12px; color: #64748b; margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 15px;">Đây là email tự động từ hệ thống, vui lòng không phản hồi lại thư này.</p>
      </div>
    `;
  }

  return sendEmail(toEmail, subject, htmlContent);
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
  sendAutomatedEmail,
  sendOverdueNotification
};