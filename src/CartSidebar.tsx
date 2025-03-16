import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from './redux/store';
import {
  updateCartQuantity,
  removeFromCart,
  fetchCart,
} from './redux/slices/cartSlice';
import { ToastType } from './constants';
import CustomToast from './components/CustomToast';
import { CartItem } from './types';

const CartSidebar = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [alert, setAlert] = useState<{
    type: ToastType;
    message: string | null;
  }>({
    type: ToastType.ERROR,
    message: null,
  });
  const { items, total, loading } = useSelector(
    (state: RootState) => state.cart,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQty = (item: CartItem, type: string) => {
    dispatch(
      updateCartQuantity({
        productId: item.productId._id,
        quantity:
          type === 'add'
            ? item.quantity + 1
            : item.quantity > 1
              ? item.quantity - 1
              : 1,
      }),
    )
      .unwrap()
      .then(() => {
        setAlert({
          type: ToastType.SUCCESS,
          message: 'Item qty changed successfully.',
        });
      })
      .catch((err: any) => {
        setAlert({ type: ToastType.ERROR, message: err });
      });
  };

  const handleRemove = (item: CartItem) => {
    if (window.confirm('Are you sure want to remove this item?')) {
      dispatch(removeFromCart(item._id));
      setAlert({
        type: ToastType.SUCCESS,
        message: 'Item removed from cart successfully.',
      });
    }
  };

  return (
    <>
      {alert.message && (
        <CustomToast
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: ToastType.ERROR, message: null })}
        />
      )}
      <div
        className={`fixed z-10 top-0 right-0 w-80 h-full bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform`}
      >
        <button className="absolute top-2 right-2" onClick={onClose}>
          X
        </button>
        <h2 className="text-lg font-bold p-4">Cart</h2>
        {loading && <p>Loading...</p>}
        {items.length === 0 ? (
          <p className="px-4">Your cart is empty.</p>
        ) : (
          <div className="p-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center border-b py-2"
              >
                <span>
                  {item.productId.name} ({item.quantity})
                </span>
                <div>
                  <button
                    className="px-2"
                    disabled={item.quantity === 5 ? true : false}
                    onClick={() => handleQty(item, 'add')}
                  >
                    +
                  </button>
                  <button
                    className="px-2"
                    disabled={item.quantity === 1 ? true : false}
                    onClick={() => handleQty(item, 'remove')}
                  >
                    -
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => handleRemove(item)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="px-4 mt-4 text-lg font-bold">Total: ${total}</div>
      </div>
    </>
  );
};

export default CartSidebar;
