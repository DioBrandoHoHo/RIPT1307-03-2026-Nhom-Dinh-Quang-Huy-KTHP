export interface DeviceLeaderboardItem {
  name: string;
  category: string;
  borrowCount: number;
}

export interface StudentLeaderboardItem {
  username: string;
  studentId: string;
  borrowCount: number;
}

export const staticDevices: DeviceLeaderboardItem[] = [
  { name: "Giáo trình Cơ sở Dữ liệu", category: "Sách & Giáo trình", borrowCount: 37 },
  { name: "Máy tính Casio fx-580VN X", category: "Máy tính cầm tay", borrowCount: 22 },
  { name: "Bộ sạc nhanh Anker 65W", category: "Phụ kiện kết nối", borrowCount: 19 },
  { name: "Arduino Uno R3 Chuẩn", category: "Linh kiện điện tử", borrowCount: 2 },
  { name: "Chuột Logitech G Pro X Superlight", category: "Phụ kiện máy tính", borrowCount: 2 },
  { name: "Bàn phím cơ Neo65 Sonic HE+", category: "Phụ kiện máy tính", borrowCount: 1 },
  { name: "Máy tính Dell XPS 13", category: "Máy tính xách tay", borrowCount: 1 },
  { name: "Sách Phân tích dữ liệu với Python", category: "Sách & Giáo trình", borrowCount: 1 },
  { name: "Bàn phím IQUNIX EV63", category: "Phụ kiện máy tính", borrowCount: 1 },
  { name: "Router Cisco ISR 4331", category: "Thiết bị mạng", borrowCount: 1 },
  { name: "Mạch Raspberry Pi 4 Model B", category: "Linh kiện điện tử", borrowCount: 1 },
  { name: "Cáp chuyển HDMI sang Type-C", category: "Phụ kiện kết nối", borrowCount: 1 }
];

export const staticStudents: StudentLeaderboardItem[] = [
  { username: "sinhvien", studentId: "SV-00002", borrowCount: 10 },
  { username: "toilahuy123", studentId: "SV-00001", borrowCount: 3 },
  { username: "quochuy", studentId: "SV-00011", borrowCount: 2 },
  { username: "quanghai", studentId: "SV-00004", borrowCount: 1 },
  { username: "minhhoang", studentId: "SV-00005", borrowCount: 1 },
  { username: "hoangyen", studentId: "SV-00006", borrowCount: 1 },
  { username: "vantuan", studentId: "SV-00007", borrowCount: 1 },
  { username: "ducnam", studentId: "SV-00008", borrowCount: 1 },
  { username: "hoanglong", studentId: "SV-00009", borrowCount: 1 },
  { username: "thimai", studentId: "SV-00010", borrowCount: 1 },
  { username: "ducthang", studentId: "SV-00012", borrowCount: 1 }
];