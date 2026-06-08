import React, { useState, useMemo, useRef, useEffect } from 'react';
import { type Device } from '../types';
import { toast } from 'react-hot-toast'; 

interface BorrowFormProps {
  devices: Device[];
  selectedDevice: string;
  setSelectedDevice: (name: string) => void;
  borrowQty: number;
  setBorrowQty: (qty: number) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  reason: string;
  setReason: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const BorrowForm: React.FC<BorrowFormProps> = ({
  devices,
  selectedDevice,
  setSelectedDevice,
  borrowQty,
  setBorrowQty,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  reason,
  setReason,
  onSubmit,
}) => {
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(selectedDevice || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (selectedDevice) {
      setSearchTerm(selectedDevice);
    }
  }, [selectedDevice]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        const currentDevice = devices.find(d => d.name === selectedDevice);
        setSearchTerm(currentDevice ? currentDevice.name : '');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedDevice, devices]);

  const filteredDevices = useMemo(() => {
    return devices.filter(device =>
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [devices, searchTerm]);

  const currentSelectedDeviceObj = useMemo(() => {
    return devices.find(d => d.name === selectedDevice);
  }, [devices, selectedDevice]);

  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDevice) {
      toast.error('Vui lòng tìm và chọn thiết bị muốn mượn!');
      return;
    }

    if (!startDate || !endDate) {
      toast.error('Vui lòng chọn đầy đủ ngày mượn và ngày trả!');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      toast.error('Ngày hẹn trả không thể trước ngày mượn đồ!');
      return;
    }

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 30) {
      toast.error(`Thời gian mượn đồ hiện tại là ${diffDays} ngày. Theo quy định mới, bạn không thể mượn thiết bị quá 30 ngày!`);
      return;
    }

    if (currentSelectedDeviceObj && borrowQty > currentSelectedDeviceObj.quantity_available) {
      toast.error(`Số lượng trong kho không đủ! Thiết bị này hiện chỉ còn tối đa ${currentSelectedDeviceObj.quantity_available} cái khả dụng.`);
      return;
    }

    if (borrowQty >= 3 && !reason.trim()) {
      toast.error(`Bạn đang đăng ký mượn số lượng lớn (${borrowQty} cái). Vui lòng điền rõ lý do chính đáng để Ban quản trị phê duyệt!`);
      return;
    }

    if (!reason.trim()) {
      setReason('Nhu cầu cá nhân'); 
    }

    onSubmit(e);
  };

  const inputStyle = (id: string) => ({
    width: '100%', 
    padding: '11px 14px', 
    borderRadius: '8px', 
    border: focusedInput === id ? '2px solid #0f766e' : '2px solid #cbd5e1', 
    outline: 'none', 
    fontSize: '15px', 
    fontWeight: '600', 
    color: '#1e293b', 
    background: '#ffffff', 
    fontFamily: 'inherit',
    transition: 'border-color 0.2s ease',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
    boxSizing: 'border-box' as const
  });

  const labelStyle = {
    display: 'block', 
    fontWeight: '700', 
    marginBottom: '8px', 
    color: '#0f766e', 
    fontSize: '13px', 
    textTransform: 'uppercase' as const, 
    letterSpacing: '0.5px'
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      width: '100%', 
      fontFamily: '"Inter", "Segoe UI", sans-serif',
      boxSizing: 'border-box',
      padding: '10px 0'
    }}>
      
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
          filter: invert(32%) sepia(87%) saturate(442%) hue-rotate(125deg) brightness(92%) contrast(93%);
          opacity: 1;
          transition: transform 0.1s ease;
        }
        input[type="date"]::-webkit-calendar-picker-indicator:hover {
          transform: scale(1.1);
        }
        textarea::placeholder {
          color: #94a3b8;
          font-weight: 500;
        }
        .search-dropdown-item:hover {
          background-color: #f0fdfa !important;
        }
      `}</style>

      <div style={{ width: '100%', maxWidth: '900px', boxSizing: 'border-box' }}>
        
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h2 style={{ margin: 0, color: '#0f766e', fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            ĐƠN ĐĂNG KÝ MƯỢN THIẾT BỊ
          </h2>
          <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '14px' }}>
            Thiết lập khoảng thời gian sử dụng thiết bị phục vụ nghiên cứu và làm bài tập lớn.
          </p>
        </div>

        <div style={{ background: '#ffffff', padding: '35px', borderRadius: '20px', boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.05), 0 8px 10px -6px rgba(15, 23, 42, 0.05)', border: '1px solid #e2e8f0', marginBottom: '30px', boxSizing: 'border-box' }}>
          <form onSubmit={handleLocalSubmit}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', alignItems: 'start', marginBottom: '25px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ flex: '1', position: 'relative' }} ref={dropdownRef}>
                    <label style={labelStyle}>Tìm & Chọn thiết bị mượn:</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
                      <input
                        type="text"
                        placeholder="Gõ tên thiết bị để lọc..."
                        value={searchTerm}
                        onChange={e => {
                          setSearchTerm(e.target.value);
                          setIsDropdownOpen(true);
                        }}
                        onFocus={() => {
                          setFocusedInput('device-search');
                          setIsDropdownOpen(true);
                        }}
                        onBlur={() => setFocusedInput(null)}
                        style={{ ...inputStyle('device-search'), paddingRight: selectedDevice ? '85px' : '14px' }}
                      />
                      {selectedDevice && (
                        <span style={{ 
                          position: 'absolute', 
                          right: '12px', 
                          top: '50%', 
                          transform: 'translateY(-50%)', 
                          fontSize: '11px', 
                          fontWeight: '700', 
                          color: '#14b8a6', 
                          background: '#f0fdfa', 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          border: '1px solid #ccfbf1', 
                          pointerEvents: 'none',
                          whiteSpace: 'nowrap'
                        }}>
                          Đã Chọn
                        </span>
                      )}
                    </div>

                    {isDropdownOpen && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100, marginTop: '6px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', maxHeight: '220px', overflowY: 'auto' }}>
                        {filteredDevices.length === 0 ? (
                          <div style={{ padding: '14px', fontSize: '14px', color: '#64748b', textAlign: 'center' }}>
                            Không tìm thấy thiết bị nào tương ứng
                          </div>
                        ) : (
                          filteredDevices.map(d => {
                            const isDisabled = d.quantity_available <= 0;
                            return (
                              <div
                                key={d.id}
                                className="search-dropdown-item"
                                onClick={() => {
                                  if (!isDisabled) {
                                    setSelectedDevice(d.name);
                                    setSearchTerm(d.name);
                                    setIsDropdownOpen(false);
                                  }
                                }}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  padding: '10px 14px',
                                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                                  opacity: isDisabled ? 0.5 : 1,
                                  borderBottom: '1px solid #f1f5f9',
                                  transition: 'background-color 0.2s ease'
                                }}
                              >
                                <div>
                                  <div style={{ fontWeight: '700', fontSize: '14px', color: '#1e293b' }}>{d.name}</div>
                                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>{d.category}</div>
                                </div>
                                <span style={{
                                  fontSize: '12px',
                                  fontWeight: '700',
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  background: isDisabled ? '#fee2e2' : '#e0f2fe',
                                  color: isDisabled ? '#ef4444' : '#0369a1'
                                }}>
                                  Kho: {d.quantity_available}
                                </span>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>

                  <div style={{ width: '100px', flexShrink: 0 }}>
                    <label style={labelStyle}>Số lượng:</label>
                    <input 
                      type="number" 
                      value={borrowQty} 
                      onChange={e => setBorrowQty(Math.max(1, Number(e.target.value)))} 
                      onFocus={() => setFocusedInput('qty')}
                      onBlur={() => setFocusedInput(null)}
                      min="1"
                      max={currentSelectedDeviceObj ? currentSelectedDeviceObj.quantity_available : undefined}
                      style={{ ...inputStyle('qty'), textAlign: 'center' }}
                    />
                  </div>
                </div>

                <div style={{ padding: '11px 14px', background: '#f0fdfa', borderRadius: '8px', border: '1px solid #ccfbf1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', fontWeight: '600' }}>
                  <span style={{ color: '#64748b' }}>Trạng thái vật tư hiện tại:</span>
                  <span style={{ color: '#0f766e' }}>
                    {currentSelectedDeviceObj 
                      ? `Có thể yêu cầu mượn tối đa ${currentSelectedDeviceObj.quantity_available} cái`
                      : 'Chưa chọn thiết bị'
                    }
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Ngày mượn đồ:</label>
                    <input 
                      type="date" 
                      value={startDate} 
                      onChange={e => setStartDate(e.target.value)}
                      onFocus={() => setFocusedInput('start')}
                      onBlur={() => setFocusedInput(null)}
                      min={todayStr} 
                      style={inputStyle('start')}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Ngày hẹn trả:</label>
                    <input 
                      type="date" 
                      value={endDate} 
                      onChange={e => setEndDate(e.target.value)}
                      onFocus={() => setFocusedInput('end')}
                      onBlur={() => setFocusedInput(null)}
                      min={startDate || todayStr} 
                      style={inputStyle('end')}
                    />
                  </div>
                </div>

              </div>

              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <label style={labelStyle}>
                  Lý do mượn đồ: {borrowQty >= 3 && <span style={{ color: '#ef4444', textTransform: 'none' }}>(Bắt buộc)</span>}
                </label>
                <textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  onFocus={() => setFocusedInput('reason')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder={borrowQty >= 3 ? "Nhập chi tiết lý do bắt buộc khi mượn từ 3 cái trở lên..." : "Không bắt buộc nếu mượn số lượng ít (Mặc định: Nhu cầu cá nhân)"}
                  style={{
                    ...inputStyle('reason'),
                    resize: 'none',
                    flex: 1,
                    minHeight: '185px',
                    lineHeight: '1.6',
                    fontWeight: '500'
                  }}
                />
              </div>

            </div>

            <button 
              type="submit" 
              onMouseEnter={() => setIsBtnHovered(true)}
              onMouseLeave={() => setIsBtnHovered(false)}
              style={{ 
                width: '100%', 
                padding: '14px', 
                background: isBtnHovered ? '#ea580c' : '#f97316', 
                color: '#ffffff', 
                border: 'none', 
                borderRadius: '10px', 
                fontWeight: '700', 
                fontSize: '16px', 
                cursor: 'pointer', 
                transform: isBtnHovered ? 'translateY(-2px)' : 'translateY(0)',
                transition: 'all 0.2s ease', 
                boxShadow: isBtnHovered 
                  ? '0 6px 20px rgba(249, 115, 22, 0.35)' 
                  : '0 4px 12px rgba(249, 115, 22, 0.15)' 
              }}
            >
              Gửi Đơn Cho Ban Quản Trị Duyệt
            </button>

          </form>
        </div>
        
      </div>
    </div>
  );
};

export default BorrowForm;