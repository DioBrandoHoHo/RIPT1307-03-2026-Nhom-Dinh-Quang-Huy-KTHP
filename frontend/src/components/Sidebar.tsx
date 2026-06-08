import React, { useState } from 'react';
import { type User } from '../types';

interface SidebarProps {
  user: User;
  activeTab: 'kho' | 'duyet_don' | 'muon' | 'user_info' | 'leaderboard';
  setActiveTab: (tab: 'kho' | 'duyet_don' | 'muon' | 'user_info' | 'leaderboard') => void;
  ordersCount: number;
  setShowHistoryModal: (show: boolean) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  user,
  activeTab,
  setActiveTab,
  ordersCount,
  setShowHistoryModal,
  onLogout,
}) => {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const isAdmin = user.role === 'admin';

  const getTabStyle = (tabName: 'kho' | 'duyet_don' | 'muon' | 'user_info' | 'leaderboard') => {
    const isActive = activeTab === tabName;
    const isHovered = hoveredTab === tabName;
    
    return {
      display: 'block',
      width: '100%',
      padding: '14px 20px',
      background: isActive 
        ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' 
        : (isHovered ? 'rgba(255, 255, 255, 0.06)' : 'transparent'),
      color: isActive ? '#ffffff' : (isHovered ? '#f97316' : '#94a3b8'),
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      textAlign: 'left' as const,
      fontWeight: '600',
      fontSize: '14px',
      transform: isHovered && !isActive ? 'translateX(6px)' : 'translateX(0)',
      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: isActive ? '0 4px 20px rgba(234, 88, 12, 0.4)' : 'none',
      outline: 'none',
    };
  };

  return (
    <div style={{ 
      width: '280px', 
      background: '#0f172a', 
      color: '#ffffff', 
      display: 'flex', 
      flexDirection: 'column', 
      padding: '40px 24px', 
      boxShadow: '4px 0 25px rgba(0, 0, 0, 0.3)', 
      fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
      borderRight: '1px solid rgba(255, 255, 255, 0.05)'
    }}>
      
      <div style={{ flex: 1 }}>
        <div style={{ paddingBottom: '30px', marginBottom: '30px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ margin: 0, fontSize: '24px', letterSpacing: '1.5px', fontWeight: '900', color: '#f97316', textShadow: '0 2px 10px rgba(249, 115, 12, 0.2)' }}>ACADEMY GEAR</h3>
          <div style={{ fontSize: '10px', opacity: 0.5, marginTop: '6px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Hệ Thống Quản Lý Thiết Bị</div>
        </div>

        <div style={{ 
          background: 'rgba(255, 255, 255, 0.03)', 
          padding: '16px 20px', 
          borderRadius: '14px', 
          marginBottom: '35px', 
          border: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '50%', 
            background: isAdmin ? 'rgba(249, 115, 22, 0.2)' : 'rgba(59, 130, 246, 0.2)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '700',
            color: isAdmin ? '#f97316' : '#3b82f6',
            border: isAdmin ? '1px solid rgba(249, 115, 22, 0.3)' : '1px solid rgba(59, 130, 246, 0.3)'
          }}>
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px' }}>
              {isAdmin ? 'QUẢN TRỊ VIÊN' : 'SINH VIÊN'}
            </div>
            <div style={{ fontSize: '15px', fontWeight: '750', marginTop: '2px', color: '#f8fafc' }}>{user.username}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          
          <button 
            onClick={() => setActiveTab('kho')}
            onMouseEnter={() => setHoveredTab('kho')}
            onMouseLeave={() => setHoveredTab(null)}
            style={getTabStyle('kho')}
          >
            {isAdmin ? 'Kho Thiết Bị' : 'Kho Thiết Bị Sẵn Có'}
          </button>

          {isAdmin ? (
            <button 
              onClick={() => setActiveTab('duyet_don')}
              onMouseEnter={() => setHoveredTab('duyet_don')}
              onMouseLeave={() => setHoveredTab(null)}
              style={getTabStyle('duyet_don')}
            >
              Thống kê của kho hàng
            </button>
          ) : (
            <button 
              onClick={() => setActiveTab('muon')}
              onMouseEnter={() => setHoveredTab('muon')}
              onMouseLeave={() => setHoveredTab(null)}
              style={getTabStyle('muon')}
            >
              Tạo Yêu Cầu Mượn Đồ
            </button>
          )}

          {!isAdmin && (
            <button 
              onClick={() => setActiveTab('user_info')}
              onMouseEnter={() => setHoveredTab('user_info')}
              onMouseLeave={() => setHoveredTab(null)}
              style={getTabStyle('user_info')}
            >
              Thông Tin Cá Nhân
            </button>
          )}

          <button 
            onClick={() => setActiveTab('leaderboard')}
            onMouseEnter={() => setHoveredTab('leaderboard')}
            onMouseLeave={() => setHoveredTab(null)}
            style={getTabStyle('leaderboard')}
          >
            Bảng Xếp Hạng Hoạt Động
          </button>

        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '24px' }}>
        <button 
          onClick={() => setShowHistoryModal(true)}
          style={{ 
            width: '100%', 
            padding: '12px', 
            background: 'rgba(13, 148, 136, 0.15)', 
            color: '#2dd4bf', 
            border: '1px solid rgba(45, 212, 191, 0.2)', 
            borderRadius: '10px', 
            cursor: 'pointer', 
            fontWeight: '700', 
            fontSize: '13px', 
            transition: 'all 0.2s',
            outline: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(13, 148, 136, 0.25)';
            e.currentTarget.style.borderColor = 'rgba(45, 212, 191, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(13, 148, 136, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(45, 212, 191, 0.2)';
          }}
        >
          {isAdmin ? `Tất Cả Đơn Mượn (${ordersCount})` : `Lịch Sử Đơn Mượn (${ordersCount})`}
        </button>
        
        <button 
          onClick={onLogout}
          style={{ 
            width: '100%', 
            padding: '12px', 
            background: 'transparent', 
            color: '#f87171', 
            border: '1px solid rgba(248, 113, 113, 0.15)', 
            borderRadius: '10px', 
            cursor: 'pointer', 
            fontWeight: '600', 
            fontSize: '13px', 
            transition: 'all 0.2s',
            outline: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(248, 113, 113, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(248, 113, 113, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(248, 113, 113, 0.15)';
          }}
        >
          Đăng xuất
        </button>
      </div>

    </div>
  );
};

export default Sidebar;