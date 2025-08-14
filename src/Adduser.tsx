import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Import separated components and services
// Import separated components and services
import type { User } from './Types'
import { userApi } from './service/Api'
import { Button } from './component/Button'

function AddUser() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Omit<User, 'id'>>({
    firstName: '',
    lastName: '',
    address: '',
    identityNumber: 0,
    birthDate: new Date(),
    status: true
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : 
               type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'date' ? new Date(value) :
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.identityNumber || formData.identityNumber <= 0) {
      newErrors.identityNumber = 'Identity number must be a positive number';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Birth date is required';
    } else {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 17) {
        newErrors.birthDate = 'Minimum age is 17 years';
      }
      
      if (birthDate > today) {
        newErrors.birthDate = 'Birth date cannot be in the future';
      }
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
      firstName: '',
      lastName: '',
      address: '',
      identityNumber: 0,
      birthDate: new Date(),
      status: true
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
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-900">
                First Name
              </label>
              <input 
                type="text" 
                id="firstName" 
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter first name"
                required 
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
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
                value={formData.lastName}
                onChange={handleInputChange}
                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter last name"
                required 
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
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
                value={formData.address}
                onChange={handleInputChange}
                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter address"
                required 
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
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
                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                  errors.identityNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter identity number"
                min="1"
                required 
              />
              {errors.identityNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.identityNumber}</p>
              )}
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
                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                  errors.birthDate ? 'border-red-500' : 'border-gray-300'
                }`}
                max={new Date().toISOString().split('T')[0]}
                required 
              />
              {errors.birthDate && (
                <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>
              )}
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
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
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