import { Colors, Metrics } from '../styles';

export default function Title({ title, subtitle, description }) {
  return (
    <div>
      <div>
        <h1 style={{ fontWeight: 'bold', margin: 0, color: Colors.textMain }}>
          {title}
        </h1>
        {subtitle && (
          <h1 style={{ fontWeight: 'normal', margin: 0, color: Colors.textMain }}>
            {subtitle}
          </h1>
        )}
      </div>

      {description && (
        <p style={{ fontSize: 16, color: Colors.textSecondary, marginTop: Metrics.padding.standard }}>
          {description}
        </p>
      )}
    </div>
  );
}