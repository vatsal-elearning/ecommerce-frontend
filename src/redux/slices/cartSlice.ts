import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Use environment variable
const API_URL = process.env.REACT_APP_API_URL;

interface CartItem {
  _id: string;
  productId: { _id: string; name: string; price: number; image: string };
  quantity: number;
}

interface CartState {
  items: CartItem[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CartState = {
  items: [],
  status: 'idle',
};

// Fetch Cart Items
export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const response = await axios.get(`${API_URL}/cart`);
  return response.data;
});

// Add Item to Cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (productId: string) => {
    const response = await axios.post(`${API_URL}/cart`, {
      productId,
    });
    return response.data;
  },
);

// Update Quantity
export const updateCartQuantity = createAsyncThunk(
  'cart/updateCartQuantity',
  async ({ productId, quantity }: { productId: string; quantity: number }) => {
    const response = await axios.put(`${API_URL}/cart`, {
      productId,
      quantity,
    });
    return response.data;
  },
);

// Remove Item
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId: string) => {
    await axios.delete(`${API_URL}/cart`, {
      data: { productId },
    });
    return productId;
  },
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'idle';
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const existingItem = state.items.find(
          (item) => item.productId._id === action.payload.productId,
        );
        if (existingItem) {
          existingItem.quantity = action.payload.quantity;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        const item = state.items.find(
          (item) => item.productId._id === action.payload.productId,
        );
        if (item) {
          item.quantity = action.payload.quantity;
        }
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item.productId._id !== action.payload,
        );
      });
  },
});

export default cartSlice.reducer;
