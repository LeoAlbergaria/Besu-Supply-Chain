import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import {
  FiPlus,
  FiTruck,
  FiHome,
  FiArchive,
  FiCheck,
  FiPackage,
  FiMapPin,
  FiUpload,
  FiDownload,
  FiAlertCircle,
  FiSend,
} from 'react-icons/fi';
import { Colors, Metrics } from '../styles';
import Header from '../components/Header.js';
import Title from '../components/Title.js';

// Mapeamento de ícones por nome
const iconMap = {
  FiPlus: <FiPlus />,
  FiTruck: <FiTruck />,
  FiHome: <FiHome />,
  FiArchive: <FiArchive />,
  FiCheck: <FiCheck />,
  FiPackage: <FiPackage />,
  FiMapPin: <FiMapPin />,
  FiUpload: <FiUpload />,
  FiDownload: <FiDownload />,
  FiAlertCircle: <FiAlertCircle />,
  FiSend: <FiSend />,
};

// Dados mock com ícones como strings
const mockData = {
  productName: 'Organic Coffee Beans',
  timeline: [
    {
      company: 'Company 1',
      timestamp: 'July 15, 2024, 10:00 AM',
      events: [
        { name: 'Batch Created', icon: 'FiPlus', timestamp: 'July 15, 2024, 10:00 AM' },
        { name: 'Shipped to Warehouse', icon: 'FiTruck', timestamp: 'July 16, 2024, 2:00 PM' },
        { name: 'Stored in Warehouse', icon: 'FiArchive', timestamp: 'July 18, 2024, 9:00 AM' },
        { name: 'Quality Checked', icon: 'FiCheck', timestamp: 'July 19, 2024, 11:00 AM' },
        { name: 'Ready for Dispatch', icon: 'FiPackage', timestamp: 'July 20, 2024, 1:00 PM' },
      ]
    },
    {
      company: 'Company 2',
      timestamp: 'July 21, 2024, 9:00 AM',
      events: [
        { name: 'Received from Supplier', icon: 'FiDownload', timestamp: 'July 21, 2024, 9:00 AM' },
        { name: 'Processing Started', icon: 'FiUpload', timestamp: 'July 21, 2024, 11:30 AM' },
        { name: 'Processing Completed', icon: 'FiCheck', timestamp: 'July 22, 2024, 2:00 PM' },
        { name: 'Location Updated', icon: 'FiMapPin', timestamp: 'July 22, 2024, 5:00 PM' },
      ]
    },
    {
      company: 'Company 3',
      timestamp: 'July 23, 2024, 10:00 AM',
      events: [
        { name: 'Dispatched to Retailer', icon: 'FiSend', timestamp: 'July 23, 2024, 10:00 AM' },
        { name: 'Arrival Delayed', icon: 'FiAlertCircle', timestamp: 'July 24, 2024, 7:00 AM' },
      ]
    },
    {
      company: 'Company 4',
      timestamp: 'July 25, 2024, 3:00 PM',
      events: [
        { name: 'Product Received', icon: 'FiDownload', timestamp: 'July 25, 2024, 3:00 PM' },
        { name: 'Final Quality Check', icon: 'FiCheck', timestamp: 'July 26, 2024, 9:00 AM' },
      ]
    },
    {
      company: 'Company 5',
      timestamp: 'July 27, 2024, 10:00 AM',
      events: [
        { name: 'Placed on Shelf', icon: 'FiPackage', timestamp: 'July 27, 2024, 10:00 AM' },
        { name: 'Sold to Customer', icon: 'FiSend', timestamp: 'July 28, 2024, 12:30 PM' },
      ]
    },
  ]
};

export default function ProductDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product || mockData;

  const [openCompanies, setOpenCompanies] = useState({});

  const toggleCompany = (companyName) => {
    setOpenCompanies((prev) => ({
      ...prev,
      [companyName]: !prev[companyName],
    }));
  };

  const handleViewDetails = (event) => {
    const { icon, ...eventWithoutIcon } = event;
    navigate(`/event/${event.name}`, { state: { event: eventWithoutIcon } });
  };

  return (
    <>
      <Header />
      <div style={{ padding: '20px 160px', backgroundColor: Colors.background, minHeight: '100vh' }}>
        {/* Back Button */}
        <div onClick={() => navigate(-1)} style={{ marginBottom: 16, cursor: 'pointer' }}>
          <FiChevronLeft size={32} />
        </div>

        <div style={{ padding: Metrics.padding.standard }}>
          <Title
            title="Product Details"
            subtitle={product.productName}
            description="View detailed information about the selected product."
          />
        </div>

        {/* Timeline */}
        <div style={{ padding: Metrics.padding.standard }}>
          <h3 style={{ fontWeight: 'bold', color: Colors.textMain }}>Product Timeline</h3>

          <div style={{ marginTop: 16, borderLeft: `2px solid ${Colors.border}`, paddingLeft: 16 }}>
            {product.timeline.map((entry, index) => (
              <div key={index} style={{ marginBottom: 24 }}>
                <div onClick={() => toggleCompany(entry.company)}>
                  <div
                    style={{ cursor: 'pointer', display: 'flex', gap: 8, alignItems: 'center' }}
                  >
                    <FiHome size={16} color={Colors.textMain} />
                    <span style={{ fontWeight: '600', color: Colors.textMain }}>{entry.company}</span>
                  </div>
                  <div style={{ marginLeft: 24, color: Colors.textSecondary, fontSize: 14 }}>
                    {entry.timestamp}
                  </div>
                </div>

                {openCompanies[entry.company] && entry.events.length > 0 && (
                  <div style={{ marginTop: 12, marginLeft: 32, borderLeft: `1px solid ${Colors.border}` }}>
                    {entry.events.map((event, idx) => (
                      <div key={idx} style={{ paddingLeft: 16, marginBottom: 16 }} onClick={() => handleViewDetails(event)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {iconMap[event.icon]}
                          <span style={{ fontWeight: 500, color: Colors.textMain }}>{event.name}</span>
                        </div>
                        <div style={{ color: Colors.textSecondary, fontSize: 14 }}>
                          {event.timestamp}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
