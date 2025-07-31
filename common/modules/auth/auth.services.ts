import API_URLS from '@/common/constants/apiUrls';
import httpService from '@/common/lib/api';
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  LogoutRequest,
} from '@/common/modules/auth/auth.interface';

export class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return httpService.post<LoginResponse>(`${API_URLS.LOGIN}`, credentials);
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const request: RefreshTokenRequest = { refresh_token: refreshToken };
    return httpService.post<RefreshTokenResponse>(`${API_URLS.REFRESH_TOKEN}`, request);
  }

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    return httpService.post<RegisterResponse>(`${API_URLS.REGISTER}`, userData);
  }

  async logout(refreshToken: string): Promise<void> {
    const request: LogoutRequest = { refresh_token: refreshToken };
    return httpService.post<void>(`${API_URLS.LOGOUT}`, request);
  }

  async getProfile(): Promise<any> {
    return httpService.get<any>(`${API_URLS.PROFILE}`);
  }
}
