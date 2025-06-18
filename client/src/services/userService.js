// src/services/userService.js

const API_BASE_URL = 'http://localhost:3000/api/v1/users'; 

const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Lỗi HTTP! status: ${response.status}`);
  }
  return response.json();
};

export const getUserProfile = async (token) => {
  const response = await fetch(`${API_BASE_URL}/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleApiResponse(response);
};


export const updateUserProfile = async (profileData, token) => {
  const response = await fetch(`${API_BASE_URL}/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });
  return handleApiResponse(response);
};

export const getFavoriteTours = async (token) => {
  const response = await fetch(`${API_BASE_URL}/me/favorite-tours`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleApiResponse(response);
};

export const addFavoriteTour = async (tourId, token) => {
  const response = await fetch(`${API_BASE_URL}/me/favorite-tours/${tourId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Vẫn có thể giữ Content-Type, dù body trống
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleApiResponse(response);
};

export const removeFavoriteTour = async (tourId, token) => {
  const response = await fetch(`${API_BASE_URL}/me/favorite-tours/${tourId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleApiResponse(response);
};

export const getTourHistory = async (token) => {
  const response = await fetch(`${API_BASE_URL}/me/tour-history`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleApiResponse(response);
};