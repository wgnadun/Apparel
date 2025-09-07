import { createAuthenticatedApi } from './api';

// Cart service that works with Auth0
export class CartService {
  constructor(getAccessTokenSilently) {
    this.api = createAuthenticatedApi(getAccessTokenSilently);
  }

  async addToCart(userId, productId, quantity) {
    const response = await this.api.post('/shop/cart/add', {
      userId,
      productId,
      quantity,
    });
    return response.data;
  }

  async fetchCartItems(userId) {
    const response = await this.api.get(`/shop/cart/get/${userId}`);
    return response.data;
  }

  async deleteCartItem(userId, productId) {
    const response = await this.api.delete(`/shop/cart/${userId}/${productId}`);
    return response.data;
  }

  async updateCartQuantity(userId, productId, quantity) {
    const response = await this.api.put('/shop/cart/update-cart', {
      userId,
      productId,
      quantity,
    });
    return response.data;
  }
}
