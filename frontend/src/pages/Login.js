import { useNavigate } from 'react-router-dom';
import { Colors } from '../styles';

export default function Login() {
  const navigate = useNavigate();

  const handleConnectWallet = () => {
    navigate('/');
  };

  return (
    <div
      style={{
        backgroundColor: Colors.background,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
      }}
    >
      {/* Logo */}
      <img
        src="/logo.svg"
        alt="App Logo"
        style={{ width: 400, height: 200 }}
      />

      {/* Connect Wallet Button */}
      <button
        onClick={handleConnectWallet}
        style={{
          backgroundColor: Colors.textSecondary,
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          fontSize: 18,
          fontWeight: 'bold',
          borderRadius: 8,
          cursor: 'pointer',
        }}
      >
        Connect Wallet
      </button>
    </div>
  );
}
