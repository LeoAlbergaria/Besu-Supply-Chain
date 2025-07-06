import { Routes, Route } from 'react-router-dom';
import SupplyChainsList from '../pages/SupplyChainsList';
import ProducstList from '../pages/ProducstList';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SupplyChainsList />} />
      <Route path="/supplychain/:id" element={<ProducstList />} />
    </Routes>
  );
}