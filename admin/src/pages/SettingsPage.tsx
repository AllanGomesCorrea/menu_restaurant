import { useState } from 'react';
import { Save, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import api from '../services/api';

export function SettingsPage() {
  const { user, checkAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setMessage(null);

    try {
      await api.updateUser(user.id, {
        name: formData.name,
        email: formData.email,
      });
      await checkAuth();
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setMessage({ type: 'error', text: 'Erro ao atualizar perfil' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.currentPassword) {
      setMessage({ type: 'error', text: 'Informe a senha atual' });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem' });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'A nova senha deve ter pelo menos 6 caracteres' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      await api.changePassword(formData.currentPassword, formData.newPassword);
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
    } catch (error: unknown) {
      console.error('Erro ao alterar senha:', error);
      let errorMessage = 'Erro ao alterar senha';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string | string[] } } };
        const data = axiosError.response?.data;
        if (data?.message) {
          errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message;
        }
      }
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Profile Section */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Informações do Perfil
        </h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="label">Nome</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">E-mail</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Função</label>
            <input
              type="text"
              value={user?.role === 'ADMIN' ? 'Administrador' : 'Supervisor'}
              className="input bg-gray-50"
              disabled
            />
          </div>
          <button type="submit" className="btn-primary" disabled={isLoading}>
            <Save size={20} />
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>

      {/* Password Section */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Alterar Senha
        </h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="label">Senha Atual</label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData({ ...formData, currentPassword: e.target.value })
                }
                className="input pr-12"
                required
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords({ ...showPasswords, current: !showPasswords.current })
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="label">Nova Senha</label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                className="input pr-12"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords({ ...showPasswords, new: !showPasswords.new })
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="label">Confirmar Nova Senha</label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="input pr-12"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            <Save size={20} />
            {isLoading ? 'Salvando...' : 'Alterar Senha'}
          </button>
        </form>
      </div>
    </div>
  );
}

