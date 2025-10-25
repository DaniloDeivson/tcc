'use client'
import React, { useState, useEffect } from 'react';
import { userService, User } from '@/lib/api';

const UserTest = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    passwordHash: '',
    isActive: true
  });

  // Carregar usuários
  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      setError('Erro ao carregar usuários');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Criar usuário
  const createUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.passwordHash) {
      setError('Preencha todos os campos');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await userService.create(newUser);
      setNewUser({ name: '', email: '', passwordHash: '', isActive: true });
      loadUsers(); // Recarregar lista
    } catch (err) {
      setError('Erro ao criar usuário');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Carregar usuários ao montar o componente
  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="p-6 bg-[#2B402B] rounded-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Teste da API - Usuários</h2>
      
      {/* Formulário para criar usuário */}
      <div className="mb-6 p-4 bg-[#2A4A2A] rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Criar Novo Usuário</h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Nome"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="w-full p-2 rounded bg-[#122112] text-white border border-[#6B8A6B]"
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="w-full p-2 rounded bg-[#122112] text-white border border-[#6B8A6B]"
          />
          <input
            type="password"
            placeholder="Senha"
            value={newUser.passwordHash}
            onChange={(e) => setNewUser({ ...newUser, passwordHash: e.target.value })}
            className="w-full p-2 rounded bg-[#122112] text-white border border-[#6B8A6B]"
          />
          <button
            onClick={createUser}
            disabled={loading}
            className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Criando...' : 'Criar Usuário'}
          </button>
        </div>
      </div>

      {/* Lista de usuários */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Usuários ({users.length})</h3>
          <button
            onClick={loadUsers}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Carregando...' : 'Atualizar'}
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-600 text-white rounded">
            {error}
          </div>
        )}

        <div className="space-y-2">
          {users.map((user) => (
            <div key={user.id} className="p-3 bg-[#2A4A2A] rounded border border-[#6B8A6B]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white font-semibold">{user.name}</p>
                  <p className="text-gray-300 text-sm">{user.email}</p>
                  <p className="text-gray-400 text-xs">
                    ID: {user.id} | Ativo: {user.isActive ? 'Sim' : 'Não'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && !loading && (
          <p className="text-gray-400 text-center py-4">Nenhum usuário encontrado</p>
        )}
      </div>
    </div>
  );
};

export default UserTest;
