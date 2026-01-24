import axios from "axios";

const KEYCLOAK_URL = "http://localhost:8080";
const REALM = "cmsn";
const CLIENT_ID = "cmsn-web";

export interface KeycloakLoginRequest {
  username: string;
  password: string;
}

export interface KeycloakLoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export const keycloakLogin = async (
  data: KeycloakLoginRequest
): Promise<KeycloakLoginResponse> => {
  const params = new URLSearchParams();
  params.append("grant_type", "password");
  params.append("client_id", CLIENT_ID);
  params.append("username", data.username);
  params.append("password", data.password);
  params.append("scope", "openid");

  const res = await axios.post(
    `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`,
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return res.data;
};
