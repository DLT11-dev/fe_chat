// Auth API Interfaces
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email?: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface LogoutRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
}


export interface RegisterResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
  };
}

// Auth Store Interfaces
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isTokenFresh: boolean; // Flag để theo dõi token vừa được tạo
}

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}



export interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  logout: (refreshToken: string) => Promise<void>;
  register: (credentials: RegisterRequest) => Promise<void>;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
  setTokenFresh: (isFresh: boolean) => void; // Action để set flag
}
