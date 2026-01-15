"use server";

import { cookies } from "next/headers";

interface StoreTokenRequest {
  token: string;
  refresh_token: string;
}

const tokenKeys = {
  accessToken: "transit-portal-accessToken",
  refreshToken: "ia-refreshToken"
}

const storeToken = async (request: StoreTokenRequest) => {
  cookies().set({
    name: tokenKeys.accessToken,
    value: request.token,
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  cookies().set({
    name: tokenKeys.refreshToken,
    value: request.refresh_token,
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });
};

const deleteCookies = async () => {
  cookies().delete(tokenKeys.accessToken);
  cookies().delete(tokenKeys.refreshToken);
};

const getToken = async () => {
  const authToken = cookies().get(tokenKeys.accessToken)?.value;
  return authToken;
};

export { storeToken, getToken, deleteCookies };
