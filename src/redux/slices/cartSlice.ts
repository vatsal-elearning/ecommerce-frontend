import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
}

interface CartItem {
  _id: string;
  productId: Product;
  quantity: number;
}

const API_URL = process.env.REACT_APP_API_URL;

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/cart`);
      return response.data;
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
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.post(`${API_URL}/cart`, {
        productId,
        quantity,
      });
      const productResponse = await axios.get(
        `${API_URL}/product/${productId}`,
      );
      return {
        _id: response.data._id,
        productId: productResponse.data,
        quantity: response.data.quantity,
      } as CartItem;
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
    { cartId, quantity }: { cartId: string; quantity: number },
    { rejectWithValue },
  ) => {
    try {
      await axios.put(`${API_URL}/cart`, { cartId, quantity });
      return { cartId, quantity };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update cart quantity.',
      );
    }
  },
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (cartId: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/cart/${cartId}`);
      return cartId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to remove item from cart.',
      );
    }
  },
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [] as CartItem[],
    loading: false,
    error: null as string | null, // Add error state
  },
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
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const newItem = action.payload as CartItem;

        const existingItem = state.items.find(
          (i) => i.productId._id === newItem.productId._id,
        );
        if (existingItem) {
          existingItem.quantity += newItem.quantity;
        } else {
          state.items.push(newItem);
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Update Cart Quantity
      .addCase(updateCartQuantity.pending, (state) => {
        state.error = null;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        const item = state.items.find((i) => i._id === action.payload.cartId);
        if (item) {
          item.quantity = action.payload.quantity;
        }
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i._id !== action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default cartSlice.reducer;
