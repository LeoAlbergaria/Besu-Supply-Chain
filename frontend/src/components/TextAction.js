import { Colors, Metrics } from '../styles';

const TextAction = ({ onClick, children }) => {
  return (
    <span
      onClick={onClick}
      style={{
        color: Colors.textSecondary,
        fontWeight: 'bold',
        cursor: 'pointer',
      }}
    >
      {children}
    </span>
  );
};

export default TextAction;