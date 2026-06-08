import React, { useState, useMemo, useRef, useEffect } from 'react';
import { type Device } from '../types';
import { toast } from 'react-hot-toast'; 

interface DeviceListProps {
  devices: Device[]; 
  onSelectDeviceForBorrow: (deviceName: string) => void;
}

const DeviceList: React.FC<DeviceListProps> = ({ devices, onSelectDeviceForBorrow }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState('');
  const itemsPerPage = 9;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    devices.forEach(d => {
      if (d.category) cats.add(d.category);
    });
    return ['Tất cả', ...Array.from(cats)];
  }, [devices]);

  const filteredDevices = useMemo(() => {
    return devices.filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Tất cả' || d.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [devices, searchTerm, selectedCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredDevices.length / itemsPerPage));
  
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredDevices.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredDevices, currentPage]);

  const paginationRange = useMemo(() => {
    const range: (number | string)[] = [];
    const delta = 1; 
    
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      } else if (range[range.length - 1] !== '...') {
        range.push('...');
      }
    }
    return range;
  }, [totalPages, currentPage]);

  const handleGoToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(goToPageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setGoToPageInput('');
    } else {
      toast.error(`Vui lòng nhập số trang hợp lệ từ 1 đến ${totalPages}!`);
    }
  };

  const inputStyle = (id: string) => ({
    padding: '12px 16px',
    borderRadius: '10px',
    border: focusedInput === id ? '2px solid #0f766e' : '1px solid #e2e8f0',
    outline: 'none',
    fontSize: '14px',
    fontWeight: '500',
    color: '#1e293b',
    background: '#f8fafc',
    fontFamily: 'inherit',
    transition: 'all 0.15s ease',
    boxSizing: 'border-box' as const
  });

  return (
    <div style={{ fontFamily: '"Inter", "Segoe UI", sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '10px' }}>
      
      <style>{`
        .admin-style-btn {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .admin-style-btn:hover:not(:disabled) {
          transform: scale(1.03);
          box-shadow: 0 10px 15px -3px rgba(29, 78, 216, 0.25) !important;
          background-color: #1d4ed8 !important;
        }
        .admin-style-btn:active:not(:disabled) {
          transform: scale(0.98);
        }
      `}</style>

      <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#1e293b', fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Danh Sách Thiết Bị Kho Hàng
          </h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px', fontWeight: '500' }}>
            Tổng số: {filteredDevices.length} sản phẩm
          </p>
        </div>
        
        <div style={{ width: '320px' }}>
          <input 
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onFocus={() => setFocusedInput('search')}
            onBlur={() => setFocusedInput(null)}
            placeholder="Tìm kiếm thiết bị..."
            style={{ 
              ...inputStyle('search'), 
              width: '100%',
              height: '40px',
              fontSize: '13px'
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '13px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Bộ lọc danh mục:
        </span>
        <div ref={dropdownRef} style={{ width: '260px', position: 'relative' }}>
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{
              ...inputStyle('category_select'),
              height: '38px',
              padding: '0 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              background: '#ffffff',
              border: isDropdownOpen ? '2px solid #0f766e' : '1px solid #cbd5e1',
              borderRadius: '8px',
              userSelect: 'none'
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: '600', color: selectedCategory === 'Tất cả' ? '#64748b' : '#1e293b' }}>
              {selectedCategory === 'Tất cả' ? '📁 Tất cả danh mục' : `📁 ${selectedCategory}`}
            </span>
            <span style={{ fontSize: '10px', color: '#64748b' }}>▼</span>
          </div>

          {isDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '44px',
              right: 0,
              left: 0,
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              zIndex: 999,
              maxHeight: '220px',
              overflowY: 'auto',
              padding: '4px'
            }}>
              {categories.map(cat => {
                const isSelected = selectedCategory === cat;
                return (
                  <div
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsDropdownOpen(false);
                    }}
                    style={{
                      padding: '8px 12px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: isSelected ? '#ffffff' : '#334155',
                      background: isSelected ? '#0f766e' : 'transparent',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = '#f1f5f9';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {cat}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {filteredDevices.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '16px', border: '1px dashed #cbd5e1', color: '#64748b', fontWeight: '600', fontSize: '14px' }}>
          Không tìm thấy thiết bị nào phù hợp với bộ lọc hiện tại.
        </div>
      ) : (
        <>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
            gap: '24px',
            marginBottom: '40px'
          }}>
            {currentItems.map(device => {
              const isAvailable = device.quantity_available > 0;
              
              return (
                <div 
                  key={device.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #f1f5f9',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 4px 18px rgba(0, 0, 0, 0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    position: 'relative'
                  }}
                >
                  <div style={{ 
                    width: '100%', 
                    height: '180px', 
                    background: '#f8fafc', 
                    borderRadius: '12px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    {device.image_url ? (
                      <img src={device.image_url} alt={device.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>Hình ảnh thiết bị</div>
                    )}
                    
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      textAlign: 'right'
                    }}>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>Sẵn có:</div>
                      <div style={{ fontSize: '16px', color: isAvailable ? '#10b981' : '#ef4444', fontWeight: '800' }}>
                        {device.quantity_available}/{device.quantity_total || device.quantity_available}
                      </div>
                    </div>
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#1e293b', lineHeight: '1.4', minHeight: '42px' }}>
                      {device.name}
                    </h3>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: 'auto' }}>
                      <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Phân loại:</span>
                      <span style={{ fontSize: '12px', color: '#0f766e', fontWeight: '700' }}>
                        {device.category || 'Chưa phân loại'}
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={!isAvailable}
                    onClick={() => onSelectDeviceForBorrow(device.name)}
                    className="admin-style-btn"
                    style={{
                      width: '100%',
                      height: '42px',
                      background: isAvailable ? '#2563eb' : '#e2e8f0', 
                      color: isAvailable ? '#ffffff' : '#94a3b8',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '700',
                      fontSize: '13px',
                      cursor: isAvailable ? 'pointer' : 'not-allowed',
                      outline: 'none',
                    }}
                  >
                    {isAvailable ? 'Mượn thiết bị này' : 'Tạm thời hết hàng'}
                  </button>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                style={{ padding: '8px 12px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '13px', color: currentPage === 1 ? '#94a3b8' : '#334155' }}
              >
                Trước
              </button>

              {paginationRange.map((page, index) => {
                if (page === '...') return <span key={`dots-${index}`} style={{ padding: '0 8px', color: '#94a3b8', fontWeight: '700' }}>...</span>;
                const isCurrent = page === currentPage;
                return (
                  <button
                    key={`page-${page}`}
                    onClick={() => setCurrentPage(Number(page))}
                    style={{ minWidth: '36px', height: '36px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', background: isCurrent ? '#0f766e' : '#ffffff', color: isCurrent ? '#ffffff' : '#334155', border: isCurrent ? '1px solid #0f766e' : '1px solid #cbd5e1', transition: 'all 0.15s ease' }}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                style={{ padding: '8px 12px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '13px', color: currentPage === totalPages ? '#94a3b8' : '#334155' }}
              >
                Sau
              </button>
            </div>

            <form onSubmit={handleGoToPage} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Trang {currentPage} / {totalPages} | Đi đến:</span>
              <input type="number" min="1" max={totalPages} value={goToPageInput} onChange={e => setGoToPageInput(e.target.value)} onFocus={() => setFocusedInput('goto')} onBlur={() => setFocusedInput(null)} placeholder="Số..." style={{ ...inputStyle('goto'), width: '65px', padding: '7px 10px', textAlign: 'center', background: '#fff' }} />
              <button type="submit" style={{ padding: '8px 14px', background: '#ffffff', color: '#0f766e', border: '1px solid #0f766e', borderRadius: '6px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = '#0f766e'; e.currentTarget.style.color = '#ffffff'; }} onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#0f766e'; }}>Đi</button>
            </form>
          </div>
        </>
      )}

    </div>
  );
};

export default DeviceList;