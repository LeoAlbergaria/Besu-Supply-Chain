import { useState } from 'react';
import SearchBar from '../components/SearchBar/SearchBar.js';

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

  return (
    <div style={{ padding: '20px 160px' }}>
      {/* H1Group */}
      <div style={{ padding: 16 }}>
        <h1 style={{ fontSize: 32, fontWeight: 'bold', margin: 0 }}>
          Supply Chains
        </h1>
      </div>

      {/* SearchBarGroup */}
      <div style={{ padding: 16 }}>
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by product type"
        />
      </div>

      {/* TableGroup */}
      <div style={{ padding: 16 }}>
        <table className="app-table">
          <thead>
            <tr>
              <th>Product Type</th>
              <th>Address</th>
              <th># of Products</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((chain, idx) => (
              <tr key={idx}>
                <td>{chain.productType}</td>
                <td>{chain.address}</td>
                <td>{chain.productCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}