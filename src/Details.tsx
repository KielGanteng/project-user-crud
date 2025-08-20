import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// Import separated components and services
import type { Events } from './Types' // ✅ Changed from User to Events
import { userApi } from './service/Api'
import { Button } from './component/Button'
import { LoadingIndicator } from './component/LoadingIndicator'

function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<Events | null>(null); // ✅ Changed from User to Events
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Events>>({}); // ✅ Changed from User to Events
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
        const userData = await userApi.getUserById(Number(id)); // ✅ Convert string to number
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? Number(value) : 
               value // ✅ Don't convert date to Date object, keep as string
    }));
  };

  const handleSave = async () => {
    if (!id || !user) return;

    try {
      setLoading(true);
      const updatedUser = await userApi.updateUser(Number(id), formData); // ✅ Convert string to number
      setUser(updatedUser);
      setIsEditing(false);
      alert('Event berhasil diupdate!');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Terjadi error saat mengupdate event');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    if (window.confirm('Apakah Anda yakin ingin menghapus event ini?')) {
      try {
        setLoading(true);
        await userApi.deleteUser(Number(id)); // ✅ Convert string to number
        alert('Event berhasil dihapus!');
        navigate('/');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Terjadi error saat menghapus event');
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
          <LoadingIndicator size="lg" text="Loading event details..." />
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
            <span>{error || 'Event tidak ditemukan'}</span>
          </div>
          <div className="mt-4">
            <Button variant="primary" onClick={handleGoBack}>
              Kembali ke Daftar Event
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
            <h1 className='font-bold text-3xl text-gray-800'>Event Details</h1>
            <p className='text-gray-600 mt-1'>Manage event information and settings</p>
          </div>
          <div className="flex gap-3">
            <Button variant="primary" onClick={handleGoBack}>
              ← Kembali
            </Button>
            {!isEditing ? (
              <Button variant="success" onClick={() => setIsEditing(true)}>
                Edit Event
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
                Event Title
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
                Description
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
                Event Date
              </label>
              <input 
                type="date" 
                id="date" 
                name="date"
                value={formatDateForInput(formData.date)} // ✅ Use helper function
                onChange={handleInputChange}
                disabled={!isEditing}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-200 disabled:cursor-not-allowed" 
                required 
              />
            </div>

            {/* Created At (Read-only) */}
            <div>
              <label htmlFor="created_at" className="block mb-2 text-sm font-medium text-gray-900">
                Created At
              </label>
              <input 
                type="text" 
                id="created_at"
                value={user.created_at ? new Date(user.created_at).toLocaleString() : ''}
                disabled
                className="bg-gray-200 border border-gray-300 text-gray-500 text-sm rounded-lg block w-full p-2.5 cursor-not-allowed" 
              />
            </div>

            {/* Updated At (Read-only) */}
            <div>
              <label htmlFor="updated_at" className="block mb-2 text-sm font-medium text-gray-900">
                Last Updated
              </label>
              <input 
                type="text" 
                id="updated_at"
                value={user.updated_at ? new Date(user.updated_at).toLocaleString() : ''}
                disabled
                className="bg-gray-200 border border-gray-300 text-gray-500 text-sm rounded-lg block w-full p-2.5 cursor-not-allowed" 
              />
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
                  {loading ? 'Deleting...' : 'Delete Event'}
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