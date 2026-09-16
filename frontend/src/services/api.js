const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== 'undefined' && window.location.hostname) {
    return `http://${window.location.hostname}:5000/api`;
  }
  return 'http://localhost:5000/api';
};

class ApiService {
  constructor() {
    this._baseUrl = null;
  }

  get baseUrl() {
    return getApiUrl();
  }

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('rc_token');
    }
    return null;
  }

  setToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rc_token', token);
    }
  }

  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rc_token');
    }
  }

  async request(endpoint, options = {}) {
    const { method = 'GET', body, isFormData = false } = options;
    const headers = {};

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const config = {
      method,
      headers,
    };

    if (body) {
      config.body = isFormData ? body : JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  }

  // Auth
  async register(userData) {
    const data = await this.request('/auth/register', { method: 'POST', body: userData });
    if (data.token) this.setToken(data.token);
    return data;
  }

  async login(credentials) {
    const data = await this.request('/auth/login', { method: 'POST', body: credentials });
    if (data.token) this.setToken(data.token);
    return data;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async updateProfile(data) {
    return this.request('/auth/profile', { method: 'PUT', body: data });
  }

  async changePassword(data) {
    return this.request('/auth/change-password', { method: 'PUT', body: data });
  }

  async addAddress(address) {
    return this.request('/auth/address', { method: 'POST', body: address });
  }

  async deleteAddress(addressId) {
    return this.request(`/auth/address/${addressId}`, { method: 'DELETE' });
  }

  logout() {
    this.removeToken();
  }

  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/products?${query}`);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  // Categories
  async getCategories() {
    return this.request('/categories');
  }

  // Services
  async getServices() {
    return this.request('/services');
  }

  async getService(slug) {
    return this.request(`/services/${slug}`);
  }

  // Cart
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(productId, quantity = 1) {
    return this.request('/cart', { method: 'POST', body: { productId, quantity } });
  }

  async updateCartItem(itemId, quantity) {
    return this.request(`/cart/${itemId}`, { method: 'PUT', body: { quantity } });
  }

  async removeFromCart(itemId) {
    return this.request(`/cart/${itemId}`, { method: 'DELETE' });
  }

  // Orders
  async createOrder(orderData) {
    return this.request('/orders', { method: 'POST', body: orderData });
  }

  async getMyOrders(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/orders?${query}`);
  }

  async getOrder(orderId) {
    return this.request(`/orders/${orderId}`);
  }

  async trackOrder(orderId) {
    return this.request(`/orders/track/${orderId}`);
  }

  async cancelOrder(orderId, reason) {
    return this.request(`/orders/${orderId}/cancel`, { method: 'PUT', body: { reason } });
  }

  // Repairs
  async submitRepair(repairData) {
    return this.request('/repairs', { method: 'POST', body: repairData });
  }

  async trackRepair(requestId) {
    return this.request(`/repairs/track/${requestId}`);
  }

  async getMyRepairs() {
    return this.request('/repairs/my');
  }

  // Coupons
  async validateCoupon(code, orderTotal) {
    return this.request('/coupons/validate', { method: 'POST', body: { code, orderTotal } });
  }

  // Banners
  async getBanners() {
    return this.request('/banners');
  }

  // Reviews
  async getProductReviews(productId) {
    return this.request(`/reviews/product/${productId}`);
  }

  async submitReview(reviewData) {
    return this.request('/reviews', { method: 'POST', body: reviewData });
  }

  // Contact
  async submitContact(formData) {
    return this.request('/contact', { method: 'POST', body: formData });
  }

  // Admin
  async getDashboardStats() {
    return this.request('/admin/dashboard');
  }

  async getDashboardStats() {
    return this.request('/admin/dashboard');
  }

  async getFinanceOverview() {
    return this.request('/admin/finance');
  }

  async getAnalytics() {
    return this.request('/admin/analytics');
  }

  async getAllOrders(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/orders/admin/all?${query}`);
  }

  async updateOrderStatus(orderId, status, note) {
    return this.request(`/orders/${orderId}/status`, { method: 'PUT', body: { status, note } });
  }

  async getAllRepairs(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/repairs/admin/all?${query}`);
  }

  async updateRepair(id, data) {
    return this.request(`/repairs/admin/${id}`, { method: 'PUT', body: data });
  }

  async getCustomers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/admin/customers?${query}`);
  }

  async createProduct(data) {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    return this.request('/products', { method: 'POST', body: data, isFormData });
  }

  async updateProduct(id, data) {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    return this.request(`/products/${id}`, { method: 'PUT', body: data, isFormData });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, { method: 'DELETE' });
  }

  // Service Management (Admin)
  async createService(data) {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    return this.request('/services', { method: 'POST', body: data, isFormData });
  }

  async updateService(id, data) {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    return this.request(`/services/${id}`, { method: 'PUT', body: data, isFormData });
  }

  async deleteService(id) {
    return this.request(`/services/${id}`, { method: 'DELETE' });
  }

  async getSettings() {
    return this.request('/admin/settings');
  }

  async updateSettings(data) {
    return this.request('/admin/settings', { method: 'PUT', body: data });
  }
}

const api = new ApiService();
export default api;
