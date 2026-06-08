import React from 'react';
import { type User } from '../types';
import { staticDevices, staticStudents } from './leaderboardData';

interface LeaderboardProps {
  isMini?: boolean;
  currentUser?: User | null;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ 
  isMini = false, 
  currentUser = null
}) => {
  const finalDevices = [...staticDevices]
    .sort((a, b) => b.borrowCount - a.borrowCount)
    .map((item, index) => ({ ...item, rank: index + 1 }));

  const finalStudents = [...staticStudents]
    .sort((a, b) => b.borrowCount - a.borrowCount)
    .map((item, index) => ({ ...item, rank: index + 1 }));

  const limitCount = isMini ? 4 : 10;
  const displayedDevices = finalDevices.slice(0, limitCount);
  const displayedStudents = finalStudents.slice(0, limitCount);

  const myRankInfo = currentUser 
    ? finalStudents.find(s => s.username.toLowerCase() === currentUser.username.toLowerCase())
    : null;

  const isMyRankOutsideTop = myRankInfo ? myRankInfo.rank > limitCount : false;

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { text: '#1', color: '#eab308', bg: '#fef9c3', border: '#fde047' }; 
    if (rank === 2) return { text: '#2', color: '#64748b', bg: '#f1f5f9', border: '#cbd5e1' }; 
    if (rank === 3) return { text: '#3', color: '#b45309', bg: '#ffedd5', border: '#fed7aa' }; 
    return { text: `#${rank}`, color: '#94a3b8', bg: '#f8fafc', border: '#e2e8f0' };
  };

  const getRowOpacityStyle = (rank: number, isMe: boolean) => {
    if (isMe || isMini || rank <= 3) return { opacity: 1 };
    const opacity = 1 - (rank - 4) * 0.08;
    return { opacity: Math.max(opacity, 0.45) };
  };

  return (
    <div style={{ fontFamily: '"Inter", "Segoe UI", sans-serif', maxWidth: isMini ? '100%' : '1200px', margin: '0 auto', padding: isMini ? '0' : '20px' }}>
      
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .leaderboard-card-rank1 {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
          animation: fadeInUp 0.5s cubic-bezier(0.25, 1, 0.5, 1) both;
        }
        .leaderboard-card-rank1:hover {
          transform: translateY(-5px) scale(1.03) !important;
          box-shadow: 0 20px 25px -5px rgba(234, 179, 8, 0.2), 0 10px 10px -5px rgba(234, 179, 8, 0.1) !important;
        }

        .leaderboard-card-normal {
          transition: all 0.25s ease !important;
          animation: fadeInUp 0.5s cubic-bezier(0.25, 1, 0.5, 1) both;
        }
        .leaderboard-card-normal:hover {
          transform: translateY(-3px) scale(1.015) !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03) !important;
          border-color: #cbd5e1 !important;
          background-color: #ffffff !important;
        }
      `}</style>
      
      {!isMini && (
        <div style={{ marginBottom: '35px', textAlign: 'center' }}>
          <h2 style={{ margin: 0, color: '#0f766e', fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            BẢNG XẾP HẠNG HOẠT ĐỘNG
          </h2>
          <p style={{ margin: '8px 0 0 0', color: '#64748b', fontSize: '13px' }}>
            Vinh danh xu hướng thiết bị được săn đón và những sinh viên tích cực thực hành tại phòng lab.
          </p>
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMini ? '1fr' : 'repeat(auto-fit, minmax(480px, 1fr))', 
        gap: isMini ? '20px' : '30px',
        alignItems: 'start'
      }}>
        
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: isMini ? '16px' : '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: isMini ? '14px' : '16px', fontWeight: '700', color: '#1e293b' }}>
            Top Thiết Bị Được Mượn Nhiều Nhất
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {displayedDevices.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '10px 0' }}>Chưa ghi nhận dữ liệu mượn thiết bị.</p>
            ) : (
              displayedDevices.map((item, index) => {
                const badge = getRankBadge(item.rank);
                const delayStyle = { animationDelay: `${index * 0.05}s` };
                
                if (item.rank === 1) {
                  return (
                    <div 
                      key={`device-${item.rank}`} 
                      className="leaderboard-card-rank1"
                      style={{
                        background: 'linear-gradient(135deg, #fffbeb 0%, #fef9c3 100%)',
                        border: '2px solid #eab308',
                        borderRadius: '12px',
                        padding: isMini ? '14px' : '20px',
                        boxShadow: '0 10px 15px -3px rgba(234, 179, 8, 0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        ...delayStyle
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: isMini ? '10px' : '16px', overflow: 'hidden' }}>
                        <span style={{ fontSize: isMini ? '20px' : '24px', fontWeight: '900', color: '#a16207', minWidth: '30px' }}>{badge.text}</span>
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontSize: isMini ? '13.5px' : '17px', fontWeight: '800', color: '#713f12', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                          <span style={{ background: '#fef08a', color: '#a16207', fontSize: '10px', padding: '2px 6px', borderRadius: '5px', fontWeight: '700' }}>
                            {item.category}
                          </span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', minWidth: '65px' }}>
                        <div style={{ fontSize: isMini ? '18px' : '22px', fontWeight: '900', color: '#a16207' }}>{item.borrowCount}</div>
                        <div style={{ fontSize: '9px', fontWeight: '700', color: '#713f12' }}>LƯỢT</div>
                      </div>
                    </div>
                  );
                }

                if (item.rank === 2 || item.rank === 3) {
                  return (
                    <div 
                      key={`device-${item.rank}`} 
                      className="leaderboard-card-normal"
                      style={{
                        border: `1.5px solid ${badge.border}`,
                        backgroundColor: badge.bg,
                        borderRadius: '10px',
                        padding: isMini ? '10px 12px' : '14px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        ...delayStyle
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                        <span style={{ fontSize: '14px', fontWeight: '900', color: badge.color, minWidth: '25px' }}>{badge.text}</span>
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontSize: isMini ? '13px' : '14px', fontWeight: '700', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                          <span style={{ color: '#64748b', fontSize: '11px', fontWeight: '500' }}>{item.category}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: isMini ? '12.5px' : '14px', fontWeight: '800', color: '#334155', whiteSpace: 'nowrap' }}>
                        {item.borrowCount} lượt
                      </div>
                    </div>
                  );
                }

                return (
                  <div 
                    key={`device-${item.rank}`} 
                    className="leaderboard-card-normal"
                    style={{
                      ...getRowOpacityStyle(item.rank, false),
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      ...delayStyle
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ width: '28px', height: '28px', background: badge.bg, border: `1px solid ${badge.border}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: badge.color }}>
                        {badge.text}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>{item.name}</span>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>
                      {item.borrowCount} lượt
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '16px', padding: isMini ? '16px' : '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: isMini ? '14px' : '16px', fontWeight: '700', color: '#1e293b' }}>
            Sinh Viên Tích Cực Thực Hành
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {displayedStudents.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '10px 0' }}>Chưa ghi nhận dữ liệu lịch sử mượn sinh viên.</p>
            ) : (
              displayedStudents.map((item, index) => {
                const badge = getRankBadge(item.rank);
                const isMe = currentUser ? item.username.toLowerCase() === currentUser.username.toLowerCase() : false;
                const delayStyle = { animationDelay: `${index * 0.05}s` };

                const highlightStyle = isMe ? {
                  background: 'rgba(13, 148, 136, 0.06)',
                  borderColor: '#0d9488',
                  boxShadow: '0 0 0 1px #0d9488'
                } : {};

                if (item.rank === 1) {
                  return (
                    <div 
                      key={`student-${item.rank}`} 
                      className="leaderboard-card-rank1"
                      style={{
                        background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
                        border: '2px solid #ea580c', 
                        borderRadius: '12px',
                        padding: isMini ? '14px' : '20px',
                        boxShadow: '0 10px 15px -3px rgba(234, 88, 12, 0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        ...highlightStyle,
                        ...delayStyle
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: isMini ? '10px' : '16px' }}>
                        <span style={{ fontSize: isMini ? '20px' : '24px', fontWeight: '900', color: '#c2410c', minWidth: '30px' }}>{badge.text}</span>
                        <div>
                          <div style={{ fontSize: isMini ? '13.5px' : '17px', fontWeight: '800', color: '#7c2d12', marginBottom: '4px' }}>
                            {item.username} {isMe && <span style={{ color: '#0d9488', fontSize: '12px', fontWeight: 'normal' }}>(Bạn)</span>}
                          </div>
                          <span style={{ background: '#ffdbb5', color: '#c2410c', fontSize: '10px', padding: '2px 6px', borderRadius: '5px', fontWeight: '700' }}>
                            {item.studentId}
                          </span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', minWidth: '65px' }}>
                        <div style={{ fontSize: isMini ? '18px' : '22px', fontWeight: '900', color: '#c2410c' }}>{item.borrowCount}</div>
                        <div style={{ fontSize: '9px', fontWeight: '700', color: '#7c2d12' }}>LẦN</div>
                      </div>
                    </div>
                  );
                }

                if (item.rank === 2 || item.rank === 3) {
                  return (
                    <div 
                      key={`student-${item.rank}`} 
                      className="leaderboard-card-normal"
                      style={{
                        border: `1.5px solid ${badge.border}`,
                        backgroundColor: badge.bg,
                        borderRadius: '10px',
                        padding: isMini ? '10px 12px' : '14px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        ...highlightStyle,
                        ...delayStyle
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '900', color: badge.color, minWidth: '25px' }}>{badge.text}</span>
                        <div>
                          <div style={{ fontSize: isMini ? '13px' : '14px', fontWeight: '700', color: '#1e293b' }}>
                            {item.username} {isMe && <span style={{ color: '#0d9488', fontWeight: 'bold' }}>(Bạn)</span>}
                          </div>
                          <span style={{ color: '#64748b', fontSize: '11px', fontWeight: '500' }}>{item.studentId}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: isMini ? '12.5px' : '14px', fontWeight: '800', color: '#334155', whiteSpace: 'nowrap' }}>
                        {item.borrowCount} lần
                      </div>
                    </div>
                  );
                }

                return (
                  <div 
                    key={`student-${item.rank}`} 
                    className="leaderboard-card-normal"
                    style={{
                      ...getRowOpacityStyle(item.rank, isMe),
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      ...highlightStyle,
                      ...delayStyle
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ width: '28px', height: '28px', background: badge.bg, border: `1px solid ${badge.border}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: badge.color }}>
                        {badge.text}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                        {item.username} {isMe && <span style={{ color: '#0d9488', fontWeight: 'bold' }}>(Bạn)</span>}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>
                      {item.borrowCount} lần
                    </div>
                  </div>
                );
              })
            )}

            {isMyRankOutsideTop && myRankInfo && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: '8px 0', color: '#94a3b8' }}>
                  <div style={{ flex: 1, height: '1px', background: '#e2e8f0', borderStyle: 'dashed' }}></div>
                  <span style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Vị trí của bạn</span>
                  <div style={{ flex: 1, height: '1px', background: '#e2e8f0', borderStyle: 'dashed' }}></div>
                </div>

                <div 
                  className="leaderboard-card-normal"
                  style={{
                    background: 'rgba(13, 148, 136, 0.08)',
                    border: '2px dashed #0d9488',
                    borderRadius: '10px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 12px rgba(13, 148, 136, 0.05)',
                    animationDelay: '0.5s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ background: '#0d9488', color: '#ffffff', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '800' }}>
                      #{myRankInfo.rank}
                    </span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b' }}>
                        {myRankInfo.username} <span style={{ color: '#0d9488', fontWeight: 'normal' }}>(Bạn)</span>
                      </div>
                      <span style={{ color: '#64748b', fontSize: '11px', fontWeight: '500' }}>
                        {myRankInfo.studentId}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#0d9488' }}>
                    {myRankInfo.borrowCount} lần
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Leaderboard;