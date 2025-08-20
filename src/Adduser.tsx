import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Import separated components and services
// Import separated components and services
import type { Events } from './Types'
import { userApi } from './service/Api'
import { Button } from './component/Button'

function AddUser() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Omit<Events, 'id'>>({
    title: '',
    description: '',
    date: '',
    created_at: new Date(),
    updated_at: new Date()
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : 
               type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Last name is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } 

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await userApi.createUser(formData);
      alert('User berhasil ditambahkan!');
      navigate('/'); // Navigate back to main page
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Terjadi error saat menambahkan user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      created_at: new Date(),
      updated_at: new Date()
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className='font-bold text-3xl text-gray-800'>Add New User</h1>
            <p className='text-gray-600 mt-1'>Create a new user account</p>
          </div>
          <Button variant="primary" onClick={handleGoBack}>
            ← Kembali
          </Button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">
                Title
              </label>
              <input 
                type="text" 
                id="title" 
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter Title"
                required 
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/*Description */}
            <div>
              <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">
               Description
              </label>
              <input 
                type="text" 
                id="description" 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="EnterDescription"
                required 
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label htmlFor="Date" className="block mb-2 text-sm font-medium text-gray-900">
                Date
              </label>
              <input 
                type="date" 
                id="date" 
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
                required 
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.Date}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <Button 
                type="submit"
                variant="success"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding User...' : 'Add User'}
              </Button>
              
              <Button 
                type="button"
                variant="primary"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                Reset Form
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddUser;