import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, StarOff } from 'lucide-react';
import api from '../services/api';
import type { MenuItem, CreateMenuItem, MenuCategory } from '../types';
import { useAuthStore } from '../stores/authStore';

const CATEGORIES: { value: MenuCategory; label: string }[] = [
  { value: 'ENTRADAS', label: 'Entradas' },
  { value: 'PRATOS', label: 'Pratos Principais' },
  { value: 'SOBREMESAS', label: 'Sobremesas' },
  { value: 'BEBIDAS', label: 'Bebidas' },
];

export function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'ALL'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const { user } = useAuthStore();

  const isAdmin = user?.role === 'ADMIN';

  const [formData, setFormData] = useState<CreateMenuItem>({
    name: '',
    description: '',
    price: 0,
    category: 'PRATOS',
    featured: false,
    available: true,
    imageUrl: '',
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await api.getMenuItems();
      setItems(data);
    } catch (error) {
      console.error('Erro ao carregar cardápio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Remove imageUrl vazia para não causar erro de validação
      const dataToSend = {
        ...formData,
        imageUrl: formData.imageUrl?.trim() || undefined,
      };
      
      if (editingItem) {
        await api.updateMenuItem(editingItem.id, dataToSend);
      } else {
        await api.createMenuItem(dataToSend);
      }
      await fetchItems();
      closeModal();
    } catch (error: unknown) {
      console.error('Erro ao salvar item:', error);
      let message = 'Erro ao salvar item';
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
    if (!confirm('Tem certeza que deseja excluir este item?')) return;
    try {
      await api.deleteMenuItem(id);
      await fetchItems();
    } catch (error) {
      console.error('Erro ao excluir item:', error);
      alert('Erro ao excluir item');
    }
  };

  const toggleAvailable = async (item: MenuItem) => {
    try {
      await api.updateMenuItem(item.id, { available: !item.available });
      await fetchItems();
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
    }
  };

  const toggleFeatured = async (item: MenuItem) => {
    try {
      await api.updateMenuItem(item.id, { featured: !item.featured });
      await fetchItems();
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
    }
  };

  const openModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        featured: item.featured,
        available: item.available,
        imageUrl: item.imageUrl || '',
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: 'PRATOS',
        featured: false,
        available: true,
        imageUrl: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const filteredItems = selectedCategory === 'ALL'
    ? items
    : items.filter((item) => item.category === selectedCategory);

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
        <h1 className="text-2xl font-bold text-gray-900">Cardápio</h1>
        {isAdmin && (
          <button onClick={() => openModal()} className="btn-primary">
            <Plus size={20} />
            Novo Item
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === 'ALL'
              ? 'bg-primary-800 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todos
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === cat.value
                ? 'bg-primary-800 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`card relative ${!item.available ? 'opacity-60' : ''}`}
          >
            {/* Image */}
            {item.imageUrl && (
              <div className="relative">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                {/* Badges sobre a imagem */}
                <div className="absolute top-2 right-2 flex gap-2">
                  {item.featured && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      Destaque
                    </span>
                  )}
                  {!item.available && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      Indisponível
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Badges sem imagem - acima do nome */}
            {!item.imageUrl && (item.featured || !item.available) && (
              <div className="flex gap-2 mb-2">
                {item.featured && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                    Destaque
                  </span>
                )}
                {!item.available && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    Indisponível
                  </span>
                )}
              </div>
            )}

            {/* Content */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900 flex-1">{item.name}</h3>
                <span className="text-primary-800 font-bold whitespace-nowrap">
                  R$ {item.price.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2">
                {item.description}
              </p>
              <span className="inline-block text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                {CATEGORIES.find((c) => c.value === item.category)?.label}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => toggleAvailable(item)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                title={item.available ? 'Desativar' : 'Ativar'}
              >
                {item.available ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              <button
                onClick={() => toggleFeatured(item)}
                className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg"
                title={item.featured ? 'Remover destaque' : 'Destacar'}
              >
                {item.featured ? <Star size={18} className="text-yellow-500" /> : <StarOff size={18} />}
              </button>
              <button
                onClick={() => openModal(item)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                title="Editar"
              >
                <Pencil size={18} />
              </button>
              {isAdmin && (
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  title="Excluir"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum item encontrado</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingItem ? 'Editar Item' : 'Novo Item'}
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
                <label className="label">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="input min-h-[100px]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: parseFloat(e.target.value) })
                    }
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="label">Categoria</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as MenuCategory,
                      })
                    }
                    className="input"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="label">URL da Imagem</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  className="input"
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) =>
                      setFormData({ ...formData, available: e.target.checked })
                    }
                    className="w-4 h-4 text-primary-800 rounded"
                  />
                  <span className="text-sm text-gray-700">Disponível</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="w-4 h-4 text-primary-800 rounded"
                  />
                  <span className="text-sm text-gray-700">Destaque</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {editingItem ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

