import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { type User } from './types'; 
import { Toaster } from 'react-hot-toast';

function App() {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('academy_gear_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('academy_gear_user', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('academy_gear_user');
  };

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#334155',
            color: '#fff',
            fontFamily: '"Segoe UI", sans-serif',
            fontSize: '14px',
            borderRadius: '8px',
          },
        }} 
      />

      {!user ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;