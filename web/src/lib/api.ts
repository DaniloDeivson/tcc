// API: cria uma instância do Axios para falar com o backend
import axios from 'axios';

// URL base da API (altere a porta conforme seu backend)
const API_BASE_URL = 'http://localhost:5000/api';

// Instância do axios com JSON por padrão
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Define/Remove o token Bearer nas requisições
export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

// Tipos para a API
export interface User {
  id?: number;
  name: string;
  email: string;
  passwordHash: string;
  createdAt?: string;
  updatedAt?: string;
  isActive: boolean;
}

// Tipos para dados pessoais e metas
export interface PersonalInfoDto {
  fullName?: string;
  email?: string;
  phone?: string;
  monthlyIncome?: number;
  monthlyFixedExpenses?: number;
  monthlyVariableExpenses?: number;
  notes?: string;
}

export interface GoalDto {
  name: string;
  targetAmount: number;
}

// Serviços da API (ex.: usuários)
export const userService = {
  // Listar todos os usuários
  getAll: async (): Promise<User[]> => {
    const response = await api.get('/Users');
    return response.data;
  },

  // Buscar usuário por ID
  getById: async (id: number): Promise<User> => {
    const response = await api.get(`/Users/${id}`);
    return response.data;
  },

  // Criar novo usuário
  create: async (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
    const response = await api.post('/Users', user);
    return response.data;
  },

  // Atualizar usuário
  update: async (id: number, user: User): Promise<void> => {
    await api.put(`/Users/${id}`, user);
  },

  // Deletar usuário
  delete: async (id: number): Promise<void> => {
    await api.delete(`/Users/${id}`);
  },
};

// Serviços pessoais (requer token JWT)
export const personalService = {
  getInfo: async (): Promise<PersonalInfoDto> => {
    const res = await api.get('/personal/info');
    return res.data;
  },
  upsertInfo: async (data: PersonalInfoDto): Promise<void> => {
    await api.put('/personal/info', data);
  },
  createGoal: async (data: GoalDto) => {
    const res = await api.post('/personal/goals', data);
    return res.data;
  },
  listGoals: async () => {
    const res = await api.get('/personal/goals');
    return res.data as Array<{ id: number; name: string; targetAmount: number }>;
  },
};
