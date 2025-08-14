import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// Import separated components and services
import type { User } from './Types'
import { userApi } from './service/Api'
import { Button } from './component/Button'
import { LoadingIndicator } from './component/LoadingIndicator'

function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const userData = await userApi.getUserById(id);
        setUser(userData);
        setFormData(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? Number(value) : value
    }));
  };

  const handleSave = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const updatedUser = await userApi.updateUser(id, formData);
      setUser(updatedUser);
      setIsEditing(false);
      alert('User berhasil diupdate!');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Terjadi error saat mengupdate user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    if (window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      try {
        setLoading(true);
        await userApi.deleteUser(id);
        alert('User berhasil dihapus!');
        navigate('/');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Terjadi error saat menghapus user');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  const handleCancel = () => {
    setFormData(user || {});
    setIsEditing(false);
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <LoadingIndicator size="lg" text="Loading user details..." />
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
            <h1 className='font-bold text-3xl text-gray-800'>User Details</h1>
            <p className='text-gray-600 mt-1'>Manage user information and settings</p>
          </div>
          <div className="flex gap-3">
            <Button variant="primary" onClick={handleGoBack}>
              ← Kembali
            </Button>
            {!isEditing ? (
              <Button variant="success" onClick={() => setIsEditing(true)}>
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
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-900">
                First Name
              </label>
              <input 
                type="text" 
                id="firstName" 
                name="firstName"
                value={formData.firstName || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-200 disabled:cursor-not-allowed" 
                required 
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-900">
                Last Name
              </label>
              <input 
                type="text" 
                id="lastName" 
                name="lastName"
                value={formData.lastName || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-200 disabled:cursor-not-allowed" 
                required 
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900">
                Address
              </label>
              <input 
                type="text" 
                id="address" 
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-200 disabled:cursor-not-allowed" 
                required 
              />
            </div>

            {/* Identity Number */}
            <div>
              <label htmlFor="identityNumber" className="block mb-2 text-sm font-medium text-gray-900">
                Identity Number
              </label>
              <input 
                type="number" 
                id="identityNumber" 
                name="identityNumber"
                value={formData.identityNumber || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-200 disabled:cursor-not-allowed" 
                required 
              />
            </div>

            {/* Birth Date */}
            <div>
              <label htmlFor="birthDate" className="block mb-2 text-sm font-medium text-gray-900">
                Birth Date
              </label>
              <input 
                type="date" 
                id="birthDate" 
                name="birthDate"
                value={formData.birthDate ? new Date(formData.birthDate).toISOString().split('T')[0] : ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-200 disabled:cursor-not-allowed" 
                required 
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900">
                Status
              </label>
              <select 
                id="status" 
                name="status"
                value={formData.status ? 'true' : 'false'}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value === 'true' }))}
                disabled={!isEditing}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-200 disabled:cursor-not-allowed"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {/* Action Buttons */}
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
                  Delete User
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