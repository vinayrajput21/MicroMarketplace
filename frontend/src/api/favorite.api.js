import api from './axios';

export const addFavorite = (productId) => api.post(`/favorites/${productId}`);
export const removeFavorite = (productId) => api.delete(`/favorites/${productId}`);
export const getFavorites = () => api.get('/favorites');