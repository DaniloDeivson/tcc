// AuthService: login, cadastro e token no localStorage
import { api, setAuthToken } from './api';

export interface AuthResponse {
  token: string;
  userId: number;
  name: string;
  email: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

const TOKEN_KEY = 'nestfin_token';
const USER_KEY = 'nestfin_user';

export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    // Chama /Auth/register e salva token + usuário
    const res = await api.post<AuthResponse>('/Auth/register', data);
    saveToken(res.data.token);
    saveUser({ userId: res.data.userId, name: res.data.name, email: res.data.email });
    return res.data;
  },
  async login(data: LoginRequest): Promise<AuthResponse> {
    // Chama /Auth/login e salva token + usuário
    const res = await api.post<AuthResponse>('/Auth/login', data);
    saveToken(res.data.token);
    saveUser({ userId: res.data.userId, name: res.data.name, email: res.data.email });
    return res.data;
  },
  logout() {
    // Remove token e usuário e limpa o header Authorization
    saveToken(null);
    saveUser(null);
  },
  getToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  },
  getCurrentUser(): { userId: number; name: string; email: string } | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
};

function saveToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    setAuthToken(token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
    setAuthToken(null);
  }
}

function saveUser(user: { userId: number; name: string; email: string } | null) {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

// Inicializa token no carregamento do app (SSR-safe) (garregamento para validar a senha caso o arthur nao entenda )
if (typeof window !== 'undefined') {
  const existing = localStorage.getItem(TOKEN_KEY);
  if (existing) setAuthToken(existing);
}
