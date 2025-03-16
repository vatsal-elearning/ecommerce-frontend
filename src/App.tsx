import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card } from 'flowbite-react';
import CustomToast from './components/CustomToast';
import LoadingFallback from './components/LoadingFallback';
import CartSidebar from './CartSidebar';
import { useAppDispatch } from './redux/store';
import { addToCart } from './redux/slices/cartSlice';
import { ToastType } from './constants';

interface IProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
}

// Use environment variable
const API_URL = process.env.REACT_APP_API_URL;

const App = () => {
  const [isCartOpen, setCartOpen] = useState(false);
  const [alert, setAlert] = useState<{
    type: ToastType;
    message: string | null;
  }>({
    type: ToastType.ERROR,
    message: null,
  });
  const [loading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<IProduct[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get(`${API_URL}/product/list`);
        if (!response) throw new Error('Failed to fetch');
        const data = response.data?.data || [];
        setProducts(data);
      } catch (err: any) {
        setAlert({ type: ToastType.ERROR, message: err.message });
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleAddToCart = (productId: string) => {
    dispatch(addToCart({ productId, quantity: 1 }))
      .unwrap()
      .then(() => {
        setAlert({
          type: ToastType.SUCCESS,
          message: 'Item added to cart successfully.',
        });
      })
      .catch((err: any) => {
        setAlert({ type: ToastType.ERROR, message: err });
      });
  };

  if (loading) {
    return <LoadingFallback />;
  }

  return (
    <>
      {alert.message && (
        <CustomToast
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: ToastType.ERROR, message: null })}
        />
      )}
      {products.length > 0 && (
        <>
          <CartSidebar isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
          <div className="flex justify-start p-4">
            <Button
              color="primary"
              title={`${isCartOpen ? 'Close' : 'View'} Cart`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg"
              onClick={() => setCartOpen(!isCartOpen)}
            >
              {`${isCartOpen ? 'Close' : 'View'} Cart`}
            </Button>
          </div>
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
                <Button
                  color="primary"
                  title="Add to Cart"
                  className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg"
                  onClick={() => handleAddToCart(product._id)}
                >
                  Add to Cart
                </Button>
              </Card>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default App;
