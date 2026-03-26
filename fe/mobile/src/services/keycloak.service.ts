import { CONFIG } from '../config';

export interface KeycloakLoginRequest {
  identifier: string;
  password: string;
}

export interface KeycloakLoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  refresh_expires_in: number;
  scope: string;
  'not-before-policy': number;
  session_state: string;
}

export const keycloakService = {
  async login(request: KeycloakLoginRequest): Promise<KeycloakLoginResponse> {
    const url = `${CONFIG.KEYCLOAK.URL}/realms/${CONFIG.KEYCLOAK.REALM}/protocol/openid-connect/token`;

    const details: Record<string, string> = {
      grant_type: 'password',
      client_id: CONFIG.KEYCLOAK.CLIENT_ID,
      username: request.identifier,
      client_secret: CONFIG.KEYCLOAK.CLIENT_SECRET,
      password: request.password,
      scope: 'openid profile email',
    };
    console.log('[keycloak.service.ts] details:', JSON.stringify(details, null, 2));

    const formBody = Object.keys(details)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key]))
      .join('&');
    console.log("[keycloak.service.ts] formBody: " + formBody)

    console.log(`[Keycloak Request] POST ${url}`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody,
    });

    if (!response.ok) {
      let errorMessage = 'Đăng nhập Keycloak thất bại';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error_description || errorData.error || errorMessage;
      } catch {
        errorMessage += ` (${response.status})`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  },

  async refreshToken(refreshToken: string): Promise<KeycloakLoginResponse> {
    const url = `${CONFIG.KEYCLOAK.URL}/realms/${CONFIG.KEYCLOAK.REALM}/protocol/openid-connect/token`;

    const details: Record<string, string> = {
      grant_type: 'refresh_token',
      client_id: CONFIG.KEYCLOAK.CLIENT_ID,
      refresh_token: refreshToken,
    };

    const formBody = Object.keys(details)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key]))
      .join('&');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody,
    });

    if (!response.ok) {
      throw new Error('Refresh token thất bại');
    }

    return response.json();
  },

  async logout(refreshToken: string): Promise<void> {
    const url = `${CONFIG.KEYCLOAK.URL}/realms/${CONFIG.KEYCLOAK.REALM}/protocol/openid-connect/logout`;

    const details: Record<string, string> = {
      client_id: CONFIG.KEYCLOAK.CLIENT_ID,
      refresh_token: refreshToken,
    };

    const formBody = Object.keys(details)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key]))
      .join('&');

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody,
    });
  }
};
