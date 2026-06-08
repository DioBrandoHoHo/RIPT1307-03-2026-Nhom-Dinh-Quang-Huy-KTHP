import React from 'react';
import { type Order } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, orders }) => {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#ffffff', width: '90%', maxWidth: '850px', borderRadius: '12px', padding: '30px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', maxHeight: '85vh', overflowY: 'auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0f766e', paddingBottom: '15px', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: '#0f766e', fontSize: '22px', fontWeight: '700' }}>TOÀN BỘ TIẾN ĐỘ ĐƠN MƯỢN CỦA BẠN</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '26px', cursor: 'pointer', color: '#64748b', lineHeight: 1 }}>&times;</button>
        </div>

        {orders.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>Bạn chưa có bất kỳ lịch sử yêu cầu mượn đồ nào.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#0f766e', color: '#ffffff' }}>
                <th style={{ padding: '12px' }}>Mã đơn</th>
                <th style={{ padding: '12px' }}>Tên thiết bị</th>
                <th style={{ padding: '12px' }}>Số lượng</th>
                <th style={{ padding: '12px' }}>Thời gian mượn dự kiến</th>
                <th style={{ padding: '12px' }}>Trạng thái đơn</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                let statusColor = '#ffc107';
                if (order.status === 'Đã duyệt') statusColor = '#10b981';
                if (order.status === 'Từ chối') statusColor = '#ef4444';
                if (order.status === 'Đã trả') statusColor = '#3b82f6';

                return (
                  <tr key={order.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>#{order.id}</td>
                    <td style={{ padding: '12px', fontWeight: '600', color: '#0f766e' }}>{order.deviceName}</td>
                    <td style={{ padding: '12px' }}>{order.quantity}</td>
                    <td style={{ padding: '12px', color: '#475569' }}>
                      {order.startDate ? `${order.startDate} đến ${order.endDate}` : 'Chưa cập nhật lịch'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '4px', color: '#ffffff', background: statusColor, fontSize: '12px', fontWeight: 'bold' }}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <div style={{ marginTop: '25px', textAlign: 'right', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
          <button onClick={onClose} style={{ padding: '8px 22px', background: '#475569', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Đóng hộp thoại</button>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;