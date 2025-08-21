import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'

// Import components and services
import type { Events } from './Types'
import { userApi } from './service/Api'
import { Button } from './component/Button'
import { LoadingIndicator } from './component/LoadingIndicator'

function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Tambahkan ini
  const [user, setUser] = useState<Events | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // ✅ Ubah default menjadi false
  const [formData, setFormData] = useState<Partial<Events>>({});
  const [error, setError] = useState<string | null>(null);

  // Helper function to format date for input
  const formatDateForInput = (dateValue: string | Date | undefined): string => {
    if (!dateValue) return '';
    
    try {
      const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const userData = await userApi.getUserById(Number(id));
        setUser(userData);
        setFormData(userData); // ✅ Mengisi form data dengan data yang diambil
        
        // ✅ Cek state navigasi untuk mengatur mode edit
        if (location.state && location.state.isEditing) {
          setIsEditing(true);
        } else {
          setIsEditing(false); // Pastikan false jika tidak ada state
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, location.state]); // ✅ Tambahkan `id` dan `location.state` sebagai dependency

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
                type === 'number' ? Number(value) : 
                value
    }));
  };

  const handleSave = async () => {
    if (!id || !user) return;

    try {
      setLoading(true);
      const updatedUser = await userApi.updateUser(Number(id), formData);
      setUser(updatedUser);
      setFormData(updatedUser); // Update form data dengan data yang baru disimpan
      setIsEditing(false); // Keluar dari mode edit setelah berhasil
      alert('User berhasil diupdate!');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Terjadi error saat mengupdate User');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    if (window.confirm('Apakah Anda yakin ingin menghapus User ini?')) {
      try {
        setLoading(true);
        await userApi.deleteUser(Number(id));
        alert('User berhasil dihapus!');
        navigate('/');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Terjadi error saat menghapus User');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  const handleCancel = () => {
    setFormData(user || {}); // Mengembalikan data form ke data asli
    setIsEditing(false); // Keluar dari mode edit
  };

  const handleEdit = () => {
    setIsEditing(true); // Masuk ke mode edit
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <LoadingIndicator size="lg" text="Loading User details..." />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Error: </strong>
            <span>{error || 'User tidak ditemukan'}</span>
          </div>
          <div className="mt-4">
            <Button variant="primary" onClick={handleGoBack}>
              Kembali ke Daftar User
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className='font-bold text-3xl text-gray-800'>
              {isEditing ? 'Edit User' : 'User Detail'}
            </h1>
            <p className='text-gray-600 mt-1'>
              {isEditing ? 'Modify user information' : 'View user information'}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="primary" onClick={handleGoBack}>
              ← Kembali
            </Button>
            {!isEditing ? (
              <Button variant="success" onClick={handleEdit}>
                Edit User
              </Button>
            ) : (
              <Button variant="danger" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">
                Name User
              </label>
              <input 
                type="text" 
                id="title" 
                name="title"
                value={formData.title || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-200 disabled:cursor-not-allowed" 
                required 
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">
                Description User
              </label>
              <textarea 
                id="description" 
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={4}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-200 disabled:cursor-not-allowed" 
                required 
              />
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900">
                Date User
              </label>
              <input 
                type="date" 
                id="date" 
                name="date"
                value={formatDateForInput(formData.date)}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-200 disabled:cursor-not-allowed" 
                required 
              />
            </div>

            {/* Action Buttons - Only show when editing */}
            {isEditing && (
              <div className="flex gap-4 pt-6 border-t">
                <Button 
                  type="button"
                  variant="success"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
                
                <Button 
                  type="button"
                  variant="danger"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete User'}
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserDetail;