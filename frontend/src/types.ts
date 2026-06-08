export interface User {
  id?: number;
  username: string;
  role: 'sinh_vien' | 'admin';
  email: string;
  phone: string;
}

export interface Device {
  id: number;
  name: string;
  category: string;
  quantity_total: number;
  quantity_available: number;
  image_url?: string;
}

export interface Order {
  id: number;
  username: string;
  deviceName: string;
  quantity: number;
  status: 'Chờ duyệt' | 'Đã duyệt' | 'Từ chối' | 'Đã trả';
}