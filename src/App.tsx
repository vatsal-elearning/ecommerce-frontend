import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from 'flowbite-react';
import ErrorToast from './ErrorToast';
import LoadingFallback from './LoadingFallback';

interface IProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
}

// Use environment variable
const API_URL = process.env.REACT_APP_API_URL;

const App = () => {
  const [error, setError] = useState(null);
  const [loading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get(`${API_URL}/product/list`);
        if (!response) throw new Error('Failed to fetch');
        const data = response.data?.data || [];
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) {
    return <LoadingFallback />;
  }

  if (error) {
    return <ErrorToast message={error} onClose={() => setError(null)} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      {products.map((product) => (
        <Card key={product._id} className="flex-col p-2 max-w-sm">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg"
          />
          <h5 className="text-xl font-bold">{product.name}</h5>
          <p className="text-lg font-semibold text-gray-700">
            ${product.price}
          </p>
          <button className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg">
            Add to Cart
          </button>
        </Card>
      ))}
    </div>
  );
};

export default App;
