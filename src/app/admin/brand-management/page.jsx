"use client";

import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaTrademark, 
  FaExclamationCircle,
  FaUpload,
  FaSpinner,
  FaSave,
  FaTimes,
  FaImage
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function BrandManagement() {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [currentBrand, setCurrentBrand] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/brands');
      const result = await response.json();
      
      if (result.success) {
        setBrands(result.data);
      } else {
        console.error('Failed to fetch brands:', result.message);
        toast.error('Failed to load brands');
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast.error('Error loading brands');
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddBrand = () => {
    setModalMode('add');
    setFormData({
      name: '',
    });
    setThumbnail(null);
    setThumbnailPreview('');
    setIsModalOpen(true);
  };
  
  const handleEditBrand = (brand) => {
    setModalMode('edit');
    setCurrentBrand(brand);
    setFormData({
      name: brand.name,
    });
    setThumbnailPreview(brand.thumbnail);
    setThumbnail(null);
    setIsModalOpen(true);
  };
  
  const handleDeleteBrand = async () => {
    try {
      const response = await fetch(`/api/brands/${brandToDelete}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        fetchBrands();
        toast.success('Brand deleted successfully');
      } else {
        console.error('Failed to delete brand:', result.message);
        toast.error('Failed to delete brand');
      }
    } catch (error) {
      console.error('Error deleting brand:', error);
      toast.error('Error deleting brand');
    } finally {
      setIsConfirmDialogOpen(false);
      setBrandToDelete(null);
    }
  };

  const openConfirmDialog = (id) => {
    setBrandToDelete(id);
    setIsConfirmDialogOpen(true);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        toast.error('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Brand name is required');
      return;
    }
    
    setSubmitLoading(true);
    
    try {
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      
      if (thumbnail) {
        formDataObj.append('thumbnail', thumbnail);
      }
      
      let response;
      
      if (modalMode === 'add') {
        response = await fetch('/api/brands', {
          method: 'POST',
          body: formDataObj,
        });
      } else {
        response = await fetch(`/api/brands/${currentBrand._id}`, {
          method: 'PUT',
          body: formDataObj,
        });
      }
      
      const result = await response.json();
      
      if (result.success) {
        setIsModalOpen(false);
        fetchBrands();
        toast.success(modalMode === 'add' ? 'Brand added successfully' : 'Brand updated successfully');
      } else {
        console.error('Operation failed:', result.message);
        toast.error('Operation failed. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <FaSpinner className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
          <p className="mt-3 text-gray-600 font-medium">Loading brands...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-2 bg-gradient-to-br from-gray-50 to-gray-100">
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Brand Management</h1>
        
        <button 
          onClick={handleAddBrand}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-lg flex items-center justify-center w-full sm:w-auto transform hover:scale-105"
        >
          <FaPlus className="mr-2" /> Add New Brand
        </button>
      </div>
      
      <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search brands..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <span className="text-sm text-gray-500 font-medium">
              Showing {filteredBrands.length} of {brands.length} brands
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-8 py-6 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">Car Brands</h2>
          
          <button 
            onClick={handleAddBrand}
            className="text-indigo-600 hover:text-indigo-700 flex items-center text-sm font-medium transition-colors duration-200"
          >
            <FaPlus className="mr-1" /> Add Brand
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Brand</th>
                <th scope="col" className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created At</th>
                <th scope="col" className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Updated</th>
                <th scope="col" className="px-8 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBrands.length > 0 ? (
                filteredBrands.map((brand) => (
                  <tr key={brand._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                          <img
                            src={brand.thumbnail || '/placeholder-brand.png'}
                            alt={brand.name}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{brand.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(brand.createdAt)}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(brand.updatedAt)}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleEditBrand(brand)}
                        className="text-indigo-600 hover:text-indigo-800 mr-4 transition-colors duration-200"
                        title="Edit Brand"
                      >
                        <FaEdit className="h-5 cursor-pointer w-5" />
                      </button>
                      <button 
                        onClick={() => openConfirmDialog(brand._id)}
                        className="text-red-600 hover:text-red-800 cursor-pointer transition-colors duration-200"
                        title="Delete Brand"
                      >
                        <FaTrash className="h-5 cursor-pointer w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-8 py-12 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center py-6">
                      <FaExclamationCircle className="h-10 w-10 text-gray-400 mb-3" />
                      <p className="text-gray-600 font-medium">No brands found matching your search criteria</p>
                      {brands.length > 0 && searchTerm && (
                        <button 
                          onClick={() => setSearchTerm('')}
                          className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
                        >
                          Clear search
                        </button>
                      )}
                      {brands.length === 0 && (
                        <button 
                          onClick={handleAddBrand}
                          className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-all duration-200 shadow-lg"
                        >
                          Add your first brand
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg relative shadow-2xl animate-fadeIn">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              disabled={submitLoading}
            >
              <FaTimes className="h-5 w-5" />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{modalMode === 'add' ? 'Add New Brand' : 'Edit Brand'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="brandName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Brand Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="brandName"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50"
                    required
                    placeholder="Enter brand name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Brand Logo
                  </label>
                  <div className="mt-1 flex justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 transition-all duration-200 hover:border-indigo-300">
                    {thumbnailPreview ? (
                      <div className="relative">
                        <div className="relative h-48 w-48 overflow-hidden rounded-lg shadow-inner">
                          <img 
                            src={thumbnailPreview} 
                            alt="Brand Logo"
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setThumbnail(null);
                            setThumbnailPreview('');
                          }}
                          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md text-red-500 hover:text-red-700 transition-colors duration-200"
                          title="Remove image"
                        >
                          <FaTimes className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3 text-center">
                        <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-lg font-medium text-indigo-600 hover:text-indigo-700 focus-within:outline-none transition-colors duration-200">
                            <span>Upload a logo</span>
                            <input 
                              type="file" 
                              className="sr-only"
                              accept="image/*" 
                              onChange={handleThumbnailChange}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                  disabled={submitLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center transition-all duration-200"
                  disabled={submitLoading}
                >
                  {submitLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2 h-5 w-5" />
                      {modalMode === 'add' ? 'Adding...' : 'Updating...'}
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2 h-5 w-5" />
                      {modalMode === 'add' ? 'Save Brand' : 'Update Brand'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isConfirmDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md relative shadow-2xl animate-fadeIn">
            <button 
              onClick={() => setIsConfirmDialogOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <FaTimes className="h-5 w-5" />
            </button>
            
            <div className="flex items-center mb-6">
              <FaExclamationCircle className="h-8 w-8 text-red-500 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Confirm Deletion</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this brand? This action might affect associated cars and cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsConfirmDialogOpen(false)}
                className="px-6 py-3 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBrand}
                className="px-6 py-3 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center transition-all duration-200"
              >
                <FaTrash className="mr-2 h-5 w-5" />
                Delete Brand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}