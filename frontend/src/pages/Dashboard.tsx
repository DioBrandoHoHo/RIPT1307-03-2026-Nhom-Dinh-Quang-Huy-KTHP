import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from 'axios';
import { type User, type Device, type Order } from '../types'; 
import { toast } from 'react-hot-toast'; 

import Sidebar from '../components/Sidebar';
import BorrowForm from '../components/BorrowForm';
import HistoryModal from '../components/HistoryModal';
import Leaderboard from '../components/Leaderboard'; 
import UserInfo from './UserInfo';

const API_URL = 'https://ript-1307-03-2026-nhom-dinh-git-209829-diobrandohohos-projects.vercel.app/apiapi';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onUpdateUser?: (updatedUser: User) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user: initialUser, onLogout, onUpdateUser }) => {
  const [currentUser, setCurrentUser] = useState<User>(initialUser);
  
  const [activeTab, setActiveTab] = useState<'kho' | 'duyet_don' | 'muon' | 'leaderboard' | 'user_info'>(() => {
    const savedTab = localStorage.getItem('dashboard_active_tab');
    return (savedTab as any) || 'kho';
  });
  
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);

  const [devices, setDevices] = useState<Device[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [borrowQty, setBorrowQty] = useState<number>(1);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [reason, setReason] = useState<string>(''); 

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;

  const [inputName, setInputName] = useState<string>('');
  const [inputCategory, setInputCategory] = useState<string>('');
  const [inputQuantityTotal, setInputQuantityTotal] = useState<number>(0);
  const [inputImageUrl, setInputImageUrl] = useState<string>('');
  const [editingDeviceId, setEditingDeviceId] = useState<number | null>(null);

  const [deviceToDelete, setDeviceToDelete] = useState<number | null>(null);

  const [hoveredSlice, setHoveredSlice] = useState<{ category: string; count: number } | null>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tab: 'kho' | 'duyet_don' | 'muon' | 'leaderboard' | 'user_info') => {
    setActiveTab(tab);
    localStorage.setItem('dashboard_active_tab', tab);
  };

  useEffect(() => {
    fetchDevices();
    fetchOrders();
  }, [currentUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchDevices = async (): Promise<void> => {
    try {
      const res = await axiosInstance.get<Device[]>(`${API_URL}/devices`);
      setDevices(res.data);
      if (res.data.length > 0 && !selectedDevice) {
        setSelectedDevice(res.data[0].name);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async (): Promise<void> => {
    try {
      const url = currentUser.role === 'admin' 
        ? `${API_URL}/orders` 
        : `${API_URL}/orders?username=${currentUser.username}`;
      const res = await axiosInstance.get<Order[]>(url);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const isNotExpired = (endDateStr: string) => {
    if (!endDateStr) return true;
    const end = new Date(endDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return end >= today;
  };

  const handleBorrowSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!startDate || !endDate) {
      toast.error('Vui lòng chọn đầy đủ cả Ngày mượn và Ngày dự kiến trả!');
      return;
    }
    
    const textReason = reason.trim() || 'Nhu cầu cá nhân';

    try {
      await axiosInstance.post(`${API_URL}/orders`, { 
        username: currentUser.username, 
        deviceName: selectedDevice,
        quantity: borrowQty,
        startDate,
        endDate,
        reason: textReason,
        lyDo: textReason 
      });
      
      toast.success(`Gửi yêu cầu mượn [${selectedDevice}] thành công!`);
      setBorrowQty(1);
      setStartDate('');
      setEndDate('');
      setReason(''); 
      
      setTimeout(() => {
        fetchDevices();
        fetchOrders();
      }, 300);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gửi yêu cầu mượn thất bại!');
    }
  };

  const handleSelectDeviceFromKho = (deviceName: string) => {
    setSelectedDevice(deviceName);
    handleTabChange('muon');
  };

  const handleUpdateStatus = async (orderObj: any, status: 'Đã duyệt' | 'Từ chối' | 'Chờ trả' | 'Đã trả') => {
    const targetId = orderObj.id || orderObj._id;
    if (!targetId) {
      toast.error('Không tìm thấy ID đơn mượn!');
      return;
    }
    try {
      await axiosInstance.put(`${API_URL}/orders/${targetId}`, { status });
      toast.success(`Cập nhật trạng thái thành công: ${status}`);
      
      await Promise.all([
        fetchDevices(),
        fetchOrders()
      ]);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Thao tác thất bại!');
    }
  };

  const handleAddOrUpdateDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName || !inputCategory.trim() || inputQuantityTotal <= 0) {
      toast.error('Vui lòng điền đầy đủ thông tin hợp lệ!');
      return;
    }

    try {
      if (editingDeviceId) {
        await axiosInstance.put(`${API_URL}/devices/${editingDeviceId}`, {
          name: inputName,
          category: inputCategory.trim(),
          quantity_total: inputQuantityTotal,
          imageUrl: inputImageUrl
        });
        toast.success('Cập nhật thiết bị thành công!');
      } else {
        await axiosInstance.post(`${API_URL}/devices`, {
          name: inputName,
          category: inputCategory.trim(),
          quantity_total: inputQuantityTotal,
          imageUrl: inputImageUrl
        });
        toast.success('Thêm thiết bị mới thành công!');
      }

      setInputName('');
      setInputCategory('');
      setInputQuantityTotal(0);
      setInputImageUrl('');
      setEditingDeviceId(null);
      fetchDevices();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Thao tác kho hàng thất bại!');
    }
  };

  const handleEditClick = (device: Device) => {
    setEditingDeviceId(device.id);
    setInputName(device.name);
    setInputCategory(device.category);
    setInputQuantityTotal(device.quantity_total);
    setInputImageUrl(device.imageUrl || '');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerDeleteConfirm = (id: number) => {
    setDeviceToDelete(id);
  };

  const executeDeleteDevice = async () => {
    if (!deviceToDelete) return;
    try {
      await axiosInstance.delete(`${API_URL}/devices/${deviceToDelete}`);
      toast.success('Xóa thiết bị thành công!');
      setDeviceToDelete(null);
      fetchDevices();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Xóa thiết bị thất bại!');
      setDeviceToDelete(null);
    }
  };

  const handleUpdateUserInternal = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    }
  };

  const isAdmin = currentUser.role === 'admin';

  const uniqueCategories = Array.from(
    new Set(devices.map(d => d.category || 'Chưa phân loại'))
  ).filter(Boolean);

  const filteredDropdownCategories = uniqueCategories.filter(cat =>
    cat.toLowerCase().includes(inputCategory.toLowerCase())
  );

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase());
    const deviceCat = device.category || 'Chưa phân loại';
    const matchesCategory = selectedCategory === '' || deviceCat === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredDevices.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDevices = filteredDevices.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const totalDeviceTypes = devices.length;
  
  const totalQuantityInKho = devices.reduce((acc, curr) => acc + (curr.quantity_available ?? 0), 0);

  const totalPendingDuyet = orders.filter(o => o.status === 'Chờ duyệt').length;
  
  const totalBorrowing = orders
    .filter(o => o.status === 'Đã duyệt')
    .reduce((acc, curr) => acc + (curr.quantity || 0), 0);
    
  const totalWaitingReturn = orders.filter(o => o.status === 'Chờ trả').length;
  
  const totalOverdue = orders.filter(o => {
    if (o.status !== 'Đã duyệt') return false;
    if (!o.endDate) return false;
    const today = new Date();
    today.setHours(0,0,0,0);
    const end = new Date(o.endDate);
    return end < today;
  }).length;

  const categoryMap: { [key: string]: number } = {};
  devices.forEach(d => {
    const cat = d.category || 'Khác';
    categoryMap[cat] = (categoryMap[cat] || 0) + (d.quantity_available ?? 0);
  });

  const chartData = Object.keys(categoryMap).map(key => ({
    category: key,
    count: categoryMap[key]
  }));

  const colors = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6'];

  let accumulatedAngle = 0;

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: '#f8fafc', fontFamily: '"Segoe UI", sans-serif', color: '#1e293b', margin: 0, padding: 0, boxSizing: 'border-box', overflowX: 'hidden' }}>
      
      <style>{`
        html, body, #root {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          min-height: 100vh !important;
          overflow-x: hidden !important;
          background-color: #f8fafc !important;
          box-sizing: border-box !important;
        }

        *, *:before, *:after {
          box-sizing: inherit !important;
        }

        .borrow-table { width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 15px; }
        .borrow-table th, .borrow-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: left; }
        .borrow-table th { background: #f1f5f9; color: #475569; font-weight: 600; }
        
        .form-input { width: 100%; padding: 11px 14px; border: 1px solid #cbd5e1; border-radius: 12px; outline: none; transition: all 0.2s; font-size: 14px; background: #ffffff !important; color: #0f172a !important; }
        .form-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12); }
        
        .device-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; width: 100%; }
        @media (max-width: 1024px) {
          .device-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .device-grid { grid-template-columns: 1fr; }
        }

        .square-card { background: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; padding: 22px; display: flex; flex-direction: column; justify-content: space-between; aspect-ratio: 1 / 1; position: relative; overflow: hidden; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.02), 0 2px 4px -1px rgba(15, 23, 42, 0.01); }
        .square-card:hover { transform: translateY(-6px); box-shadow: 0 12px 20px -3px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.03); border-color: #cbd5e1; }
        
        .pagination-btn { padding: 8px 16px; border: 1px solid #e2e8f0; background: #fff; color: #475569; border-radius: 12px; cursor: pointer; font-weight: 600; transition: all 0.2s; }
        .pagination-btn:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; }
        .pagination-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .pagination-active { background: #3b82f6; color: #fff; border-color: #3b82f6; }

        .stat-box { background: #ffffff; padding: 18px 12px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); display: flex; flex-direction: column; gap: 6px; text-align: center; justify-content: center; transition: all 0.2s; }
        .stat-box:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.04); }
        
        .pie-slice { transition: all 0.2s ease; cursor: pointer; }
        .pie-slice:hover { opacity: 0.85; stroke-width: 2px; stroke: #fff; }

        .btn-muon-action { width: 100%; color: #fff; border: none; padding: 11px 0; border-radius: 12px; font-weight: 700; fontSize: 13px; transition: all 0.2s ease; }
        .btn-muon-action:hover:not(:disabled) { transform: scale(1.02); background: #1d4ed8 !important; box-shadow: 0 8px 16px -4px rgba(30, 58, 138, 0.3); }

        .admin-edit-btn { flex: 1; background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; padding: 9px 0; border-radius: 10px; cursor: pointer; font-weight: 700; fontSize: 12px; transition: all 0.2s ease; text-align: center; }
        .admin-edit-btn:hover { background: #e2e8f0; color: #0f172a; border-color: #cbd5e1; }

        .admin-delete-btn { flex: 1; background: #ffffff; color: #ef4444; border: 1px solid #fee2e2; padding: 9px 0; border-radius: 10px; cursor: pointer; font-weight: 700; fontSize: 12px; transition: all 0.2s ease; text-align: center; }
        .admin-delete-btn:hover { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }

        .custom-combobox-item { padding: 10px 14px; cursor: pointer; font-size: 13px; color: #334155; transition: background 0.15s ease; }
        .custom-combobox-item:hover { background: #f1f5f9; color: #0f172a; }
        
        .custom-combobox-menu::-webkit-scrollbar { width: 6px; }
        .custom-combobox-menu::-webkit-scrollbar-track { background: transparent; }
        .custom-combobox-menu::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
        .custom-combobox-menu::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0f172a', flexShrink: 0 }}>
        <div style={{ flex: 1 }}>
          <Sidebar 
            user={currentUser} 
            activeTab={activeTab} 
            setActiveTab={(tab) => handleTabChange(tab as any)} 
            ordersCount={orders.length} 
            setShowHistoryModal={setShowHistoryModal} 
            onLogout={onLogout} 
          />
        </div>
      </div>

      <div style={{ flex: 1, padding: '40px', overflowY: 'auto', maxHeight: '100vh', width: '100%', boxSizing: 'border-box' }}>
        
        {activeTab === 'kho' && (
          <div style={{ maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
            {isAdmin && (
              <div style={{ background: '#ffffff', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.1)', border: '2px solid #3b82f6', marginBottom: '35px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1e3a8a', margin: 0 }}>
                    {editingDeviceId ? 'CẬP NHẬT THÔNG TIN THIẾT BỊ' : 'NHẬP THÊM THIẾT BỊ'}
                  </h2>
                  <span style={{ fontSize: '12px', background: '#dbeafe', color: '#1e40af', padding: '4px 12px', borderRadius: '9999px', fontWeight: 700 }}>
                    {editingDeviceId ? 'Chế độ chỉnh sửa' : 'Chế độ thêm mới'}
                  </span>
                </div>
                
                <form onSubmit={handleAddOrUpdateDevice} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>Tên thiết bị</label>
                    <input type="text" className="form-input" value={inputName} onChange={e => setInputName(e.target.value)} placeholder="Nhập tên thiết bị..." style={{ border: '1px solid #94a3b8' }} />
                  </div>
                  
                  <div ref={dropdownRef} style={{ position: 'relative' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>Danh mục (Chọn hoặc Nhập mới)</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={inputCategory} 
                        onChange={e => {
                          setInputCategory(e.target.value);
                          setIsDropdownOpen(true);
                        }} 
                        onFocus={() => setIsDropdownOpen(true)}
                        placeholder="Chọn danh mục có sẵn hoặc tự gõ mới..." 
                        style={{ border: '1px solid #94a3b8', paddingRight: '35px' }} 
                      />
                      <div 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        style={{ position: 'absolute', right: '14px', top: '50%', transform: `translateY(-50%) rotate(${isDropdownOpen ? '180deg' : '0deg'})`, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid #64748b', cursor: 'pointer', transition: 'transform 0.2s ease', padding: '2px' }}
                      />
                    </div>
                    
                    {isDropdownOpen && (
                      <div className="custom-combobox-menu" style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.05)', zIndex: 1000, maxHeight: '215px', overflowY: 'auto', padding: '6px 0' }}>
                        {filteredDropdownCategories.length > 0 ? (
                          filteredDropdownCategories.map((cat, idx) => (
                            <div 
                              key={idx} 
                              className="custom-combobox-item"
                              onClick={() => {
                                setInputCategory(cat);
                                setIsDropdownOpen(false);
                              }}
                            >
                              {cat}
                            </div>
                          ))
                        ) : (
                          <div style={{ padding: '10px 14px', fontSize: '12px', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center' }}>
                            Bấm Enter hoặc gõ tiếp để tạo nhóm mới: "{inputCategory}"
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>Tổng số lượng phân bổ</label>
                    <input type="number" className="form-input" value={inputQuantityTotal || ''} onChange={e => setInputQuantityTotal(Number(e.target.value))} placeholder="Nhập số lượng tổng..." style={{ border: '1px solid #94a3b8' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>Đường dẫn ảnh sản phẩm</label>
                    <input type="text" className="form-input" value={inputImageUrl} onChange={e => setInputImageUrl(e.target.value)} placeholder="Nhập URL hình ảnh..." style={{ border: '1px solid #94a3b8' }} />
                  </div>
                  
                  <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', marginTop: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                    <button type="submit" style={{ background: '#1e3a8a', color: '#ffffff', border: 'none', padding: '12px 28px', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '14px' }}>
                      {editingDeviceId ? 'Cập nhật thiết bị' : 'Nhập thêm thiết bị'}
                    </button>
                    {editingDeviceId && (
                      <button type="button" onClick={() => { setEditingDeviceId(null); setInputName(''); setInputCategory(''); setInputQuantityTotal(0); setInputImageUrl(''); }} style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                        Hủy chỉnh sửa
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Danh Sách Thiết Bị Kho Hàng
                  </h3>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Tổng số: {filteredDevices.length} sản phẩm</span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '180px' }}>
                    <select 
                      className="form-input" 
                      value={selectedCategory} 
                      onChange={e => setSelectedCategory(e.target.value)}
                      style={{ padding: '9px 14px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '12px', height: '100%', cursor: 'pointer' }}
                    >
                      <option value="">Tất cả loại thiết bị</option>
                      {uniqueCategories.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ width: '240px' }}>
                    <input type="text" className="form-input" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Tìm kiếm theo tên thiết bị..." style={{ padding: '9px 14px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '12px' }} />
                  </div>
                </div>
              </div>

              {currentDevices.length === 0 ? (
                <div style={{ background: '#fff', padding: '40px', borderRadius: '24px', textAlign: 'center', border: '1px solid #e2e8f0', color: '#64748b' }}>
                  Không tìm thấy thiết bị nào trong kho.
                </div>
              ) : (
                <>
                  <div className="device-grid">
                    {currentDevices.map((device) => {
                      const isLowStock = (device.quantity_available ?? 0) === 0 || ((device.quantity_available ?? 0) / (device.quantity_total || 1)) < 0.2;
                      return (
                        <div key={device.id} className="square-card">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '55%', gap: '12px' }}>
                            <div style={{ width: '55%', height: '100%', background: '#f8fafc', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '8px', border: '1px solid #f1f5f9' }}>
                              {device.imageUrl ? (
                                <img src={device.imageUrl} alt={device.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '6px' }} />
                              ) : (
                                <div style={{ width: '100%', height: '100%', background: '#cbd5e1', borderRadius: '8px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', color:'#475569', fontWeight: 600 }}>No Image</div>
                              )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '45%', textAlign: 'right', background: '#f8fafc', padding: '10px 12px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                              <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: '2px' }}>Sẵn có</div>
                              <div style={{ fontSize: '16px', fontWeight: 800, color: isLowStock ? '#ef4444' : '#10b981' }}>
                                {device.quantity_available ?? 0}
                              </div>
                              <div style={{ width: '100%', height: '1px', background: '#e2e8f0', margin: '4px 0' }}></div>
                              <div style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8' }}>Tổng: {device.quantity_total ?? 0}</div>
                            </div>
                          </div>

                          <div style={{ width: '100%', height: '25%', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '8px', gap: '3px' }}>
                            <span style={{ fontSize: '10px', fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              {device.category || 'Chưa phân loại'}
                            </span>
                            <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {device.name}
                            </h4>
                          </div>

                          <div style={{ width: '100%', height: '20%', display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center', marginTop: '6px' }}>
                            {isAdmin ? (
                              <>
                                <button onClick={() => handleEditClick(device)} className="admin-edit-btn">Sửa</button>
                                <button onClick={() => triggerDeleteConfirm(device.id)} className="admin-delete-btn">Xóa</button>
                              </>
                            ) : (
                              <button onClick={() => handleSelectDeviceFromKho(device.name)} disabled={(device.quantity_available ?? 0) <= 0} className="btn-muon-action" style={{ background: (device.quantity_available ?? 0) > 0 ? '#1e3a8a' : '#94a3b8', cursor: (device.quantity_available ?? 0) > 0 ? 'pointer' : 'not-allowed' }}>
                                {(device.quantity_available ?? 0) > 0 ? 'Mượn thiết bị này' : 'Hết hàng khả dụng'}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '35px' }}>
                      <button className="pagination-btn" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Trước</button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button key={page} className={`pagination-btn ${currentPage === page ? 'pagination-active' : ''}`} onClick={() => setCurrentPage(page)}>{page}</button>
                      ))}
                      <button className="pagination-btn" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Sau</button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'duyet_don' && isAdmin && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '35px', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
            
            <div style={{ background: '#ffffff', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #cbd5e1' }}>
              <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '12px', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Thống kê của kho hàng</h2>
                <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Tổng hợp toàn bộ chỉ số vận hành và biểu đồ phân bổ vật tư thiết bị hệ thống</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px', width: '100%', marginBottom: '35px' }}>
                <div className="stat-box" style={{ borderTop: '4px solid #3b82f6' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>LOẠI THIẾT BỊ</span>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: '#1e3a8a' }}>{totalDeviceTypes}</span>
                </div>
                <div className="stat-box" style={{ borderTop: '4px solid #10b981' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>TRONG KHO</span>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>{totalQuantityInKho}</span>
                </div>
                <div className="stat-box" style={{ borderTop: '4px solid #a855f7' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>CHỜ DUYỆT</span>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: '#a855f7' }}>{totalPendingDuyet}</span>
                </div>
                <div className="stat-box" style={{ borderTop: '4px solid #6366f1' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>ĐANG MƯỢN</span>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: '#6366f1' }}>{totalBorrowing}</span>
                </div>
                <div className="stat-box" style={{ borderTop: '4px solid #ef4444' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>QUÁ HẠN</span>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: '#ef4444' }}>{totalOverdue}</span>
                </div>
                <div className="stat-box" style={{ borderTop: '4px solid #f59e0b' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>CHỜ XÁC NHẬN TRẢ</span>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: '#f59e0b' }}>{totalWaitingReturn}</span>
                </div>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '24px', display: 'flex', gap: '40px', alignItems: 'center', justifyContent: 'center', minHeight: '260px' }}>
                <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                  {totalQuantityInKho === 0 ? (
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '13px' }}>Không có dữ liệu</div>
                  ) : (
                    <svg viewBox="0 0 42 42" width="100%" height="100%" style={{ transform: 'rotate(-90deg)', borderRadius: '50%' }}>
                      {chartData.map((item, index) => {
                        const percentage = (item.count / totalQuantityInKho) * 100;
                        const strokeDasharray = `${percentage} ${100 - percentage}`;
                        const strokeDashoffset = 100 - accumulatedAngle;
                        accumulatedAngle += percentage;
                        const color = colors[index % colors.length];

                        return (
                          <circle
                            key={index}
                            className="pie-slice"
                            cx="21"
                            cy="21"
                            r="15.91549430918954"
                            fill="transparent"
                            stroke={color}
                            strokeWidth="6"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            onMouseEnter={() => setHoveredSlice({ category: item.category, count: item.count })}
                            onMouseLeave={() => setHoveredSlice(null)}
                          />
                        );
                      })}
                    </svg>
                  )}

                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#ffffff', width: '110px', height: '110px', borderRadius: '50%', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px', textAlign: 'center' }}>
                    {hoveredSlice ? (
                      <>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', width: '100%' }}>
                          {hoveredSlice.category}
                        </span>
                        <span style={{ fontSize: '16px', fontWeight: 800, color: '#3b82f6', marginTop: '2px' }}>
                          {hoveredSlice.count} cái
                        </span>
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>TỔNG CỘNG</span>
                        <span style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{totalQuantityInKho}</span>
                      </>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', flex: 1, maxWidth: '500px' }}>
                  {chartData.map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }} onMouseEnter={() => setHoveredSlice({ category: item.category, count: item.count })} onMouseLeave={() => setHoveredSlice(null)}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: colors[index % colors.length], flexShrink: 0 }}></div>
                      <span style={{ fontWeight: 600, color: '#334155', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.category}:</span>
                      <span style={{ fontWeight: 800, color: '#0f172a' }}>{item.count} cái</span>
                      <span style={{ color: '#94a3b8', fontSize: '11px' }}>({((item.count / (totalQuantityInKho || 1)) * 100).toFixed(1)}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '25px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)', border: '2px solid #cbd5e1', marginTop: '35px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: '#0f172a' }}>Danh sách Đơn đăng ký chờ Duyệt Mượn</h3>
              {orders.filter(o => o.status === 'Chờ duyệt' && isNotExpired(o.endDate)).length === 0 ? (
                <p style={{ color: '#64748b', fontStyle: 'italic', fontSize: '14px' }}>Không có đơn chờ duyệt mượn hợp lệ nào.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', color: '#64748b', textAlign: 'left' }}>
                      <th style={{ padding: '12px' }}>Người mượn</th>
                      <th style={{ padding: '12px' }}>Thiết bị</th>
                      <th style={{ padding: '12px' }}>Số lượng</th>
                      <th style={{ padding: '12px' }}>Lý do</th>
                      <th style={{ padding: '12px' }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.filter(o => o.status === 'Chờ duyệt' && isNotExpired(o.endDate)).map((order) => (
                      <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px', fontWeight: 500 }}>{order.username}</td>
                        <td style={{ padding: '12px' }}>{order.deviceName}</td>
                        <td style={{ padding: '12px' }}>{order.quantity}</td>
                        <td style={{ padding: '12px', color: '#64748b' }}>{order.reason}</td>
                        <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleUpdateStatus(order, 'Đã duyệt')} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Duyệt</button>
                          <button onClick={() => handleUpdateStatus(order, 'Từ chối')} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Từ chối</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div style={{ background: '#ffffff', padding: '25px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)', border: '2px solid #cbd5e1', marginTop: '35px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: '#3b82f6' }}>Danh sách Đơn báo Trả cần Xác nhận nhận lại đồ</h3>
              {orders.filter(o => o.status === 'Chờ trả' && isNotExpired(o.endDate)).length === 0 ? (
                <p style={{ color: '#64748b', fontStyle: 'italic', fontSize: '14px' }}>Hiện tại không có thiết bị nào cần thu hồi.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', color: '#64748b', textAlign: 'left' }}>
                      <th style={{ padding: '12px' }}>Người mượn</th>
                      <th style={{ padding: '12px' }}>Thiết bị thu hồi</th>
                      <th style={{ padding: '12px' }}>Số lượng</th>
                      <th style={{ padding: '12px' }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.filter(o => o.status === 'Chờ trả' && isNotExpired(o.endDate)).map((order) => (
                      <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px', fontWeight: 500 }}>{order.username}</td>
                        <td style={{ padding: '12px', color: '#0f172a', fontWeight: 500 }}>{order.deviceName}</td>
                        <td style={{ padding: '12px' }}>{order.quantity}</td>
                        <td style={{ padding: '12px' }}>
                          <button onClick={() => handleUpdateStatus(order, 'Đã trả')} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
                            Xác nhận đã nhận lại đồ
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        )}

        {activeTab === 'muon' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '100%', maxWidth: '100%', alignItems: 'center' }}>
            <BorrowForm 
              devices={devices} 
              selectedDevice={selectedDevice} 
              setSelectedDevice={setSelectedDevice} 
              borrowQty={borrowQty} 
              setBorrowQty={setBorrowQty} 
              startDate={startDate} 
              setStartDate={setStartDate} 
              endDate={endDate} 
              setEndDate={setEndDate} 
              reason={reason}       
              setReason={setReason} 
              onSubmit={handleBorrowSubmit} 
            />

            <div style={{ width: '100%', maxWidth: '900px', background: '#ffffff', padding: '25px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)', boxSizing: 'border-box' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', marginBottom: '5px' }}>Thiết bị bạn đang mượn sử dụng</h3>
              <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '15px' }}>Sau khi dùng xong vui lòng ấn nút "Báo cáo trả đồ" dưới đây để gửi yêu cầu cho Admin thu hồi.</p>
              
              {orders.filter(o => o.status === 'Đã duyệt' || o.status === 'Chờ trả').length === 0 ? (
                <p style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '14px', padding: '10px 0' }}>Bạn đang không giữ thiết bị nào của trung tâm.</p>
              ) : (
                <table className="borrow-table">
                  <thead>
                    <tr>
                      <th>Tên thiết bị</th>
                      <th>Số lượng</th>
                      <th>Thời hạn mượn</th>
                      <th>Trạng thái</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.filter(o => o.status === 'Đã duyệt' || o.status === 'Chờ trả').map((order) => (
                      <tr key={order.id}>
                        <td style={{ fontWeight: 500 }}>{order.deviceName}</td>
                        <td>{order.quantity} cái</td>
                        <td style={{ fontSize: '13px', color: '#475569' }}>{order.startDate} → {order.endDate}</td>
                        <td>
                          <span style={{ color: order.status === 'Chờ trả' ? '#f59e0b' : '#10b981', fontWeight: 600 }}>
                            {order.status === 'Chờ trả' ? 'Đang chờ Admin thu hồi' : 'Đang sử dụng'}
                          </span>
                        </td>
                        <td>
                          {order.status === 'Đã duyệt' && (
                            <button onClick={() => handleUpdateStatus(order, 'Chờ trả')} style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                              Báo cáo trả đồ
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div style={{ width: '100%', maxWidth: '900px', background: '#fffbeb', border: '1px solid #fef3c7', padding: '15px 20px', borderRadius: '12px', color: '#b45309', fontSize: '13px', lineHeight: '1.6', boxSizing: 'border-box' }}>
              <strong>⚠️ Lưu ý quy tắc mượn đồ:</strong> Sinh viên có trách nhiệm bảo quản thiết bị trung tâm nguyên vẹn. Mọi hành vi làm hư hỏng hoặc quá hạn trả không có lý do chính đáng sẽ bị hạn chế quyền mượn thiết bị trong các lần tiếp theo.
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && <Leaderboard currentUser={currentUser} />}

        {activeTab === 'user_info' && !isAdmin && <UserInfo user={currentUser} onUpdateUser={handleUpdateUserInternal} />}
      </div>

      {deviceToDelete !== null && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#ffffff', padding: '30px', borderRadius: '24px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 12px 0' }}>Xác nhận xóa thiết bị</h3>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 24px 0', lineHeight: '1.5' }}>Bạn có chắc chắn muốn xóa thiết bị này khỏi danh sách quản lý của kho hàng không? Thao tác này không thể hoàn tác.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setDeviceToDelete(null)} style={{ flex: 1, padding: '10px 16px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
                Hủy bỏ
              </button>
              <button onClick={executeDeleteDevice} style={{ flex: 1, padding: '10px 16px', background: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      <HistoryModal isOpen={showHistoryModal} onClose={() => setShowHistoryModal(false)} orders={orders} />
    </div>
  );
};

export default Dashboard;