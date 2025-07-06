import { FiSearch } from 'react-icons/fi';
import { Colors, Metrics } from '../../styles';
import './SearchBar.css';

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: Colors.backgroundSecondary,
        borderRadius: Metrics.radius.standard,
        padding: `${Metrics.padding.small}px ${Metrics.padding.standard}px`
      }}
    >
      <FiSearch color={Colors.textSecondary} size={20} style={{ marginRight: Metrics.padding.small }} />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="searchbar-input"
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          backgroundColor: 'transparent',
          fontSize: 16,
          color: Colors.textMain,
        }}
      />
    </div>
  );
}
