import { Colors } from '../styles';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogout = () => {
    // Clear session/wallet here if needed
    navigate('/login');
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '100vw',
        backgroundColor: Colors.background,
        padding: '16px 32px',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${Colors.border}`,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Left: Logo + Links */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 32,
          cursor: 'pointer',
        }}
      >
        <img
          src="/logo.svg"
          alt="Logo"
          style={{ height: 32 }}
          onClick={handleLogoClick}
        />
        <span
          style={{ fontSize: 14, fontWeight: 'normal', color: Colors.textMain }}
          onClick={handleLogoClick}
        >
          Supply Chains
        </span>
      </div>

      {/* Right: Log Out text */}
      <span
        onClick={handleLogout}
        style={{
          fontWeight: 'bold',
          color: 'red',
          cursor: 'pointer',
        }}
      >
        Log Out
      </span>
    </div>
  );
}
