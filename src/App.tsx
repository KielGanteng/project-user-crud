import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'
import './index.css'

// Import separated components and services
// Import separated components and services
import type { Events } from './Types'
import { userApi } from './service/Api'
import { Button } from './component/Button'
import { LoadingIndicator } from './component/LoadingIndicator'
import UserTable from './component/UserTable'
import UserStats from './component/User'

function App() {
  const [users, setUsers] = useState<Events[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await userApi.fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    navigate('/add-user');
  };

  const handleViewDetail = (userId: number) => {
    navigate(`/user/${userId}`);
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      try {
        setIsLoading(true);
        await userApi.deleteUser(userId);
        await fetchUsers(); // Refresh the list
      } catch (error) {
        console.error('Error deleting user:', error);
        setError('Failed to delete user');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Error: </strong>
            <span>{error}</span>
            <button 
              onClick={fetchUsers}
              className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className='font-bold text-3xl text-gray-800'>Users Management</h1>
            <p className="text-gray-600 mt-1">Manage user accounts and information</p>
          </div>
          <Button 
            variant="primary"
            onClick={handleAddUser}
            disabled={isLoading}
          >
            + Add New User
          </Button>
        </div>

        {/* Stats Component */}
        <UserStats users={users} />

        {/* Loading Indicator */}
        {isLoading && users.length === 0 && (
          <LoadingIndicator size="lg" text="Loading users..." />
        )}

        {/* User Table */}
        {!isLoading || users.length > 0 ? (
          <div className="mt-6">
            <UserTable
              users={users}
              onViewDetail={handleViewDetail}
              onDeleteUser={handleDeleteUser}
              isLoading={isLoading}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App