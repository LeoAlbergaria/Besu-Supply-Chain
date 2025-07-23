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
            subtitle={event.type || 'EPCIS Event'}
            description="View detailed information about the selected event."
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
          }}
        >
          {JSON.stringify(
            {
              eventTime: "2025-03-19T12:00:00Z",
              eventTimeZoneOffset: "+00:00",
              epcList: ["urn:epc:id:sgtin:0614141.107346.2017"],
              bizStep: "urn:epcglobal:cbv:bizstep:shipping",
              disposition: "urn:epcglobal:cbv:disp:in_transit",
              readPoint: { id: "urn:epc:id:sgln:0614141.07346.1234" },
              bizLocation: { id: "urn:epc:id:sgln:0614141.07346.0" },
              bizTransactionList: [
                {
                  type: "urn:epcglobal:cbv:btt:po",
                  id: "http://transaction.acme.com/po/12345678",
                },
              ],
            },
            null,
            2
          )}
        </div>
      </div>
    </>
  );
}
