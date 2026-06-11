# BÁO CÁO BÀI TẬP LỚN CUỐI KỲ MÔN LẬP TRÌNH WEB

Dự án: Hệ thống quản lý kho thiết bị phòng lab (Academy Gear)
Lớp học phần: RIPT1307-03-2026

## Thông tin sinh viên thực hiện
- Sinh viên thực hiện: Đinh Quang Huy
- Mã sinh viên: B24DCCC144
- Vai trò: Độc lập phát triển toàn bộ dự án (Fullstack Developer)

---

## Kiến trúc công nghệ

1. Frontend
- Thư viện chính: React, TypeScript, Vite
- Quản lý giao diện: Inline Styles (CSS-in-JS)
- Thông báo: React Hot Toast

2. Backend
- Nền tảng: Node.js, Express framework
- Cơ sở dữ liệu: SQLite, Sequelize ORM

---

## Sơ đồ cấu trúc thư mục

Dự án tổ chức theo mô hình Monorepo với cấu trúc tệp tin chi tiết như sau:

RIPT1307-03-2026-NHOM-DINH-QUANG-HUY-KTHP/
├── .gitignore             # Chặn các tệp tin hệ thống và thư mục node_modules
├── README.md              # File báo cáo thông tin và hướng dẫn chạy dự án
│
├── backend/               # PHÂN HỆ BACKEND SERVER
│   ├── controllers/
│   │   └── appController.js # Xử lý logic nghiệp vụ kho và mượn thiết bị
│   ├── models/
│   │   └── index.js       # Khởi tạo mô hình bảng và quan hệ dữ liệu qua Sequelize
│   ├── routes/
│   │   ├── appRoutes.js   # API chức năng cốt lõi của hệ thống
│   │   └── emailRoutes.js # API liên quan đến tác vụ gửi email thông báo
│   ├── services/
│   │   └── emailService.js# Logic cấu hình và xử lý gửi email tự động
│   ├── database.js        # Cấu hình kết nối SQLite qua Sequelize
│   ├── database.sqlite    # File lưu trữ dữ liệu local SQLite
│   ├── package-lock.json
│   ├── package.json       # Khai báo các thư viện backend sử dụng
│   └── server.js          # File khởi chạy ứng dụng backend server chính
│
└── frontend/              # PHÂN HỆ FRONTEND CLIENT
    ├── public/            # Chứa tài nguyên tĩnh và file đồ họa SVG
    ├── package-lock.json
    ├── package.json       # Khai báo các thư viện frontend sử dụng
    └── src/               # Thư mục mã nguồn chính của Frontend
        ├── assets/        # Lưu trữ hình ảnh và logo giao diện
        ├── components/    # Thành phần giao diện độc lập, tái sử dụng
        │   ├── BorrowForm.tsx      # Biểu mẫu đăng ký đơn mượn thiết bị
        │   ├── DeviceList.tsx      # Danh sách thiết bị, bộ lọc và phân trang
        │   ├── HistoryModal.tsx    # Cửa sổ hiển thị lịch sử đơn mượn đồ
        │   ├── Leaderboard.tsx     # Bảng xếp hạng hoạt động mượn đồ phòng lab
        │   ├── LeaderboardData.ts  # Dữ liệu tĩnh phục vụ kiểm thử xếp hạng
        │   └── Sidebar.tsx         # Thanh điều hướng trái điều phối theo phân quyền
        ├── pages/         # Giao diện tổng thể tập trung logic ứng dụng
        │   ├── Login.tsx        # Giao diện đăng nhập và đăng ký tài khoản
        │   ├── Dashboard.tsx    # Không gian làm việc chính điều phối tài nguyên
        │   └── UserInfo.tsx     # Trang quản lý thông tin hồ sơ cá nhân sinh viên
        ├── App.css        # CSS tùy biến toàn cục cho giao diện
        ├── App.tsx        # Thành phần gốc điều hướng trạng thái hiển thị view
        ├── index.css      # File cấu hình phông chữ hệ thống và reset CSS
        ├── main.tsx       # Khởi chạy React DOM kết nối ứng dụng lên trình duyệt
        └── types.ts       # Định nghĩa tập trung các kiểu dữ liệu TypeScript

---

## Hướng dẫn khởi chạy ứng dụng tại môi trường local

1. Cài đặt các gói thư viện phụ thuộc
Mở terminal tại thư mục gốc của dự án và chạy các lệnh:

Cài đặt cho Backend:
cd backend
npm install

Cài đặt cho Frontend:
cd ../frontend
npm install

2. Vận hành hệ thống
Yêu cầu khởi chạy song song 2 cửa sổ terminal độc lập:

Khởi chạy Backend Server (Terminal 1):
cd backend
node server.js
Địa chỉ hoạt động: http://localhost:5000

Khởi chạy Frontend Client (Terminal 2):
cd frontend
npm run dev
Địa chỉ hoạt động: http://localhost:5173

---

## Tài khoản thử nghiệm hệ thống

Hệ thống tự động phân quyền Sidebar và tính năng dựa theo tài khoản đăng nhập:

1. Quyền Sinh viên:
- Tên đăng nhập: sinhvien
- Mật khẩu: 123456

2. Quyền Quản trị viên (Admin):
- Tên đăng nhập: admin
- Mật khẩu: 123456
Lưu ý: vì chỉ là tài khoản test nên không theo logic của 1 tài khoản thường cần có 8 kí tự trở lên, 1 kí tự đặc biệt và 1 kí tự viết hoa