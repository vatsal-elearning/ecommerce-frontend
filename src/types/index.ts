export interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
}

export interface CartItem {
  _id: string;
  productId: Product;
  quantity: number;
}
