import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { CartItem } from '../../types';

interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: CartState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
};

const API_URL = process.env.REACT_APP_API_URL;

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/cart`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch cart.',
      );
    }
  },
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (
    { productId, quantity }: { productId: string; quantity: number },
    { dispatch, rejectWithValue },
  ) => {
    try {
      await axios.post(`${API_URL}/cart`, {
        productId,
        quantity,
      });
      dispatch(fetchCart());
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add item to cart.',
      );
    }
  },
);

export const updateCartQuantity = createAsyncThunk(
  'cart/updateCartQuantity',
  async (
    { productId, quantity }: { productId: string; quantity: number },
    { dispatch, rejectWithValue },
  ) => {
    try {
      await axios.put(`${API_URL}/cart`, { productId, quantity });
      dispatch(fetchCart());
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update cart quantity.',
      );
    }
  },
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (cartId: string, { dispatch, rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/cart/${cartId}`);
      dispatch(fetchCart());
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to remove item from cart.',
      );
    }
  },
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.total = state.items.reduce(
          (sum, item) => sum + item.productId.price * item.quantity,
          0,
        );
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default cartSlice.reducer;
