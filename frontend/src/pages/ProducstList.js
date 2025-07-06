import { useParams } from 'react-router-dom';

export default function ProductsList() {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Items in Supply Chain</h1>
      <p className="text-sm text-gray-500">Showing items for supply chain ID: {id}</p>
    </div>
  );
}