import React from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from './redux/store';
import { updateCartQuantity, removeFromCart } from './redux/slices/cartSlice';

const CartSidebar = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useAppDispatch();

  return (
    <div
      className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform`}
    >
      <button className="absolute top-2 right-2" onClick={onClose}>
        X
      </button>
      <h2 className="text-lg font-bold p-4">Cart</h2>
      <div className="p-4">
        {cartItems.map((item) => (
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
                onClick={() =>
                  dispatch(
                    updateCartQuantity({
                      cartId: item._id,
                      quantity: item.quantity + 1,
                    }),
                  )
                }
              >
                +
              </button>
              <button
                className="px-2"
                onClick={() =>
                  dispatch(
                    updateCartQuantity({
                      cartId: item._id,
                      quantity: item.quantity - 1,
                    }),
                  )
                }
              >
                -
              </button>
              <button
                className="text-red-500"
                onClick={() => dispatch(removeFromCart(item._id))}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartSidebar;
