import { Routes, Route } from 'react-router-dom';
import SupplyChainsList from '../pages/SupplyChainsList';
import ProducstList from '../pages/ProducstList';
import ProductDetails from '../pages/ProductDetails';
import EventsList from '../pages/EventsList';
import EventDetails from '../pages/EventDetails';
import Login from '../pages/Login';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<SupplyChainsList />} />
      <Route path="/supplychain/:id" element={<ProducstList />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/events/:id" element={<EventsList />} />
      <Route path="/event/:id" element={<EventDetails />} />
    </Routes>
  );
}