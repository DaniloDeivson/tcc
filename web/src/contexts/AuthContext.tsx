"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

interface PersonalInfo {
  fullName?: string;
  email?: string;
  phone?: string;
  monthlyIncome?: number;
  monthlyFixedExpenses?: number;
  monthlyVariableExpenses?: number;
  notes?: string;
}

interface Goal {
  id: number;
  name: string;
  targetAmount: number;
}

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

interface MonthlySavings {
  id: number;
  month: string;
  year: number;
  amount: number;
  date: string;
}

interface ExtraExpense {
  id: number;
  description: string;
  amount: number;
  date: string;
  month: string;
  year: number;
}

interface AuthContextType {
  user: User | null;
  personalInfo: PersonalInfo | null;
  goal: Goal | null;
  transactions: Transaction[];
  monthlySavings: MonthlySavings[];
  extraExpenses: ExtraExpense[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updatePersonalInfo: (info: PersonalInfo) => void;
  updateGoal: (goal: Goal) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: number, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: number) => void;
  addMonthlySavings: (savings: Omit<MonthlySavings, 'id'>) => void;
  updateMonthlySavings: (id: number, savings: Partial<MonthlySavings>) => void;
  deleteMonthlySavings: (id: number) => void;
  addExtraExpense: (expense: Omit<ExtraExpense, 'id'>) => void;
  updateExtraExpense: (id: number, expense: Partial<ExtraExpense>) => void;
  deleteExtraExpense: (id: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlySavings, setMonthlySavings] = useState<MonthlySavings[]>([]);
  const [extraExpenses, setExtraExpenses] = useState<ExtraExpense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Funções auxiliares para dados por usuário
  const getUserDataKey = (email: string, dataType: string) => `nestfin_${email}_${dataType}`;
  const REGISTERED_USERS_KEY = 'nestfin_registered_users';

