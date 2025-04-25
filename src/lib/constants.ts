export const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
export const API_ROUTES = {
  auth: {
    session: `${API_BASE_URL}/api/auth/session`,
    signIn: `${API_BASE_URL}/api/auth/signin`,
    signOut: `${API_BASE_URL}/api/auth/signout`,
  },
  products: `${API_BASE_URL}/api/products`,
  cart: `${API_BASE_URL}/api/cart`,
  categories: `${API_BASE_URL}/api/categories`,
  promocodes: `${API_BASE_URL}/api/promocodes`,
}; 