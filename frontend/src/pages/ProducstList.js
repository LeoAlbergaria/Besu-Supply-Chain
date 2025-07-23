import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation, useParams } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import SearchBar from '../components/SearchBar/SearchBar.js';
import TextAction from '../components/TextAction.js';
import { Colors, Metrics } from '../styles';
import Header from '../components/Header.js';
import Title from '../components/Title.js';


export default function ProductsList() {
  const [search, setSearch] = useState('');

  const { state } = useLocation();
  const { chain } = state || {};

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const products = [
    {
      name: 'Organic Coffee Beans',
      id: 'PROD-12345',
      status: 'Active',
      updatedAt: '2024-01-15',
    },
    {
      name: 'Sustainable Cotton',
      id: 'PROD-67890',
      status: 'In Transit',
      updatedAt: '2024-01-20',
    },
    {
      name: 'Recycled Plastic Packaging',
      id: 'PROD-11223',
      status: 'Delivered',
      updatedAt: '2024-01-25',
    },
    {
      name: 'Fair Trade Cocoa',
      id: 'PROD-33445',
      status: 'Active',
      updatedAt: '2024-01-30',
    },
    {
      name: 'Ethically Sourced Leather',
      id: 'PROD-55667',
      status: 'Pending',
      updatedAt: '2024-02-05',
    },
  ];

  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewDetails = (product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <>
      <Header />
      <div style={{ padding: '20px 160px', backgroundColor: Colors.background, minHeight: '100vh' }}>
        {/* Header */}
        {/* Back icon only, aligned left */}
        <div onClick={handleBack} style={{ marginBottom: 16, cursor: 'pointer' }}>
          <FiChevronLeft size={32} />
        </div>

        <div style={{ padding: Metrics.padding.standard }}>
          <Title
            title="Supply Chain Products"
            subtitle={chain.productType}
            description="View and manage the products within this supply chain."
          />
        </div>

        {/* Search */}
        <div style={{ padding: Metrics.padding.standard }}>
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products"
          />
        </div>

        {/* Table */}
        <div style={{ padding: Metrics.padding.standard }}>
          <table className="app-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Product ID</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, idx) => (
                <tr key={idx} style={{ borderBottom: `1px solid ${Colors.border}` }}>
                  <td style={{ padding: 12 }}>{product.name}</td>
                  <td style={{ padding: 12, color: Colors.textSecondary, fontWeight: 500 }}>{product.id}</td>
                  <td style={{ padding: 12 }}>{product.updatedAt}</td>
                  <td style={{ padding: 12 }}>
                    <TextAction onClick={() => handleViewDetails(product)}>
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
