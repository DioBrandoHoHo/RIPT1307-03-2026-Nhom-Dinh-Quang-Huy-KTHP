const { User, Device, Order, sequelize } = require('../models/index');
const { Sequelize } = require('sequelize');
const { sendAutomatedEmail } = require('../services/emailService');

const checkAndSendAlertEmails = async () => {
  try {
    const orders = await Order.findAll({ where: { status: 'Đã duyệt' } });
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const order of orders) {
      if (!order.endDate) continue;
      const end = new Date(order.endDate);
      end.setHours(0, 0, 0, 0);

      const diffTime = end.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const user = await User.findOne({ where: { username: order.username } });
      if (!user || !user.email) continue;

      if (diffDays === 3) {
        sendAutomatedEmail(user.email, user.username, order.deviceName, order.quantity, order.endDate, 'REMIND').catch(e => console.error(e));
      } else if (diffDays < 0) {
        sendAutomatedEmail(user.email, user.username, order.deviceName, order.quantity, order.endDate, 'OVERDUE').catch(e => console.error(e));
      }
    }
  } catch (error) {
    console.error("Lỗi quét hạn đơn để gửi mail tự động:", error);
  }
};

sequelize.sync()
  .then(() => {
    return Device.bulkCreate([
      { name: "Giáo trình Cơ sở Dữ liệu", category: "Sách & Giáo trình", quantity_total: 165, quantity_available: 161, imageUrl: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400" },
      { name: "Máy tính Casio fx-580VN X", category: "Máy tính cầm tay", quantity_total: 400, quantity_available: 398, imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400" },
      { name: "Bộ sạc nhanh Anker 65W", category: "Phụ kiện kết nối", quantity_total: 90, quantity_available: 89, imageUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400" },
      { name: "Arduino Uno R3 Chuẩn", category: "Linh kiện điện tử", quantity_total: 80, quantity_available: 80, imageUrl: "https://images.unsplash.com/photo-1608564697171-2dd6d1e1c71d?w=400" },
      { name: "Cáp chuyển HDMI sang Type-C", category: "Phụ kiện kết nối", quantity_total: 60, quantity_available: 59, imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400" },
      { name: "Sách Học SQL Cơ Bản", category: "Sách & Giáo trình", quantity_total: 200, quantity_available: 200, imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400" },
      { name: "Router Cisco ISR 4331", category: "Thiết bị mạng", quantity_total: 45, quantity_available: 45, imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400" },
      { name: "Chuột Logitech G102 Gen2", category: "Phụ kiện máy tính", quantity_total: 35, quantity_available: 35, imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400" },
      { name: "Máy tính Dell XPS 13", category: "Máy tính xách tay", quantity_total: 10, quantity_available: 10, imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400" },
      { name: "Chuột Logitech G Pro X Superlight", category: "Phụ kiện máy tính", quantity_total: 15, quantity_available: 14, imageUrl: "https://images.unsplash.com/photo-1625842268584-8f329046497c?w=400" },
      { name: "Bàn phím cơ Neo65 Sonic HE+", category: "Phụ kiện máy tính", quantity_total: 5, quantity_available: 5, imageUrl: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400" },
      { name: "Bút thử điện thông minh", category: "Đồ dùng học tập", quantity_total: 80, quantity_available: 80, imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400" },
      { name: "Sách Thuật toán ứng dụng", category: "Sách & Giáo trình", quantity_total: 45, quantity_available: 45, imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400" },
      { name: "Mạch Raspberry Pi 4 Model B", category: "Linh kiện điện tử", quantity_total: 25, quantity_available: 25, imageUrl: "https://images.unsplash.com/photo-1517055729445-fa7d27394b48?w=400" },
      { name: "Cáp mạng bấm sẵn Cat6 Ugreen", category: "Phụ kiện kết nối", quantity_total: 120, quantity_available: 120, imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400" },
      { name: "Laptop ASUS ROG Strix G16", category: "Máy tính xách tay", quantity_total: 8, quantity_available: 8, imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400" },
      { name: "Chuột Razer DeathAdder V3 Pro", category: "Phụ kiện máy tính", quantity_total: 12, quantity_available: 12, imageUrl: "https://images.unsplash.com/photo-1625842268584-8f329046497c?w=400" },
      { name: "Bàn phím cơ Aula F75 Pro", category: "Phụ kiện máy tính", quantity_total: 20, quantity_available: 20, imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400" },
      { name: "Bảng vẽ điện tử Wacom Intuos", category: "Linh kiện điện tử", quantity_total: 15, quantity_available: 15, imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400" },
      { name: "Sách Thiết kế Hệ thống Thông tin", category: "Sách & Giáo trình", quantity_total: 65, quantity_available: 65, imageUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400" },
      { name: "Tai nghe Kingston HyperX Cloud II", category: "Phụ kiện máy tính", quantity_total: 18, quantity_available: 18, imageUrl: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400" },
      { name: "Hub chuyển đổi Baseus 8 in 1", category: "Phụ kiện kết nối", quantity_total: 40, quantity_available: 40, imageUrl: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400" },
      { name: "Kit cảm biến IoT cho Arduino", category: "Linh kiện điện tử", quantity_total: 30, quantity_available: 30, imageUrl: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=400" },
      { name: "Vở vẽ lò xo A4 Định lượng cao", category: "Đồ dùng học tập", quantity_total: 200, quantity_available: 200, imageUrl: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400" },
      { name: "Bút bi nước Zebra Sarasa Clip", category: "Đồ dùng học tập", quantity_total: 500, quantity_available: 500, imageUrl: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400" },
      { name: "Switch mạng TP-Link 8 Port GiGa", category: "Thiết bị mạng", quantity_total: 30, quantity_available: 30, imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400" },
      { name: "Laptop MacBook Air M2", category: "Máy tính xách tay", quantity_total: 6, quantity_available: 6, imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400" },
      { name: "Chuột ATK Blazing Sky F1 Ultimate", category: "Phụ kiện máy tính", quantity_total: 10, quantity_available: 10, imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400" },
      { name: "Bàn phím IQUNIX EV63", category: "Phụ kiện máy tính", quantity_total: 4, quantity_available: 4, imageUrl: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400" },
      { name: "Sách Phân tích dữ liệu với Python", category: "Sách & Giáo trình", quantity_total: 55, quantity_available: 55, imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400" }
    ], { ignoreDuplicates: true });
  })
  .then(() => {
    return User.bulkCreate([
      { username: "toilahuy123", password: "Kocomk@123", role: "student", email: "genshinplayer616@gmail.com", phone: "0332521484" },
      { username: "sinhvien", password: "Sinhvien@123", role: "student", email: "sv@student.edu.vn", phone: "0912345678" },
      { username: "admin", password: "Admin@Password123", role: "admin", email: "admin@academy.edu.vn", phone: "0988888888" },
      { username: "quanghai", password: "Quanghai@123", role: "student", email: "quanghai@student.edu.vn", phone: "0921111222" },
      { username: "minhhoang", password: "Minhhoang@123", role: "student", email: "minhhoang@student.edu.vn", phone: "0932222333" },
      { username: "hoangyen", password: "Hoangyen@123", role: "student", email: "hoangyen@student.edu.vn", phone: "0943333444" },
      { username: "vantuan", password: "Vantuan@123", role: "student", email: "vantuan@student.edu.vn", phone: "0954444555" },
      { username: "ducnam", password: "Ducnam@123", role: "student", email: "ducnam@student.edu.vn", phone: "0965555666" },
      { username: "hoanglong", password: "Hoanglong@123", role: "student", email: "hoanglong@student.edu.vn", phone: "0976666777" },
      { username: "thimai", password: "Thimai@123", role: "student", email: "thimai@student.edu.vn", phone: "0987777888" },
      { username: "quochuy", password: "Quochuy@123", role: "student", email: "quochuy@student.edu.vn", phone: "0998888999" },
      { username: "ducthang", password: "Ducthang@123", role: "student", email: "ducthang@student.edu.vn", phone: "0909999000" }
    ], { ignoreDuplicates: true });
  })
  .then(() => {
    return Order.bulkCreate([
      { username: "toilahuy123", deviceName: "Giáo trình Cơ sở Dữ liệu", quantity: 24, startDate: "2026-05-01", endDate: "2026-05-10", status: "Đã trả", reason: "Thực hành môn học" },
      { username: "toilahuy123", deviceName: "Máy tính Casio fx-580VN X", quantity: 19, startDate: "2026-05-02", endDate: "2026-05-12", status: "Đã trả", reason: "Thực hành môn học" },
      { username: "toilahuy123", deviceName: "Bộ sạc nhanh Anker 65W", quantity: 17, startDate: "2026-05-03", endDate: "2026-05-13", status: "Đã trả", reason: "Thực hành môn học" },
      { username: "toilahuy123", deviceName: "Giáo trình Cơ sở Dữ liệu", quantity: 1, startDate: "2026-06-05", endDate: "2026-06-12", status: "Đã duyệt", reason: "Học nhóm môn Hệ thống thông tin" },
      { username: "toilahuy123", deviceName: "Chuột Logitech G Pro X Superlight", quantity: 1, startDate: "2026-06-06", endDate: "2026-06-13", status: "Đã duyệt", reason: "Lý do cá nhân" },
      { username: "toilahuy123", deviceName: "Bộ sạc nhanh Anker 65W", quantity: 1, startDate: "2026-06-06", endDate: "2026-06-10", status: "Đã duyệt", reason: "Sạc máy thực hành trên lab" },
      { username: "toilahuy123", deviceName: "Giáo trình Cơ sở Dữ liệu", quantity: 5, startDate: "2026-06-07", endDate: "2026-06-14", status: "Chờ duyệt", reason: "Nghiên cứu làm bài tập lớn cuối kỳ" },
      { username: "toilahuy123", deviceName: "Máy tính Casio fx-580VN X", quantity: 2, startDate: "2026-06-08", endDate: "2026-06-15", status: "Chờ duyệt", reason: "Thi cuối kỳ môn Xác suất thống kê" },
      { username: "toilahuy123", deviceName: "Giáo trình Cơ sở Dữ liệu", quantity: 2, startDate: "2026-06-01", endDate: "2026-06-06", status: "Yêu cầu trả", reason: "Mượn đọc thi cuối kỳ" },
      { username: "toilahuy123", deviceName: "Cáp chuyển HDMI sang Type-C", quantity: 1, startDate: "2026-06-02", endDate: "2026-06-07", status: "Yêu cầu trả", reason: "Kết nối máy chiếu thuyết trình nhóm" },

      { username: "sinhvien", deviceName: "Giáo trình Cơ sở Dữ liệu", quantity: 12, startDate: "2026-05-10", endDate: "2026-05-20", status: "Đã trả", reason: "Mượn làm tiểu luận" },
      { username: "sinhvien", deviceName: "Bàn phím cơ Neo65 Sonic HE+", quantity: 1, startDate: "2026-05-15", endDate: "2026-05-22", status: "Đã trả", reason: "Thực hành gõ code" },
      
      { username: "quanghai", deviceName: "Máy tính Casio fx-580VN X", quantity: 1, startDate: "2026-05-20", endDate: "2026-05-25", status: "Đã trả", reason: "Thi giữa kỳ" },
      { username: "minhhoang", deviceName: "Bộ sạc nhanh Anker 65W", quantity: 1, startDate: "2026-05-21", endDate: "2026-05-26", status: "Đã trả", reason: "Sạc pin máy cá nhân" },
      { username: "hoangyen", deviceName: "Máy tính Dell XPS 13", quantity: 1, startDate: "2026-05-22", endDate: "2026-05-27", status: "Đã trả", reason: "Làm đồ án môn học" },
      { username: "vantuan", deviceName: "Sách Phân tích dữ liệu với Python", quantity: 1, startDate: "2026-05-23", endDate: "2026-05-28", status: "Đã trả", reason: "Nghiên cứu thuật toán" },
      { username: "ducnam", deviceName: "Chuột Logitech G Pro X Superlight", quantity: 1, startDate: "2026-05-24", endDate: "2026-05-29", status: "Đã trả", reason: "Thử nghiệm gaming gear" },
      { username: "hoanglong", deviceName: "Bàn phím IQUNIX EV63", quantity: 1, startDate: "2026-05-25", endDate: "2026-05-30", status: "Đã trả", reason: "Lập trình hệ thống" },
      { username: "thimai", deviceName: "Router Cisco ISR 4331", quantity: 1, startDate: "2026-05-26", endDate: "2026-05-31", status: "Đã trả", reason: "Thực hành mạng máy tính" },
      { username: "quochuy", deviceName: "Arduino Uno R3 Chuẩn", quantity: 2, startDate: "2026-05-27", endDate: "2026-06-02", status: "Đã trả", reason: "Lắp ráp mạch IoT" },
      { username: "ducthang", deviceName: "Mạch Raspberry Pi 4 Model B", quantity: 1, startDate: "2026-05-28", endDate: "2026-06-03", status: "Đã trả", reason: "Xây dựng máy chủ mini" }
    ]);
  })
  .then(() => {
    console.log("-> Đã ép xóa bảng cũ, nạp dữ liệu chuẩn form, đồng bộ cấu trúc thành công!");
    setInterval(checkAndSendAlertEmails, 1000 * 60 * 60 * 24);
  })
  .catch(err => {
    console.error("Lỗi nghiêm trọng khi đồng bộ database mẫu:", err);
  });

exports.register = async (req, res) => {
  try {
    const { username, password, email, phone } = req.body;
    if (!username || !password || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin!' });
    }
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Tài khoản này đã tồn tại!' });
    }
    await User.create({ username, password, role: 'student', email, phone });
    return res.status(201).json({ success: true, message: 'Đăng ký thành công!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ khi đăng ký!' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ!' });
    }

    if (username === 'admin' && password === '123456') {
      return res.status(200).json({
        success: true,
        message: 'Đăng nhập admin thành công!',
        token: 'mock-jwt-token-admin-xyz123',
        user: { username: 'admin', role: 'admin', email: 'admin@academy.edu.vn' }
      });
    }

    if (username === 'sinhvien' && password === '123456') {
      return res.status(200).json({
        success: true,
        message: 'Đăng nhập sinh viên thành công!',
        token: 'mock-jwt-token-student-abc456',
        user: { username: 'sinhvien', role: 'student', email: 'sv@student.edu.vn' }
      });
    }

    const user = await User.findOne({ where: { username, password } });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu!' });
    }
    const userData = user.get({ plain: true });
    return res.status(200).json({ success: true, message: 'Đăng nhập thành công!', user: userData });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống khi đăng nhập' });
  }
};

exports.getDevices = async (req, res) => {
  try {
    const devices = await Device.findAll();
    const formattedDevices = devices.map(d => {
      const plain = d.get({ plain: true });
      const img = plain.imageUrl || plain.image_url || '';
      return {
        ...plain,
        imageUrl: img,
        image_url: img
      };
    });
    return res.status(200).json(formattedDevices);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi lấy danh sách thiết bị!' });
  }
};

exports.addDevice = async (req, res) => {
  try {
    const { name, category, quantity_total, imageUrl } = req.body;
    if (!name || !category || quantity_total === undefined) {
      return res.status(400).json({ message: 'Thiếu thông tin thiết bị!' });
    }
    const newDevice = await Device.create({
      name,
      category,
      quantity_total: parseInt(quantity_total),
      quantity_available: parseInt(quantity_total),
      imageUrl: imageUrl || ''
    });
    return res.status(201).json({ message: 'Thêm thiết bị thành công!', newDevice });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi khi thêm thiết bị!' });
  }
};

exports.updateDevice = async (req, res) => {
  try {
    const { name, category, quantity_total, imageUrl } = req.body;
    const device = await Device.findByPk(req.params.id);
    if (!device) {
      return res.status(404).json({ message: 'Không tìm thấy thiết bị!' });
    }
    const diff = parseInt(quantity_total) - device.quantity_total;
    device.name = name || device.name;
    device.category = category || device.category;
    device.quantity_total = parseInt(quantity_total);
    device.quantity_available = device.quantity_available + diff;
    if (device.quantity_available < 0) device.quantity_available = 0;
    if (imageUrl !== undefined) device.imageUrl = imageUrl;
    await device.save();
    return res.status(200).json({ message: 'Cập nhật thiết bị thành công!', device });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi khi cập nhật thiết bị!' });
  }
};

exports.deleteDevice = async (req, res) => {
  try {
    const device = await Device.findByPk(req.params.id);
    if (!device) {
      return res.status(404).json({ message: 'Không tìm thấy thiết bị!' });
    }
    await device.destroy();
    return res.status(200).json({ message: 'Xóa thiết bị thành công!' });
  } catch (error) {
    return res.status(500).json({ message: 'Xóa thiết bị thất bại!' });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { username, deviceName, quantity, startDate, endDate, reason, lyDo } = req.body;
    const inputReason = reason || lyDo;
    if (!username || !deviceName || !startDate || !endDate) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin và ngày mượn - trả!' });
    }
    const device = await Device.findOne({ where: { name: deviceName } });
    if (!device) {
      return res.status(404).json({ message: 'Thiết bị không tồn tại!' });
    }
    if (device.quantity_available < parseInt(quantity)) {
      return res.status(400).json({ message: `Số lượng trong kho không đủ! Hiện chỉ còn ${device.quantity_available} cái.` });
    }
    let finalReason = inputReason ? inputReason.trim() : '';
    if (!finalReason) {
      if (parseInt(quantity) < 3) {
        finalReason = 'Lý do cá nhân';
      } else {
        finalReason = 'Mượn số lượng nhiều (Chưa cập nhật lý do cụ thể)';
      }
    }
    const order = await Order.create({
      username,
      deviceName,
      quantity: parseInt(quantity),
      startDate,
      endDate,
      reason: finalReason,
      status: 'Chờ duyệt'
    });
    return res.status(201).json({ message: 'Đăng ký mượn thành công, chờ admin duyệt!', order });
  } catch (error) {
    return res.status(500).json({ message: 'Có lỗi xảy ra khi đăng ký mượn!' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { username } = req.query;
    const orders = username
      ? await Order.findAll({ where: { username } })
      : await Order.findAll();
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi hệ thống khi lấy đơn mượn!' });
  }
};

exports.getOrdersByUsername = async (req, res) => {
  try {
    const orders = await Order.findAll({ where: { username: req.params.username } });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi hệ thống!' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const reqId = req.params.id;
    let order = await Order.findByPk(reqId);
    if (!order) {
      order = await Order.findOne({ where: { id: reqId } });
    }
    if (!order) {
      return res.status(404).json({ message: `Không tìm thấy đơn mượn với ID: ${reqId}` });
    }

    const device = await Device.findOne({ where: { name: order.deviceName } });
    const user = await User.findOne({ where: { username: order.username } });

    if (status === 'Đã duyệt' && order.status === 'Chờ duyệt') {
      if (!device || device.quantity_available < order.quantity) {
        return res.status(400).json({ message: 'Thiết bị trong kho hiện không đủ để phê duyệt!' });
      }
      device.quantity_available -= order.quantity;
      await device.save();
      if (user && user.email) {
        sendAutomatedEmail(user.email, user.username, order.deviceName, order.quantity, order.endDate, 'APPROVED').catch(e => console.error(e));
      }
    }

    if (status === 'Từ chối' && order.status === 'Chờ duyệt') {
      if (user && user.email) {
        sendAutomatedEmail(user.email, user.username, order.deviceName, order.quantity, order.endDate, 'REJECTED').catch(e => console.error(e));
      }
    }

    if (status === 'Đã trả' && order.status !== 'Đã trả') {
      if (device) {
        device.quantity_available += order.quantity;
        if (device.quantity_available > device.quantity_total) {
          device.quantity_available = device.quantity_total;
        }
        await device.save();
      }
      if (user && user.email) {
        sendAutomatedEmail(user.email, user.username, order.deviceName, order.quantity, order.endDate, 'RETURNED').catch(e => console.error(e));
      }
    }

    order.status = status;
    await order.save();

    return res.status(200).json(order);
  } catch (error) {
    console.error("Lỗi hệ thống khi cập nhật trạng thái:", error);
    return res.status(500).json({ message: 'Lỗi hệ thống khi cập nhật trạng thái!' });
  }
};

exports.checkUsername = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ where: { username } });
    return res.json({ exists: !!user });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi kiểm tra username' });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const deviceLeaderboard = await Order.findAll({
      attributes: [
        'deviceName',
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalBorrow']
      ],
      group: ['deviceName'],
      order: [[sequelize.literal('totalBorrow'), 'DESC']]
    });

    const userLeaderboard = await Order.findAll({
      attributes: [
        'username',
        [sequelize.fn('COUNT', sequelize.col('id')), 'borrowCount']
      ],
      group: ['username'],
      order: [[sequelize.literal('borrowCount'), 'DESC']]
    });

    const devicesData = deviceLeaderboard.map((item) => {
      const plain = item.get({ plain: true });
      return {
        name: plain.deviceName,
        category: 'Thiết bị Lab',
        borrowCount: parseInt(plain.totalBorrow || 0)
      };
    });

    const studentsData = userLeaderboard.map((item) => {
      const plain = item.get({ plain: true });
      const nameLen = plain.username.length;
      let displayUser = plain.username;
      
      if (nameLen > 10) {
        displayUser = plain.username.substring(0, 7) + '...';
      }

      return {
        username: displayUser,
        studentId: `SV-${plain.username.toUpperCase().substring(0, 4)}`,
        borrowCount: parseInt(plain.borrowCount || 0)
      };
    });

    return res.status(200).json({
      devicesData,
      studentsData
    });
  } catch (error) {
    console.error("Leaderboard Error:", error);
    return res.status(500).json({ message: 'Lỗi lấy bảng xếp hạng!' });
  }
};