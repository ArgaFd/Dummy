import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { userAPI } from '../../services/api';

// Type definitions
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const UserManagementPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Placeholder for handleAddUser
  const handleAddUser = () => {
    alert('Fitur tambah pengguna akan segera hadir!');
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setLoading(true);
      const response = await userAPI.getAll();

      // Format data sesuai dengan yang diharapkan komponen
      const formattedUsers = response.data.data.map((userData: User) => ({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        status: userData.status ? (userData.status.charAt(0).toUpperCase() + userData.status.slice(1).toLowerCase()) : 'Active'
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching staff:', error);
      // Fallback ke dummy data hanya staff
      setUsers([
        { id: 2, name: 'Staff 1', email: 'staff1@example.com', role: 'staff', status: 'Active' },
        { id: 3, name: 'Staff 2', email: 'staff2@example.com', role: 'staff', status: 'Active' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditUser = (userId: number) => {
    // TODO: Open modal untuk edit user
    alert(`Edit user ${userId} akan segera hadir!`);
  };

  const handleDeleteUser = (userId: number) => {
    // TODO: Konfirmasi dan hapus user
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      alert(`Hapus user ${userId} akan segera hadir!`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
        <Link
          to="/owner/dashboard"
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FiArrowLeft className="mr-1" /> Kembali ke Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari pengguna..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={handleAddUser}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <FiPlus className="mr-2" /> Tambah Pengguna
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Memuat data pengguna...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold">Nama</th>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold">Email</th>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold">Role</th>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold">Status</th>
                  <th className="py-3 px-4 text-right text-gray-700 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'owner'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                          }`}>
                          {user.role === 'owner' ? 'Pemilik' : 'Staf'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${user.status.toLowerCase() === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEditUser(user.id)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Edit"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Hapus"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      Tidak ada data pengguna yang ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Debug info - bisa dihapus di production */}
        {!loading && (
          <div className="mt-4 text-sm text-gray-500">
            Menampilkan {filteredUsers.length} dari {users.length} pengguna
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;