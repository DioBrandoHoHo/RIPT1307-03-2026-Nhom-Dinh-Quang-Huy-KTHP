import React, { useState, useEffect } from 'react';
import { type User } from '../types';
import { toast } from 'react-hot-toast';

interface UserInfoProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

const UserInfo: React.FC<UserInfoProps> = ({ user, onUpdateUser }) => {
  if (user.role === 'admin' || user.username === 'admin') {
    return (
      <div style={{ padding: '40px', textAlign: 'center' as const, color: '#94a3b8' }}>
        <p style={{ fontSize: '16px', fontWeight: '600' }}>Tài khoản Admin không sử dụng tính năng thẻ mượn sinh viên này.</p>
      </div>
    );
  }

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showPhone, setShowPhone] = useState<boolean>(false);
  const [showIdCard, setShowIdCard] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    username: user.username || '',
    email: user.email || '',
    phone: user.phone || '',
    idCard: user.idCard || '',
    studentId: user.studentId || '',
    major: user.major || '',
    class: user.class || '',
  });

  useEffect(() => {
    setFormData({
      username: user.username || '',
      email: user.email || '',
      phone: user.phone || '',
      idCard: user.idCard || '',
      studentId: user.studentId || '',
      major: user.major || '',
      class: user.class || '',
    });
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      idCard: formData.idCard,
      studentId: formData.studentId,
      major: formData.major,
      class: formData.class,
    });
    setIsEditing(false);
    toast.success('Cập nhật thông tin tài khoản thành công!');
  };

  const fieldContainerStyle = {
    marginBottom: '20px',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '700',
    color: '#64748b',
    marginBottom: '8px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: isEditing ? '2px solid #f97316' : '2px solid rgba(255, 255, 255, 0.08)',
    background: isEditing ? '#ffffff' : 'rgba(255, 255, 255, 0.02)',
    color: isEditing ? '#0f172a' : '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    outline: 'none',
    boxSizing: 'border-box' as const,
    transition: 'all 0.2s ease',
  };

  const secureDisplay = (value: string, show: boolean) => {
    if (!value || value.trim() === '') return 'Chưa cập nhật';
    if (show || isEditing) return value;
    if (value.length <= 4) return '•'.repeat(value.length);
    return '•'.repeat(value.length - 3) + ' ' + value.slice(-3);
  };

  const normalDisplay = (value: string) => {
    if (!value || value.trim() === '') return 'Chưa cập nhật';
    return value;
  };

  return (
    <div style={{
      padding: '40px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
    }}>
      <div style={{
        background: '#1e293b',
        borderRadius: '20px',
        padding: '35px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          paddingBottom: '20px',
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#f8fafc' }}>HỒ SƠ CÁ NHÂN</h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>
              Quản lý và cập nhật thông tin thẻ mượn vật tư kỹ thuật của ông.
            </p>
          </div>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              style={{
                padding: '10px 20px',
                background: '#f97316',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
               Chỉnh sửa hồ sơ
            </button>
          )}
        </div>

        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            
            <div style={fieldContainerStyle}>
              <label style={labelStyle}>Tên người dùng:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={!isEditing}
                style={inputStyle}
                required
              />
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>Email liên hệ:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                style={inputStyle}
                required
              />
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>Số điện thoại cá nhân:</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="phone"
                  value={isEditing ? formData.phone : secureDisplay(formData.phone, showPhone)}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  style={{ 
                    ...inputStyle, 
                    paddingRight: '50px',
                    color: !isEditing && (!formData.phone || formData.phone.trim() === '') ? '#64748b' : inputStyle.color,
                    fontStyle: !isEditing && (!formData.phone || formData.phone.trim() === '') ? 'italic' : 'normal'
                  }}
                  required={isEditing}
                />
                {!isEditing && formData.phone && formData.phone.trim() !== '' && (
                  <button
                    type="button"
                    onClick={() => setShowPhone(!showPhone)}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    {showPhone ? '👁️' : '🙈'}
                  </button>
                )}
              </div>
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>Số Căn cước công dân (CCCD):</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="idCard"
                  value={isEditing ? formData.idCard : secureDisplay(formData.idCard, showIdCard)}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  style={{ 
                    ...inputStyle, 
                    paddingRight: '50px',
                    color: !isEditing && (!formData.idCard || formData.idCard.trim() === '') ? '#64748b' : inputStyle.color,
                    fontStyle: !isEditing && (!formData.idCard || formData.idCard.trim() === '') ? 'italic' : 'normal'
                  }}
                  required={isEditing}
                />
                {!isEditing && formData.idCard && formData.idCard.trim() !== '' && (
                  <button
                    type="button"
                    onClick={() => !isEditing && setShowIdCard(!showIdCard)}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    {showIdCard ? '👁️' : '🙈'}
                  </button>
                )}
              </div>
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>Mã số sinh viên:</label>
              <input
                type="text"
                name="studentId"
                value={isEditing ? formData.studentId : normalDisplay(formData.studentId)}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder={isEditing ? "Nhập mã số sinh viên..." : ""}
                style={{
                  ...inputStyle,
                  color: !isEditing && (!formData.studentId || formData.studentId.trim() === '') ? '#64748b' : inputStyle.color,
                  fontStyle: !isEditing && (!formData.studentId || formData.studentId.trim() === '') ? 'italic' : 'normal'
                }}
                required={isEditing}
              />
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>Chuyên ngành học tập:</label>
              <input
                type="text"
                name="major"
                value={isEditing ? formData.major : normalDisplay(formData.major)}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder={isEditing ? "Nhập chuyên ngành..." : ""}
                style={{
                  ...inputStyle,
                  color: !isEditing && (!formData.major || formData.major.trim() === '') ? '#64748b' : inputStyle.color,
                  fontStyle: !isEditing && (!formData.major || formData.major.trim() === '') ? 'italic' : 'normal'
                }}
                required={isEditing}
              />
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>Lớp hành chính:</label>
              <input
                type="text"
                name="class"
                value={isEditing ? formData.class : normalDisplay(formData.class)}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder={isEditing ? "Nhập tên lớp..." : ""}
                style={{
                  ...inputStyle,
                  color: !isEditing && (!formData.class || formData.class.trim() === '') ? '#64748b' : inputStyle.color,
                  fontStyle: !isEditing && (!formData.class || formData.class.trim() === '') ? 'italic' : 'normal'
                }}
                required={isEditing}
              />
            </div>

          </div>

          {isEditing && (
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              paddingTop: '25px',
            }}>
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    username: user.username || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    idCard: user.idCard || '',
                    studentId: user.studentId || '',
                    major: user.major || '',
                    class: user.class || '',
                  });
                  setIsEditing(false);
                }}
                style={{
                  padding: '12px 24px',
                  background: '#334155',
                  color: '#f8fafc',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(234, 88, 12, 0.4)',
                }}
              >
                Lưu thay đổi
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserInfo;