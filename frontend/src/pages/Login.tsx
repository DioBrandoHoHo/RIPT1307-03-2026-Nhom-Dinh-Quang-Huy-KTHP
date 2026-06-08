import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { type User } from '../types'; 
import { toast } from 'react-hot-toast';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState<boolean>(true);

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const [isUsernameTaken, setIsUsernameTaken] = useState<boolean>(false);
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);

  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const [isLinkHovered, setIsLinkHovered] = useState(false);

  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  const isPasswordValid = passwordRegex.test(password);

  useEffect(() => {
    if (isLoginView || !username.trim()) {
      setIsUsernameTaken(false);
      setUsernameSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsCheckingUsername(true);
      try {
        const res = await axios.post<{ exists: boolean }>('http://localhost:5000/api/check-username', { username });
        
        if (res.data.exists) {
          setIsUsernameTaken(true);
          const suggestions = [
            `${username}${Math.floor(100 + Math.random() * 900)}`,
            `${username}${Math.floor(10 + Math.random() * 90)}`,
            `${username}2026`
          ];
          setUsernameSuggestions(suggestions);
        } else {
          setIsUsernameTaken(false);
          setUsernameSuggestions([]);
        }
      } catch (err) {
        const mockTakenUsernames = ['admin', 'sinhvien', 'huydq'];
        if (mockTakenUsernames.includes(username.toLowerCase())) {
          setIsUsernameTaken(true);
          setUsernameSuggestions([
            `${username}${Math.floor(100 + Math.random() * 900)}`,
            `${username}${Math.floor(10 + Math.random() * 90)}`,
            `${username}2k6`
          ]);
        } else {
          setIsUsernameTaken(false);
          setUsernameSuggestions([]);
        }
      } finally {
        setIsCheckingUsername(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [username, isLoginView]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoginView) {
      try {
        const res = await axios.post<{ user: User }>('http://localhost:5000/api/login', {
          username,
          password,
        });
        toast.success('Đăng nhập hệ thống thành công!');
        onLoginSuccess(res.data.user);
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Lỗi tài khoản hoặc mật khẩu!');
      }
    } else {
      if (isUsernameTaken) {
        toast.error('Vui lòng chọn một tên tài khoản khác!');
        return;
      }

      if (!isPasswordValid) {
        toast.error('Mật khẩu chưa đủ độ bảo mật yêu cầu!');
        return;
      }

      if (password !== confirmPassword) {
        toast.error('Mật khẩu xác nhận không khớp!');
        return;
      }

      try {
        const res = await axios.post('http://localhost:5000/api/register', {
          username,
          password,
          confirmPassword,
          email,
          phone,
        });
        toast.success(res.data.message || 'Đăng ký tài khoản thành công!');
        setIsLoginView(true);
        
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setEmail('');
        setPhone('');
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Đăng ký thất bại!');
      }
    }
  };

  const handleToggleView = () => {
    setIsLoginView(!isLoginView);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setEmail('');
    setPhone('');
    setIsUsernameTaken(false);
    setUsernameSuggestions([]);
    setIsLinkHovered(false);
  };

  const inputStyle = (id: string, hasError: boolean = false) => ({
    width: '100%',
    padding: isLoginView ? '12px 14px 12px 42px' : '10px 12px 10px 38px',
    borderRadius: '8px',
    border: hasError 
      ? '2px solid #ef4444' 
      : (focusedInput === id ? '2px solid #f97316' : '2px solid #e2e8f0'),
    outline: 'none',
    fontSize: '13px',
    fontWeight: '600',
    color: '#0f172a',
    background: '#ffffff',
    fontFamily: 'inherit',
    transition: 'all 0.15s ease',
    boxSizing: 'border-box' as const,
    boxShadow: hasError
      ? '0 0 0 3px rgba(239, 68, 68, 0.12)'
      : (focusedInput === id ? '0 0 0 3px rgba(249, 115, 22, 0.12)' : 'none'),
  });

  const labelStyle = {
    display: 'block',
    fontWeight: '700',
    marginBottom: '5px',
    color: '#475569',
    fontSize: '12px',
    letterSpacing: '0.1px',
  };

  const iconContainerStyle = {
    position: 'absolute' as const,
    left: isLoginView ? '14px' : '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none' as const
  };

  const isSubmitDisabled = !isLoginView && (isUsernameTaken || !isPasswordValid || !username || !password);

  return (
    <div style={{ 
      fontFamily: '"Plus Jakarta Sans", "Inter", "Segoe UI", sans-serif', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#f8fafc', 
      padding: '20px'
    }}>
      
      <div style={{
        display: 'flex',
        width: '100%',
        maxWidth: '1000px',
        height: '630px', 
        background: '#ffffff',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.06)',
      }}>
        
        <div style={{
          flex: '1',
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
          padding: '40px',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontWeight: '900', fontSize: '15px', letterSpacing: '1px', color: '#f97316', marginBottom: '40px' }}>
              ACADEMY GEAR
            </div>
            <h1 style={{ fontSize: '30px', fontWeight: '800', marginBottom: '16px', lineHeight: '1.3', letterSpacing: '-0.5px' }}>
              Quản Lý Kho Thiết Bị Trực Quan Tập Trung.
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', fontWeight: '500' }}>
              Hỗ trợ sinh viên và giảng viên dễ dàng tra cứu, kiểm tra số lượng tồn kho thực tế, làm đơn đăng ký mượn thiết bị kỹ thuật phục vụ học tập một cách nhanh chóng.
            </p>
          </div>

          <div style={{ 
            background: 'rgba(255, 255, 255, 0.02)', 
            padding: '16px', 
            borderRadius: '12px', 
            border: '1px solid rgba(255, 255, 255, 0.06)' 
          }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#f97316', marginBottom: '4px', textTransform: 'uppercase' }}>
              Hướng dẫn tài khoản:
            </div>
            <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5', fontWeight: '500' }}>
              Vui lòng điền đúng định dạng Email học viện và số điện thoại liên lạc chính chủ để nhận thông báo phê duyệt đơn mượn đồ từ Ban quản trị kho.
            </div>
          </div>
        </div>

        <div style={{
          flex: '1',
          padding: isLoginView ? '40px 45px' : '25px 45px', 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#ffffff'
        }}>
          
          <div style={{ marginBottom: isLoginView ? '20px' : '12px', display: 'flex', justifyContent: 'flex-start' }}>
            <svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 5L85 22.5V57.5L50 95L15 57.5V22.5L50 5Z" fill="#1e293b" />
              <path d="M50 9L81.5 24.5V55.7L50 89.5L18.5 55.7V24.5L50 9Z" stroke="#f97316" strokeWidth="2.5" />
              <path d="M32 42C32 38 42 36 50 40C58 36 68 38 68 42V65C68 61 58 59 50 62C42 59 32 61 32 65V42Z" fill="#f97316" opacity="0.9" />
              <path d="M50 40V62" stroke="#1e293b" strokeWidth="2" />
              <circle cx="50" cy="28" r="6" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="3 2" />
              <circle cx="50" cy="28" r="2" fill="#ffffff" />
            </svg>
            <div style={{ marginLeft: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', letterSpacing: '1px' }}>PTIT CAMPUS</span>
              <span style={{ fontSize: '15px', fontWeight: '900', color: '#0f172a', letterSpacing: '0.3px' }}>GEAR HUB</span>
            </div>
          </div>

          <div style={{ marginBottom: isLoginView ? '20px' : '14px' }}>
            <h2 style={{ margin: '0 0 4px 0', color: '#0f172a', fontSize: '22px', fontWeight: '800' }}>
              {isLoginView ? 'ĐĂNG NHẬP HỆ THỐNG' : 'ĐĂNG KÝ TÀI KHOẢN'}
            </h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '13px', fontWeight: '500' }}>
              {isLoginView 
                ? 'Nhập tài khoản hệ thống của ông để truy cập kho đồ.' 
                : 'Tạo tài khoản thẻ mượn vật tư kỹ thuật mới cho sinh viên.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: isLoginView ? '14px' : '10px' }}>
            
            <div>
              <label style={labelStyle}>Tài khoản đăng nhập:</label>
              <div style={{ position: 'relative' }}>
                <span style={iconContainerStyle}>👤</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedInput('username')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="Nhập tên tài khoản..."
                  required
                  style={inputStyle('username', isUsernameTaken)}
                />
              </div>
              
              {!isLoginView && isCheckingUsername && (
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Đang kiểm tra...</div>
              )}
              {!isLoginView && isUsernameTaken && (
                <div style={{ marginTop: '4px' }}>
                  <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: '600' }}>Tài khoản đã tồn tại!</div>
                  <div style={{ fontSize: '11px', color: '#475569', fontWeight: '500' }}>
                    Gợi ý:{' '}
                    {usernameSuggestions.map((sug, idx) => (
                      <span 
                        key={idx}
                        onClick={() => setUsername(sug)}
                        style={{ color: '#f97316', fontWeight: '700', textDecoration: 'underline', cursor: 'pointer', marginRight: '6px' }}
                      >
                        {sug}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label style={labelStyle}>Mật khẩu bảo mật:</label>
              <div style={{ position: 'relative' }}>
                <span style={iconContainerStyle}>🔒</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="••••••••"
                  required
                  style={inputStyle('password', !isLoginView && password.length > 0 && !isPasswordValid)}
                />
              </div>
              {!isLoginView && (
                <div style={{ 
                  fontSize: '10px', 
                  marginTop: '4px', 
                  fontWeight: '600',
                  color: password.length === 0 ? '#64748b' : (isPasswordValid ? '#10b981' : '#ef4444') 
                }}>
                  Yêu cầu: ≥ 8 ký tự, 1 chữ HOA và 1 ký tự đặc biệt.
                </div>
              )}
            </div>

            {!isLoginView && (
              <>
                <div>
                  <label style={labelStyle}>Xác nhận lại mật khẩu:</label>
                  <div style={{ position: 'relative' }}>
                    <span style={iconContainerStyle}>🛡️</span>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setFocusedInput('confirmPassword')}
                      onBlur={() => setFocusedInput(null)}
                      placeholder="••••••••"
                      required
                      style={inputStyle('confirmPassword', confirmPassword.length > 0 && password !== confirmPassword)}
                    />
                  </div>
                  {confirmPassword.length > 0 && password !== confirmPassword && (
                    <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px', fontWeight: '600' }}>Xác nhận mật khẩu không khớp!</div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={labelStyle}>Email học viện:</label>
                    <div style={{ position: 'relative' }}>
                      <span style={iconContainerStyle}>✉️</span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedInput('email')}
                        onBlur={() => setFocusedInput(null)}
                        placeholder="sv@hocvien.edu.vn"
                        required
                        style={inputStyle('email')}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Số điện thoại:</label>
                    <div style={{ position: 'relative' }}>
                      <span style={iconContainerStyle}>📞</span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onFocus={() => setFocusedInput('phone')}
                        onBlur={() => setFocusedInput(null)}
                        placeholder="0912345678"
                        required
                        style={inputStyle('phone')}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <button 
              type="submit"
              disabled={isSubmitDisabled}
              onMouseEnter={() => setIsBtnHovered(true)}
              onMouseLeave={() => setIsBtnHovered(false)}
              style={{
                width: '100%',
                padding: isLoginView ? '12px' : '10px',
                backgroundColor: isSubmitDisabled ? '#cbd5e1' : '#1e293b',
                color: isSubmitDisabled ? '#94a3b8' : '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '14px',
                cursor: isSubmitDisabled ? 'not-allowed' : 'pointer',
                marginTop: '6px',
                transform: (!isSubmitDisabled && isBtnHovered) ? 'translateY(-1px)' : 'translateY(0)',
                transition: 'all 0.15s ease'
              }}
            >
              {isLoginView ? 'Đăng Nhập Ngay' : 'Đăng Ký Tài Khoản'}
            </button>
          </form>

          <div style={{ 
            marginTop: isLoginView ? '20px' : '14px', 
            textAlign: 'center', 
            fontSize: '13px', 
            fontWeight: '600', 
            color: '#64748b',
            borderTop: '1px solid #f1f5f9',
            paddingTop: isLoginView ? '16px' : '10px'
          }}>
            {isLoginView ? (
              <>
                Chưa có tài khoản sinh viên?{' '}
                <span
                  onClick={handleToggleView}
                  onMouseEnter={() => setIsLinkHovered(true)}
                  onMouseLeave={() => setIsLinkHovered(false)}
                  style={{ 
                    color: '#f97316', 
                    fontWeight: '700', 
                    cursor: 'pointer', 
                    textDecoration: isLinkHovered ? 'underline' : 'none' 
                  }}
                >
                  Đăng ký ngay
                </span>
              </>
            ) : (
              <>
                Đã có tài khoản hệ thống?{' '}
                <span
                  onClick={handleToggleView}
                  onMouseEnter={() => setIsLinkHovered(true)}
                  onMouseLeave={() => setIsLinkHovered(false)}
                  style={{ 
                    color: '#f97316', 
                    fontWeight: '700', 
                    cursor: 'pointer', 
                    textDecoration: isLinkHovered ? 'underline' : 'none' 
                  }}
                >
                  Quay lại Đăng nhập
                </span>
              </>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default Login;