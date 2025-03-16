import { configureStore } from '@reduxjs/toolkit';
import cartReducer, {
  addToCart,
  removeFromCart,
  fetchCart,
} from '../slices/cartSlice';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

// Declare Axios variable
let mockedAxios: jest.Mocked<typeof import('axios').default>;

// Mock Axios
beforeAll(async () => {
  const axiosModule = await import('axios');
  jest.mock('axios');
  mockedAxios = axiosModule.default as jest.Mocked<typeof axiosModule.default>;
});

// Setup Redux store
const setupStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  });
};

type AppDispatch = ThunkDispatch<{ cart: any }, void, AnyAction>;

describe('Cart Redux Slice', () => {
  let store: ReturnType<typeof setupStore>;
  let dispatch: AppDispatch;

  beforeEach(() => {
    store = setupStore();
    dispatch = store.dispatch as AppDispatch;
    jest.clearAllMocks();
  });

  it('should add an item to the cart when addToCart is dispatched', async () => {
    const productId = '123';
    const mockCartData = [
      {
        productId: { _id: '123', name: 'Test Product', price: 100 },
        quantity: 1,
      },
    ];

    mockedAxios.post.mockResolvedValueOnce({ data: mockCartData });
    mockedAxios.get.mockResolvedValueOnce({ data: mockCartData });

    await dispatch(addToCart({ productId, quantity: 1 }));

    const state = store.getState().cart;
    expect(state.items).toHaveLength(1);
    expect(state.items[0].productId.name).toBe('Test Product');
    expect(state.items[0].quantity).toBe(1);
    expect(state.total).toBe(100);
  });

  it('should remove an item from the cart and fetch the updated cart', async () => {
    const productId = '123';
    const initialCartData = [
      {
        productId: { _id: '123', name: 'Test Product', price: 100 },
        quantity: 1,
      },
    ];
    const updatedCartData: any[] = [];

    // Mock initial cart fetch
    mockedAxios.get.mockResolvedValueOnce({ data: initialCartData });
    await dispatch(fetchCart());

    let state = store.getState().cart;
    expect(state.items).toHaveLength(1);

    // Remove Mock
    mockedAxios.post.mockResolvedValueOnce({ data: updatedCartData });
    await dispatch(removeFromCart(productId));

    // Mock empty cart after removal
    mockedAxios.get.mockResolvedValueOnce({ data: updatedCartData });
    await dispatch(fetchCart());

    state = store.getState().cart;
    expect(state.items).toHaveLength(0);
    expect(state.total).toBe(0);
  });
});
