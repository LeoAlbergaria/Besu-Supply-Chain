import { useLocation, useNavigate } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import Header from '../components/Header';
import Title from '../components/Title';
import { Colors, Metrics } from '../styles';

export default function EventDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const event = state?.event;

  const handleBack = () => {
    navigate(-1);
  };

  if (!event) {
    return (
      <div style={{ padding: 32 }}>
        <p>Event not found.</p>
      </div>
    );
  }

  // Safely parse event.jsonEvent (may be a JSON string or already an object)
  const parsedPayload = (() => {
    const payload = event.jsonEvent ?? event.payload ?? event.data;
    if (payload == null) return null;

    if (typeof payload === 'string') {
      try {
        return JSON.parse(payload);
      } catch {
        // Not valid JSON, return raw string
        return payload;
      }
    }
    // Already an object/array/etc.
    return payload;
  })();

  const prettyPayload =
    typeof parsedPayload === 'string'
      ? parsedPayload
      : JSON.stringify(parsedPayload, null, 2);

  return (
    <>
      <Header />
      <div
        style={{
          padding: '20px 160px',
          backgroundColor: Colors.background,
          minHeight: '100vh',
        }}
      >
        {/* Back Button */}
        <div onClick={handleBack} style={{ marginBottom: 16, cursor: 'pointer' }}>
          <FiChevronLeft size={32} />
        </div>

        {/* Title */}
        <div style={{ padding: Metrics.padding.standard }}>
          <Title
            title="Event Details"
            subtitle={event.typeEvent || event.type || 'EPCIS Event'}
            description={
              `Organization: ${event.orgAdress ?? '—'}`
              + (event.timeEvent ? ` • Time: ${event.timeEvent}` : '')
            }
          />
        </div>

        {/* JSON Block */}
        <div
          style={{
            padding: Metrics.padding.standard,
            backgroundColor: Colors.backgroundSecondary,
            borderRadius: 8,
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            fontSize: 14,
            color: Colors.textMain,
            wordBreak: 'break-word',
          }}
        >
          {prettyPayload || 'No payload for this event.'}
        </div>
      </div>
    </>
  );
}
