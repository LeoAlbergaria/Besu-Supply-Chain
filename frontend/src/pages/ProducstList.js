import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useLocation, useParams } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import SearchBar from '../components/SearchBar/SearchBar.js';
import TextAction from '../components/TextAction.js';
import { Colors, Metrics } from '../styles';
import Header from '../components/Header.js';
import Title from '../components/Title.js';

import { ethers } from "ethers";

import SupplyChainArtifact from '../artifacts/contracts/SupplyChain.sol/SupplyChain.json';
import ProductArtifact from '../artifacts/contracts/Product.sol/Product.json';

export default function ProductsList() {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);

  const { state } = useLocation();
  const { chain } = state || {};

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (!chain?.address || !window.ethereum) return;

    const loadProducts = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const supplyChain = new ethers.Contract(chain.address, SupplyChainArtifact.abi, signer);
        const productAddresses = await supplyChain.getDeployedProducts();

        const loaded = await Promise.all(
          productAddresses.map(async (addr) => {
            try {
              const product = new ethers.Contract(addr, ProductArtifact.abi, signer);
              const name = await product.getName();
              // const id = await product.getId(); // requires you to expose getId()'
              const id = 1
              return {
                name,
                id,
                address: addr,
                updatedAt: '-', // TODO: if you want to track this
              };
            } catch (err) {
              console.error("Failed to load product at", addr, err);
              return null;
            }
          })
        );

        setProducts(loaded.filter(Boolean));
      } catch (err) {
        console.error("Failed to load products:", err);
      }
    };

    loadProducts();
  }, [chain?.address]);

  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewDetails = (product) => {
    navigate(`/product/${product.address}`);
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
                <th>Address</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, idx) => (
                <tr key={idx} style={{ borderBottom: `1px solid ${Colors.border}` }}>
                  <td style={{ padding: 12 }}>{product.name}</td>
                  <td style={{ padding: 12, color: Colors.textSecondary, fontWeight: 500 }}>{product.id}</td>
                  <td style={{ padding: 12 }}>{product.address}</td>
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
