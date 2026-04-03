import axios from "axios";
import {
  KEYCLOAK_URL,
  KEYCLOAK_REALM,
  KEYCLOAK_CLIENT_ID,
  KEYCLOAK_CLIENT_SECRET,
} from "@/utils/constraints";

const NEXT_KEYCLOAK_URL = KEYCLOAK_URL;
const REALM = KEYCLOAK_REALM;
const CLIENT_ID = KEYCLOAK_CLIENT_ID!;

export interface KeycloakLoginRequest {
  identifier: string;
  password: string;
}

export interface KeycloakLoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export const keycloakLogin = async (
  data: KeycloakLoginRequest,
): Promise<KeycloakLoginResponse> => {
  const params = new URLSearchParams();
  params.append("grant_type", "password");
  params.append("client_id", CLIENT_ID);
  params.append("client_secret", KEYCLOAK_CLIENT_SECRET!);
  params.append("username", data.identifier);
  params.append("password", data.password);
  params.append("scope", "openid profile email");

  const res = await axios.post(
    `${NEXT_KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`,
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  return res.data;
};

export const keycloakLogout = async (refreshToken?: string) => {
  if (!refreshToken) return;

  const params = new URLSearchParams();
  params.append("client_id", CLIENT_ID);
  params.append("client_secret", KEYCLOAK_CLIENT_SECRET!);
  params.append("refresh_token", refreshToken);

  try {
    await axios.post(
      `${NEXT_KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/logout`,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
    console.log("Keycloak logout successful");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Keycloak logout error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }
    throw error;
  }
};

export const keycloakRefreshToken = async (
  refreshToken: string,
): Promise<KeycloakLoginResponse> => {
  try {
    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("client_id", CLIENT_ID);
    params.append("client_secret", KEYCLOAK_CLIENT_SECRET!);
    params.append("refresh_token", refreshToken);

    console.log("Calling Keycloak refresh token endpoint");

    const res = await axios.post(
      `${NEXT_KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Keycloak refresh token error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }
    throw error;
  }
};
