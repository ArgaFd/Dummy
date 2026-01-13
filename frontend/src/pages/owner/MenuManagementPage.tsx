import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FiPlus, FiEdit2, FiTrash2, FiArrowLeft, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { menuAPI } from '../../services/api';

// Define MenuItem type locally to avoid import issues
interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  description?: string;
  image_url?: string;
  is_available: boolean;
}

// Extended type for local state
interface MenuItemLocal extends MenuItem {
  available?: boolean;
}

const CATEGORIES = ['makanan', 'minuman', 'dessert', 'starter/snack', 'paket'];

const MenuManagementPage = () => {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItemLocal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<MenuItemLocal | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'makanan',
    price: 0,
    description: '',
    is_available: true,
  });
  const [saving, setSaving] = useState(false);

  const categories = ['Semua', ...CATEGORIES];

  // Fetch menu items on mount
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    console.log('[MenuManagementPage] Fetching menu items...');
    try {
      setLoading(true);
      const response = await menuAPI.getAll();
      console.log('[MenuManagementPage] Fetch response:', response.data);

      const items = response.data.data?.items || [];
      // Map is_available to available for display
      const mappedItems = items.map((item: MenuItem) => ({
        ...item,
        available: item.is_available,
      }));
      setMenuItems(mappedItems);
      console.log('[MenuManagementPage] Loaded', mappedItems.length, 'items');
    } catch (error) {
      console.error('[MenuManagementPage] Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    console.log('[MenuManagementPage] Opening Add Modal');
    setCurrentItem(null);
    setFormData({
      name: '',
      category: 'makanan',
      price: 0,
      description: '',
      is_available: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItemLocal) => {
    console.log('[MenuManagementPage] Opening Edit Modal for item:', item.id, item.name);
    setCurrentItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description || '',
      is_available: item.is_available,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log('[MenuManagementPage] Closing Modal');
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
        name === 'price' ? Number(value) : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      is_available: e.target.checked
    }));
  };

  const handleSave = async () => {
    if (currentItem) {
      // Update
      console.log('[MenuManagementPage] Updating item:', currentItem.id, formData);
      try {
        setSaving(true);
        const response = await menuAPI.update(currentItem.id, formData);
        console.log('[MenuManagementPage] Update response:', response.data);
        closeModal();
        fetchMenuItems(); // Refresh list
      } catch (error) {
        console.error('[MenuManagementPage] Error updating item:', error);
        alert('Gagal mengupdate menu');
      } finally {
        setSaving(false);
      }
    } else {
      // Create
      console.log('[MenuManagementPage] Creating new item:', formData);
      try {
        setSaving(true);
        const response = await menuAPI.create(formData);
        console.log('[MenuManagementPage] Create response:', response.data);
        closeModal();
        fetchMenuItems(); // Refresh list
      } catch (error) {
        console.error('[MenuManagementPage] Error creating item:', error);
        alert('Gagal menambahkan menu');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleDelete = async (item: MenuItemLocal) => {
    console.log('[MenuManagementPage] Delete clicked for item:', item.id, item.name);
    if (!window.confirm(`Apakah Anda yakin ingin menghapus "${item.name}"?`)) {
      console.log('[MenuManagementPage] Delete cancelled by user');
      return;
    }

    console.log('[MenuManagementPage] Deleting item:', item.id);
    try {
      const response = await menuAPI.delete(item.id);
      console.log('[MenuManagementPage] Delete response:', response.data);
      fetchMenuItems(); // Refresh list
    } catch (error) {
      console.error('[MenuManagementPage] Error deleting item:', error);
      alert('Gagal menghapus menu');
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/owner/management" className="flex items-center text-gray-600 hover:text-gray-900">
                <span className="mr-2"><FiArrowLeft /></span>
                Kembali ke Management
              </Link>
              <h1 className="ml-4 text-2xl font-bold text-gray-900">Manajemen Menu</h1>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500">Welcome, {user?.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-6">
            {/* Header Actions */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Daftar Menu</h2>
              <button
                onClick={openAddModal}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                <span className="mr-2"><FiPlus /></span>
                Tambah Menu
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Cari menu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${selectedCategory === category
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items */}
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                <p className="mt-2 text-gray-600">Memuat data menu...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nama Menu
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kategori
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Harga
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">Aksi</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {item.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">Rp {item.price.toLocaleString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                              {item.is_available ? 'Tersedia' : 'Tidak Tersedia'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => openEditModal(item)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Edit"
                              >
                                <span className="h-4 w-4"><FiEdit2 /></span>
                              </button>
                              <button
                                onClick={() => handleDelete(item)}
                                className="text-red-600 hover:text-red-900"
                                title="Hapus"
                              >
                                <span className="h-4 w-4"><FiTrash2 /></span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">
                          Tidak ada data menu yang ditemukan
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Debug info */}
            {!loading && (
              <div className="mt-4 text-sm text-gray-500">
                Menampilkan {filteredItems.length} dari {menuItems.length} menu
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={closeModal}></div>

            {/* Modal panel */}
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {currentItem ? 'Edit Menu' : 'Tambah Menu Baru'}
                </h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Menu</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Masukkan nama menu"
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">Kategori</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">Harga (Rp)</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Masukkan harga"
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deskripsi</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Deskripsi menu (opsional)"
                  />
                </div>

                {/* Available */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_available"
                    name="is_available"
                    checked={formData.is_available}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_available" className="ml-2 block text-sm text-gray-700">
                    Tersedia
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || !formData.name || formData.price <= 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Menyimpan...' : (currentItem ? 'Update' : 'Tambah')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagementPage;