  // Funções para gerenciar usuários registrados
  const getRegisteredUsers = (): string[] => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(REGISTERED_USERS_KEY);
    return saved ? JSON.parse(saved) : [];
  };

  const addRegisteredUser = (email: string) => {
    if (typeof window === 'undefined') return;
    const registeredUsers = getRegisteredUsers();
    if (!registeredUsers.includes(email)) {
      registeredUsers.push(email);
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registeredUsers));
    }
  };

  const isUserRegistered = (email: string): boolean => {
    const registeredUsers = getRegisteredUsers();
    return registeredUsers.includes(email);
  };

  const loadUserData = (email: string) => {
    const savedPersonalInfo = localStorage.getItem(getUserDataKey(email, 'personal_info'));
    const savedGoal = localStorage.getItem(getUserDataKey(email, 'goal'));
    const savedTransactions = localStorage.getItem(getUserDataKey(email, 'transactions'));
    const savedMonthlySavings = localStorage.getItem(getUserDataKey(email, 'monthly_savings'));
    const savedExtraExpenses = localStorage.getItem(getUserDataKey(email, 'extra_expenses'));

    return {
      personalInfo: savedPersonalInfo ? JSON.parse(savedPersonalInfo) : null,
      goal: savedGoal ? JSON.parse(savedGoal) : null,
      transactions: savedTransactions ? JSON.parse(savedTransactions) : [],
      monthlySavings: savedMonthlySavings ? JSON.parse(savedMonthlySavings) : [],
      extraExpenses: savedExtraExpenses ? JSON.parse(savedExtraExpenses) : []
    };
  };

  const saveUserData = (email: string, data: any, dataType: string) => {
    const key = getUserDataKey(email, dataType);
    localStorage.setItem(key, JSON.stringify(data));
  };

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem('nestfin_user');

    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      
      // Carregar dados específicos do usuário
      const userSpecificData = loadUserData(userData.email);
      setPersonalInfo(userSpecificData.personalInfo);
      setGoal(userSpecificData.goal);
      setTransactions(userSpecificData.transactions);
      setMonthlySavings(userSpecificData.monthlySavings);
      setExtraExpenses(userSpecificData.extraExpenses);
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Verificar se o usuário está registrado
      if (!isUserRegistered(email)) {
        throw new Error('Usuário não cadastrado. Por favor, faça o cadastro primeiro.');
      }
      
      // Simular login (em produção, fazer chamada para API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock de usuário logado com nome do cadastro
      const mockUser: User = {
        id: 1,
        name: email.split('@')[0], // Usa parte do email como nome
        email: email,
        isActive: true
      };

      // Carregar dados existentes ou criar novos
      const userSpecificData = loadUserData(email);

      let personalInfo: PersonalInfo;
      let goal: Goal;
      let transactions: Transaction[] = [];
      let monthlySavings: MonthlySavings[] = [];
      let extraExpenses: ExtraExpense[] = [];

      if (userSpecificData.personalInfo) {
        personalInfo = userSpecificData.personalInfo;
        personalInfo.email = email; // Atualizar email
      } else {
        personalInfo = {
          fullName: "",
          email: email,
          phone: "",
          monthlyIncome: 0,
          monthlyFixedExpenses: 0,
          monthlyVariableExpenses: 0,
          notes: ""
        };
      }

      if (userSpecificData.goal) {
        goal = userSpecificData.goal;
      } else {
        goal = {
          id: 1,
          name: "",
          targetAmount: 0
        };
      }

      transactions = userSpecificData.transactions;
      monthlySavings = userSpecificData.monthlySavings;
      extraExpenses = userSpecificData.extraExpenses;

      setUser(mockUser);
      setPersonalInfo(personalInfo);
      setGoal(goal);
      setTransactions(transactions);
      setMonthlySavings(monthlySavings);
      setExtraExpenses(extraExpenses);

      // Salvar no localStorage com chaves específicas do usuário
      localStorage.setItem('nestfin_user', JSON.stringify(mockUser));
      saveUserData(email, personalInfo, 'personal_info');
      saveUserData(email, goal, 'goal');
      saveUserData(email, transactions, 'transactions');
      saveUserData(email, monthlySavings, 'monthly_savings');
      saveUserData(email, extraExpenses, 'extra_expenses');

      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Verificar se o usuário já está registrado
      if (isUserRegistered(email)) {
        throw new Error('Este email já está cadastrado. Tente fazer login.');
      }
      
      // Simular registro (em produção, fazer chamada para API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Adicionar usuário à lista de registrados
      addRegisteredUser(email);
      
      return true;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setPersonalInfo(null);
    setGoal(null);
    setTransactions([]);
    setMonthlySavings([]);
    setExtraExpenses([]);
    
    // Limpar TODOS os dados do localStorage para resetar completamente
    localStorage.removeItem('nestfin_user');
    localStorage.removeItem('nestfin_personal_info');
    localStorage.removeItem('nestfin_goal');
    localStorage.removeItem('nestfin_transactions');
    localStorage.removeItem('nestfin_monthly_savings');
    localStorage.removeItem('nestfin_extra_expenses');
  };

  const updatePersonalInfo = (info: PersonalInfo) => {
    setPersonalInfo(info);
    if (user?.email) {
      saveUserData(user.email, info, 'personal_info');
    }
  };

  const updateGoal = (newGoal: Goal) => {
    setGoal(newGoal);
    if (user?.email) {
      saveUserData(user.email, newGoal, 'goal');
    }
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now() // ID único baseado em timestamp
    };
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    if (user?.email) {
      saveUserData(user.email, updatedTransactions, 'transactions');
    }
  };

  const updateTransaction = (id: number, updatedTransaction: Partial<Transaction>) => {
    const updatedTransactions = transactions.map(transaction =>
      transaction.id === id ? { ...transaction, ...updatedTransaction } : transaction
    );
    setTransactions(updatedTransactions);
    if (user?.email) {
      saveUserData(user.email, updatedTransactions, 'transactions');
    }
  };

  const deleteTransaction = (id: number) => {
    const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
    setTransactions(updatedTransactions);
    if (user?.email) {
      saveUserData(user.email, updatedTransactions, 'transactions');
    }
  };

  const addMonthlySavings = (savings: Omit<MonthlySavings, 'id'>) => {
    console.log('AuthContext addMonthlySavings called with:', savings);
    
    setMonthlySavings(prevSavings => {
      console.log('AuthContext prevSavings:', prevSavings);
      
      // Verificar se já existe economia para este mês/ano
      const existingSavingsIndex = prevSavings.findIndex(s => 
        s.month === savings.month && s.year === savings.year
      );
      
      let updatedSavings: MonthlySavings[];
      
      if (existingSavingsIndex >= 0) {
        // Atualizar economia existente
        updatedSavings = prevSavings.map((s, index) => 
          index === existingSavingsIndex 
            ? { ...s, amount: s.amount + savings.amount, date: savings.date }
            : s
        );
        console.log('AuthContext: Updated existing savings');
      } else {
        // Adicionar nova economia
        const newSavings: MonthlySavings = {
          ...savings,
          id: Date.now() // ID único baseado em timestamp
        };
        updatedSavings = [...prevSavings, newSavings];
        console.log('AuthContext: Added new savings');
      }
      
      console.log('AuthContext updatedSavings:', updatedSavings);
      
      // Salvar no localStorage
      if (user?.email) {
        saveUserData(user.email, updatedSavings, 'monthly_savings');
      }
      
      return updatedSavings;
    });
  };

  const updateMonthlySavings = (id: number, updatedSavings: Partial<MonthlySavings>) => {
    const updatedSavingsList = monthlySavings.map(savings =>
      savings.id === id ? { ...savings, ...updatedSavings } : savings
    );
    setMonthlySavings(updatedSavingsList);
    if (user?.email) {
      saveUserData(user.email, updatedSavingsList, 'monthly_savings');
    }
  };

  const deleteMonthlySavings = (id: number) => {
    const updatedSavings = monthlySavings.filter(savings => savings.id !== id);
    setMonthlySavings(updatedSavings);
    if (user?.email) {
      saveUserData(user.email, updatedSavings, 'monthly_savings');
    }
  };

  const addExtraExpense = (expense: Omit<ExtraExpense, 'id'>) => {
    const newExpense: ExtraExpense = {
      ...expense,
      id: Date.now() // ID único baseado em timestamp
    };
    const updatedExpenses = [...extraExpenses, newExpense];
    setExtraExpenses(updatedExpenses);
    if (user?.email) {
      saveUserData(user.email, updatedExpenses, 'extra_expenses');
    }
  };

  const updateExtraExpense = (id: number, updatedExpense: Partial<ExtraExpense>) => {
    const updatedExpensesList = extraExpenses.map(expense =>
      expense.id === id ? { ...expense, ...updatedExpense } : expense
    );
    setExtraExpenses(updatedExpensesList);
    if (user?.email) {
      saveUserData(user.email, updatedExpensesList, 'extra_expenses');
    }
  };

  const deleteExtraExpense = (id: number) => {
    const updatedExpenses = extraExpenses.filter(expense => expense.id !== id);
    setExtraExpenses(updatedExpenses);
    if (user?.email) {
      saveUserData(user.email, updatedExpenses, 'extra_expenses');
    }
  };

  const value: AuthContextType = {
    user,
    personalInfo,
    goal,
    transactions,
    monthlySavings,
    extraExpenses,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updatePersonalInfo,
    updateGoal,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addMonthlySavings,
    updateMonthlySavings,
    deleteMonthlySavings,
    addExtraExpense,
    updateExtraExpense,
    deleteExtraExpense
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};