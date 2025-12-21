import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, UserCheck, UserX } from 'lucide-react';
import api from '../services/api';
import type { User, Role } from '../types';
import { useAuthStore } from '../stores/authStore';

const ROLES: { value: Role; label: string }[] = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'SUPERVISOR', label: 'Supervisor' },
];

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { user: currentUser } = useAuthStore();

  // Verificação de permissão - apenas ADMIN pode acessar
  if (currentUser?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'SUPERVISOR' as Role,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.getUsers({ limit: 100 });
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const updates: Partial<User & { password?: string }> = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
        };
        if (formData.password) {
          updates.password = formData.password;
        }
        await api.updateUser(editingUser.id, updates);
      } else {
        await api.createUser(formData);
      }
      await fetchUsers();
      closeModal();
    } catch (error: unknown) {
      console.error('Erro ao salvar usuário:', error);
      let message = 'Erro ao salvar usuário';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string | string[] } } };
        const data = axiosError.response?.data;
        if (data?.message) {
          message = Array.isArray(data.message) ? data.message.join(', ') : data.message;
        }
      }
      alert(message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
    try {
      await api.deleteUser(id);
      await fetchUsers();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      alert('Erro ao excluir usuário');
    }
  };

  const handleToggleActive = async (user: User) => {
    try {
      await api.updateUser(user.id, { isActive: !user.isActive });
      await fetchUsers();
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      alert('Erro ao atualizar usuário');
    }
  };

  const openModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'SUPERVISOR',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const getRoleBadge = (role: Role) => {
    return role === 'ADMIN'
      ? 'bg-purple-100 text-purple-800'
      : 'bg-blue-100 text-blue-800';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
        <button onClick={() => openModal()} className="btn-primary">
          <Plus size={20} />
          Novo Usuário
        </button>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className={`card relative ${!user.isActive ? 'opacity-60' : ''}`}
          >
            {/* Avatar */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-800 font-semibold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {user.name}
                </h3>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
            </div>

            {/* Info */}
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleBadge(
                  user.role
                )}`}
              >
                {user.role === 'ADMIN' ? 'Administrador' : 'Supervisor'}
              </span>
              {!user.isActive && (
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                  Inativo
                </span>
              )}
            </div>

            {/* Actions */}
            {currentUser?.id !== user.id && (
              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleToggleActive(user)}
                  className={`p-2 rounded-lg ${
                    user.isActive
                      ? 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                      : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                  }`}
                  title={user.isActive ? 'Desativar' : 'Ativar'}
                >
                  {user.isActive ? <UserX size={18} /> : <UserCheck size={18} />}
                </button>
                <button
                  onClick={() => openModal(user)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                  title="Editar"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  title="Excluir"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}

            {currentUser?.id === user.id && (
              <div className="pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500 italic">Você</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum usuário encontrado</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="label">Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label">E-mail</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label">
                  Senha {editingUser && '(deixe em branco para manter)'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="input"
                  required={!editingUser}
                  minLength={6}
                  placeholder="Mínimo 6 caracteres (letra + número)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  A senha deve conter pelo menos uma letra e um número
                </p>
              </div>

              <div>
                <label className="label">Função</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as Role })
                  }
                  className="input"
                >
                  {ROLES.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {editingUser ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

