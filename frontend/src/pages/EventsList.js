import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import SearchBar from '../components/SearchBar/SearchBar.js';
import TextAction from '../components/TextAction.js';
import { Colors, Metrics } from '../styles';
import Header from '../components/Header.js';
import Title from '../components/Title.js';

export default function EventsList() {
  const [search, setSearch] = useState('');

  const { state } = useLocation();
  const { chain } = state || {};

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleViewDetails = (event) => {
    navigate(`/event/${event.id}`, { state: { event } });
  };

  const events = [
  {
    address: '0x111aaa',
    type: 'Created',
    time: '2024-01-10 09:00',
    organization: 'Company A',
  },
  {
    address: '0x222bbb',
    type: 'Processed',
    time: '2024-01-12 11:30',
    organization: 'Company B',
  },
  {
    address: '0x333ccc',
    type: 'Shipped',
    time: '2024-01-13 14:00',
    organization: 'Company C',
  },
  {
    address: '0x444ddd',
    type: 'Delivered',
    time: '2024-01-15 16:45',
    organization: 'Company D',
  },
  {
    address: '0x555eee',
    type: 'Inspected',
    time: '2024-01-17 08:30',
    organization: 'Company A',
  },
];

  const filtered = events.filter(event =>
    event.type.toLowerCase().includes(search.toLowerCase()) ||
    event.organization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header />
      <div style={{ padding: '20px 160px', backgroundColor: Colors.background, minHeight: '100vh' }}>
        {/* Back Button */}
        <div onClick={handleBack} style={{ marginBottom: 16, cursor: 'pointer' }}>
          <FiChevronLeft size={32} />
        </div>

        {/* Title */}
        <div style={{ padding: Metrics.padding.standard }}>
          <Title
            title="Supply Chain Events"
            subtitle={chain?.productType}
            description="Track all events related to your company within the selected supply chain."
          />
        </div>

        {/* Search */}
        <div style={{ padding: Metrics.padding.standard }}>
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by type or organization"
          />
        </div>

        {/* Events Table */}
        <div style={{ padding: Metrics.padding.standard }}>
          <table className="app-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Type</th>
                <th>Time</th>
                <th>Organization</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((event, idx) => (
                <tr key={idx} style={{ borderBottom: `1px solid ${Colors.border}` }}>
                  <td style={{ padding: 12 }}>{event.address}</td>
                  <td style={{ padding: 12 }}>{event.type}</td>
                  <td style={{ padding: 12 }}>{event.time}</td>
                  <td style={{ padding: 12 }}>{event.organization}</td>
                  <td style={{ padding: 12 }}>
                    <TextAction onClick={() => handleViewDetails(event)}>
                      View Details
                    </TextAction>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
