"use client";

import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaTags, 
  FaExclamationCircle,
  FaUpload,
  FaSpinner,
  FaSave,
  FaTimes,
  FaImage,
  FaCarSide,
  FaTruck
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [currentCategory, setCurrentCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); 
  const [formData, setFormData] = useState({
    name: '',
    type: 'product',
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/categories');
      const result = await response.json();
      
      if (result.success) {
        setCategories(result.data);
      } else {
        console.error('Failed to fetch categories:', result.message);
        toast.error('Failed to load categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Error loading categories');
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || category.type === typeFilter;
    
    return matchesSearch && matchesType;
  });
  
  const handleAddCategory = () => {
    setModalMode('add');
    setFormData({
      name: '',
      type: 'product',
    });
    setThumbnail(null);
    setThumbnailPreview('');
    setIsModalOpen(true);
  };
  
  const handleEditCategory = (category) => {
    setModalMode('edit');
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      type: category.type || 'product', 
    });
    setThumbnailPreview(category.thumbnail);
    setThumbnail(null);
    setIsModalOpen(true);
  };
  
  const handleDeleteCategory = async () => {
    try {
      const response = await fetch(`/api/categories/${categoryToDelete}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        fetchCategories();
        toast.success('Category deleted successfully');
      } else {
        console.error('Failed to delete category:', result.message);
        toast.error('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Error deleting category');
    } finally {
      setIsConfirmDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const openConfirmDialog = (id) => {
    setCategoryToDelete(id);
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
      toast.error('Category name is required');
      return;
    }
    
    setSubmitLoading(true);
    
    try {
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('type', formData.type);
      
      if (thumbnail) {
        formDataObj.append('thumbnail', thumbnail);
      }
      
      let response;
      
      if (modalMode === 'add') {
        response = await fetch('/api/categories', {
          method: 'POST',
          body: formDataObj,
        });
      } else {
        response = await fetch(`/api/categories/${currentCategory._id}`, {
          method: 'PUT',
          body: formDataObj,
        });
      }
      
      const result = await response.json();
      
      if (result.success) {
        setIsModalOpen(false);
        fetchCategories();
        toast.success(modalMode === 'add' ? 'Category added successfully' : 'Category updated successfully');
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

  const getCategoryTypeDisplay = (type) => {
    switch (type) {
      case 'truck':
        return (
          <span className="flex items-center text-orange-700 bg-orange-100 px-2.5 py-0.5 rounded-full text-xs font-medium">
            <FaTruck className="mr-1" /> Truck
          </span>
        );
      case 'product':
      default:
        return (
          <span className="flex items-center text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full text-xs font-medium">
            <FaCarSide className="mr-1" /> Product
          </span>
        );
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <FaSpinner className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
          <p className="mt-3 text-gray-600 font-medium">Loading categories...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-2 bg-gradient-to-br from-gray-50 to-gray-100">
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
        
        <button 
          onClick={handleAddCategory}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-lg flex items-center justify-center w-full sm:w-auto transform hover:scale-105 cursor-pointer"
        >
          <FaPlus className="mr-2" /> Add New Category
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
              placeholder="Search categories..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 cursor-text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex space-x-2">
            <button 
              onClick={() => setTypeFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                typeFilter === 'all' 
                ? 'bg-gray-200 text-gray-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setTypeFilter('product')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                typeFilter === 'product' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FaCarSide className="mr-1" /> Products
            </button>
            <button 
              onClick={() => setTypeFilter('truck')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                typeFilter === 'truck' 
                ? 'bg-orange-100 text-orange-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FaTruck className="mr-1" /> Trucks
            </button>
          </div>
          
          <div>
            <span className="text-sm text-gray-500 font-medium">
              Showing {filteredCategories.length} of {categories.length} categories
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-8 py-6 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">Vehicle Categories</h2>
          
          <button 
            onClick={handleAddCategory}
            className="text-indigo-600 hover:text-indigo-700 flex items-center text-sm font-medium transition-colors duration-200 cursor-pointer"
          >
            <FaPlus className="mr-1" /> Add Category
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created At</th>
                <th scope="col" className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Updated</th>
                <th scope="col" className="px-8 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                          <img
                            src={category.thumbnail || '/placeholder-category.png'}
                            alt={category.name}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{category.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      {getCategoryTypeDisplay(category.type)}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(category.createdAt)}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(category.updatedAt)}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleEditCategory(category)}
                        className="text-indigo-600 hover:text-indigo-800 mr-4 transition-colors duration-200 cursor-pointer"
                        title="Edit Category"
                      >
                        <FaEdit className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => openConfirmDialog(category._id)}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200 cursor-pointer"
                        title="Delete Category"
                      >
                        <FaTrash className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-8 py-12 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center py-6">
                      <FaExclamationCircle className="h-10 w-10 text-gray-400 mb-3" />
                      <p className="text-gray-600 font-medium">No categories found matching your search criteria</p>
                      {categories.length > 0 && (searchTerm || typeFilter !== 'all') && (
                        <button 
                          onClick={() => {
                            setSearchTerm('');
                            setTypeFilter('all');
                          }}
                          className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200 cursor-pointer"
                        >
                          Clear filters
                        </button>
                      )}
                      {categories.length === 0 && (
                        <button 
                          onClick={handleAddCategory}
                          className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-all duration-200 shadow-lg cursor-pointer"
                        >
                          Add your first category
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
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
              disabled={submitLoading}
            >
              <FaTimes className="h-5 w-5" />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{modalMode === 'add' ? 'Add New Category' : 'Edit Category'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="categoryName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="categoryName"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 cursor-text"
                    required
                    placeholder="Enter category name"
                  />
                </div>

                <div>
                  <label htmlFor="categoryType" className="block text-sm font-semibold text-gray-700 mb-2">
                    Category Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, type: 'product'})}
                      className={`px-4 py-3 rounded-lg flex items-center justify-center ${
                        formData.type === 'product'
                          ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                          : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                      } transition-all duration-200`}
                    >
                      <FaCarSide className="mr-2" /> Product
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, type: 'truck'})}
                      className={`px-4 py-3 rounded-lg flex items-center justify-center ${
                        formData.type === 'truck'
                          ? 'bg-orange-100 border-2 border-orange-500 text-orange-700'
                          : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                      } transition-all duration-200`}
                    >
                      <FaTruck className="mr-2" /> Truck
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    This determines where this category will appear on the website.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category Thumbnail
                  </label>
                  <div className="mt-1 flex justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 transition-all duration-200 hover:border-indigo-300">
                    {thumbnailPreview ? (
                      <div className="relative">
                        <div className="relative h-48 w-48 overflow-hidden rounded-lg shadow-inner">
                          <img
                            src={thumbnailPreview} 
                            alt="Category Thumbnail"
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
                          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md text-red-500 hover:text-red-700 transition-colors duration-200 cursor-pointer"
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
                            <span>Upload a thumbnail</span>
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
                  className="px-6 py-3 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 cursor-pointer"
                  disabled={submitLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center transition-all duration-200 cursor-pointer"
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
                      {modalMode === 'add' ? 'Save Category' : 'Update Category'}
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
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
            >
              <FaTimes className="h-5 w-5" />
            </button>
            
            <div className="flex items-center mb-6">
              <FaExclamationCircle className="h-8 w-8 text-red-500 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Confirm Deletion</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this category? This action might affect associated cars and cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsConfirmDialogOpen(false)}
                className="px-6 py-3 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategory}
                className="px-6 py-3 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center transition-all duration-200 cursor-pointer"
              >
                <FaTrash className="mr-2 h-5 w-5" />
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}