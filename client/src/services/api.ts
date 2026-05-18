// frontend/src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiPaths = {
  gyms: `${API_BASE_URL}/gyms`,
  reviews: `${API_BASE_URL}/reviews`,
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
  },
  // Add other endpoints as needed
};
