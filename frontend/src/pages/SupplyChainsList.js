import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar/SearchBar.js';
import TextAction from '../components/TextAction.js';
import Header from '../components/Header.js';
import Title from '../components/Title.js';
import { Colors, Metrics } from '../styles';

export default function SupplyChainsList() {
  const [search, setSearch] = useState('');

  const supplyChains = [
    { productType: 'Electronics', address: '0x1234sdlkjfahdlfkjadhflakjdsfhjadslfabcd', productCount: 18 },
    { productType: 'Pharmaceuticals', address: '0x98764345243523452345efgh', productCount: 34 },
    { productType: 'Food', address: '0xabcd234523452345245223454321', productCount: 12 },
  ];

  const filtered = supplyChains.filter(chain =>
    chain.productType.toLowerCase().includes(search.toLowerCase())
  );

  const navigate = useNavigate();

  const handleViewDetails = (chain) => {
    navigate(`/supplychain/${chain.address}`, {
      state: { chain },
    });
  };

  const handleViewEvents = (chain) => {
    navigate(`/events/${chain.address}`, {
      state: { chain },
    });
  };

  return (
    <>
      <Header />
      <div style={{ padding: '20px 160px', backgroundColor: Colors.background, minHeight: '100vh' }}>
        {/* H1Group */}
        <div style={{ padding: Metrics.padding.standard }}>
          <Title
            title="Supply Chains"
          />
        </div>

        {/* SearchBarGroup */}
        <div style={{ padding: Metrics.padding.standard }}>
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product type"
          />
        </div>

        {/* TableGroup */}
        <div style={{ padding: Metrics.padding.standard }}>
          <table className="app-table">
            <thead>
              <tr>
                <th>Product Type</th>
                <th>Address</th>
                <th># of Products</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((chain, idx) => (
                <tr key={idx}>
                  <td>{chain.productType}</td>
                  <td>{chain.address}</td>
                  <td>{chain.productCount}</td>
                  <td>
                    <div style={{ display: 'flex', gap: Metrics.padding.standard }}>
                      <TextAction onClick={() => handleViewDetails(chain)}>
                        View Products
                      </TextAction>
                      <TextAction onClick={() => handleViewEvents(chain)}>
                        View Events
                      </TextAction>
                    </div>
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