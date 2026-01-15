"use client";

interface StoreTokenRequest {
  token: string;
  refresh_token: string;
}

const tokenKeys = {
  accessToken: "transit-portal-accessToken",
  refreshToken: "transit-portal-refreshToken"
}

const storeToken = async (request: StoreTokenRequest) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(tokenKeys.accessToken, request.token);
    localStorage.setItem(tokenKeys.refreshToken, request.refresh_token);
  }
};

const deleteTokens = async () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(tokenKeys.accessToken);
    localStorage.removeItem(tokenKeys.refreshToken);
  }
};

const getToken = async () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(tokenKeys.accessToken);
  }
  return null;
};

const getRefreshToken = async () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(tokenKeys.refreshToken);
  }
  return null;
};

export { storeToken, getToken, getRefreshToken, deleteTokens };










