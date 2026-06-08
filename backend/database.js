const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS devices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT,
        quantity_total INTEGER NOT NULL,
        quantity_available INTEGER NOT NULL,
        borrow_count INTEGER DEFAULT 0,
        image_url TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        borrow_count INTEGER DEFAULT 0
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        deviceName TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        startDate TEXT,
        endDate TEXT,
        status TEXT NOT NULL
      )
    `);

    db.get("SELECT COUNT(*) AS count FROM devices", [], (err, row) => {
      if (row && row.count === 0) {
        const stmt = db.prepare(`
          INSERT INTO devices (name, category, quantity_total, quantity_available, borrow_count, image_url) 
          VALUES (?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run("Giáo trình Cơ sở Dữ liệu", "Sách & Giáo trình", 150, 150, 142, "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400");
        stmt.run("Máy tính Casio fx-580VN X", "Máy tính cầm tay", 100, 100, 98, "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400");
        stmt.run("Bộ sạc nhanh Anker 65W", "Phụ kiện kết nối", 90, 90, 85, "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400");
        stmt.run("Arduino Uno R3 Chuẩn", "Linh kiện điện tử", 70, 70, 64, "https://images.unsplash.com/photo-1608564697171-2dd6d1e1c71d?w=400");
        stmt.run("Cáp chuyển HDMI sang Type-C", "Phụ kiện kết nối", 60, 60, 52, "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400");
        stmt.run("Sách Học SQL Cơ Bản", "Sách & Giáo trình", 50, 50, 41, "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400");
        stmt.run("Router Cisco ISR 4331", "Thiết bị mạng", 40, 40, 33, "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400");
        stmt.run("Chuột Logitech G102 Gen2", "Phụ kiện máy tính", 35, 35, 29, "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400");
        stmt.run("Máy tính Dell XPS 13", "Máy tính xách tay", 10, 10, 15, "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400");
        stmt.run("Chuột Logitech G Pro X", "Phụ kiện máy tính", 15, 15, 24, "https://images.unsplash.com/photo-1625842268584-8f329046497c?w=400");
        stmt.run("Bàn phím cơ Neo65 Sonic HE", "Phụ kiện máy tính", 5, 5, 38, "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400");
        
        stmt.finalize();
      }
    });

    db.get("SELECT COUNT(*) AS count FROM users", [], (err, row) => {
      if (row && row.count === 0) {
        const stmt = db.prepare(`
          INSERT INTO users (username, role, email, phone, borrow_count) 
          VALUES (?, ?, ?, ?, ?)
        `);
        
        stmt.run("sinhvien", "sinh_vien", "sv@student.edu.vn", "0912345678", 5);
        stmt.run("admin", "admin", "admin@academy.edu.vn", "0988888888", 0);
        stmt.run("Nguyễn Đình Quang H*", "sinh_vien", "quanghuy@student.edu.vn", "0921111111", 24);
        stmt.run("Trần Minh H*", "sinh_vien", "minhhoang@student.edu.vn", "0922222222", 19);
        stmt.run("Lê Hoàng Y*", "sinh_vien", "hoangyen@student.edu.vn", "0923333333", 17);
        stmt.run("Phạm Thành N*", "sinh_vien", "thanhnam@student.edu.vn", "0924444444", 14);
        stmt.run("Đỗ Thúy Q*", "sinh_vien", "thuyquynh@student.edu.vn", "0925555555", 11);
        stmt.run("Vũ Quốc Anh T*", "sinh_vien", "anhtu@student.edu.vn", "0926666666", 9);
        stmt.run("Bùi Thị Hồng V*", "sinh_vien", "hongvan@student.edu.vn", "0927777777", 8);
        stmt.run("Ngô Văn Đ*", "sinh_vien", "vando@student.edu.vn", "0928888888", 6);
        stmt.run("Hoàng Trung K*", "sinh_vien", "trungkien@student.edu.vn", "0929999999", 4);
        
        stmt.finalize();
      }
    });

    db.get("SELECT COUNT(*) AS count FROM orders", [], (err, row) => {
      if (row && row.count === 0) {
        const stmt = db.prepare(`
          INSERT INTO orders (username, deviceName, quantity, startDate, endDate, status) 
          VALUES (?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run("sinhvien", "Bàn phím cơ Neo65 Sonic HE", 1, "2026-06-01", "2026-06-05", "Đã trả");
        stmt.run("sinhvien", "Chuột Logitech G Pro X", 1, "2026-06-06", "2026-06-09", "Đã duyệt");
        stmt.run("sinhvien", "Giáo trình Cơ sở Dữ liệu", 2, "2026-06-07", "2026-06-14", "Chờ duyệt");
        stmt.run("sinhvien", "Router Cisco ISR 4331", 1, "2026-05-10", "2026-05-12", "Từ chối");
        
        stmt.finalize();
      }
    });
  });
}

module.exports = db;