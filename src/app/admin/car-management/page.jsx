"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaCarSide, 
  FaUpload,
  FaExclamationCircle,
  FaSpinner,
  FaImage,
  FaTimes,
  FaFilter,
  FaSortAmountDown,
  FaChevronDown,
  FaChevronUp,
  FaChevronRight,
  FaCheckCircle,
  FaSave,
  FaArrowLeft,
  FaList,
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaLink,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaQuoteRight,
  FaTable,
  FaGasPump,
  FaCogs,
  FaTachometerAlt
} from 'react-icons/fa';

const CustomEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command, val = null) => {
    if (typeof document !== 'undefined') {
      document.execCommand(command, false, val);
      if (editorRef.current) {
        editorRef.current.focus();
        onChange({ target: { value: editorRef.current.innerHTML } });
      }
    }
  };

  const handleTableInsert = () => {
    const cols = prompt('Enter number of columns', '2');
    const rows = prompt('Enter number of rows', '2');
    if (cols && rows) {
      const table = document.createElement('table');
      table.border = '1';
      table.style.width = '100%';
      table.style.borderCollapse = 'collapse';
      
      for (let i = 0; i < parseInt(rows); i++) {
        const tr = table.insertRow();
        for (let j = 0; j < parseInt(cols); j++) {
          const td = tr.insertCell();
          td.innerHTML = `Cell ${i+1},${j+1}`;
          td.style.border = '1px solid #ccc';
          td.style.padding = '8px';
        }
      }
      
      execCommand('insertHTML', table.outerHTML);
    }
  };

  return (
    <div className="border rounded-lg border-gray-300 overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-300 p-1 flex flex-wrap items-center gap-1">
        <select 
          className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
          onChange={(e) => execCommand('formatBlock', e.target.value)}
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
        </select>
        
        <div className="border-l border-gray-300 h-6 mx-1"></div>
        
        <button type="button" className="p-1.5 rounded hover:bg-gray-200" onClick={() => execCommand('bold')} title="Bold"><FaBold /></button>
        <button type="button" className="p-1.5 rounded hover:bg-gray-200" onClick={() => execCommand('italic')} title="Italic"><FaItalic /></button>
        <button type="button" className="p-1.5 rounded hover:bg-gray-200" onClick={() => execCommand('underline')} title="Underline"><FaUnderline /></button>
        
        <div className="border-l border-gray-300 h-6 mx-1"></div>
        
        <button type="button" className="p-1.5 rounded hover:bg-gray-200" onClick={() => execCommand('insertUnorderedList')} title="Bullet List"><FaListUl /></button>
        <button type="button" className="p-1.5 rounded hover:bg-gray-200" onClick={() => execCommand('insertOrderedList')} title="Numbered List"><FaListOl /></button>
        
        <div className="border-l border-gray-300 h-6 mx-1"></div>
        
        <button type="button" className="p-1.5 rounded hover:bg-gray-200" onClick={() => execCommand('justifyLeft')} title="Align Left"><FaAlignLeft /></button>
        <button type="button" className="p-1.5 rounded hover:bg-gray-200" onClick={() => execCommand('justifyCenter')} title="Align Center"><FaAlignCenter /></button>
        <button type="button" className="p-1.5 rounded hover:bg-gray-200" onClick={() => execCommand('justifyRight')} title="Align Right"><FaAlignRight /></button>
        
        <div className="border-l border-gray-300 h-6 mx-1"></div>
        
        <button type="button" className="p-1.5 rounded hover:bg-gray-200" onClick={() => { const url = prompt('Enter link URL'); if (url) execCommand('createLink', url); }} title="Insert Link"><FaLink /></button>
        <button type="button" className="p-1.5 rounded hover:bg-gray-200" onClick={() => execCommand('formatBlock', '<blockquote>')} title="Quote"><FaQuoteRight /></button>
        <button type="button" className="p-1.5 rounded hover:bg-gray-200" onClick={handleTableInsert} title="Insert Table"><FaTable /></button>
      </div>
      
      <div
        ref={editorRef}
        contentEditable
        className="p-4 min-h-[200px] focus:outline-none"
        onInput={(e) => onChange({ target: { value: e.currentTarget.innerHTML } })}
      />
    </div>
  );
};

export default function CarManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [makes, setMakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [view, setView] = useState('list'); 
  const [formMode, setFormMode] = useState('add');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const limit = 10;
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    make: '',
    unitPrice: '',
    discountPercentage: 0,
    year: new Date().getFullYear(),
    model: '',
    quantity: '',
    weight: '',
    features: '',
    // New fields for fuel, engine, mileage
    fuelType: '',
    engine: {
      displacement: '',
      cylinders: '',
      horsepower: '',
      configuration: ''
    },
    mileage: {
      city: '',
      highway: '',
      unit: 'km/l'
    }
  });
  
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [existingImages, setExistingImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: limit,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedMake) params.append('brand', selectedMake);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      
      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotalProducts(data.pagination.total);
      } else {
        console.error('Failed to fetch products:', data.message);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriesAndMakes = async () => {
    try {
      const [categoriesRes, makesRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/brands')
      ]);
      
      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.data || []);
      }
      
      if (makesRes.ok) {
        const makesData = await makesRes.json();
        setMakes(makesData.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories and makes:', error);
    }
  };

  useEffect(() => {
    if (view === 'list') {
      fetchProducts();
    }
  }, [currentPage, searchTerm, selectedCategory, selectedMake, minPrice, maxPrice, view]);

  useEffect(() => {
    fetchCategoriesAndMakes();
  }, []);

  const resetFormState = () => {
    setFormData({
      title: '', category: '', make: '', unitPrice: '',
      discountPercentage: 0, year: new Date().getFullYear(),
      model: '', quantity: '', weight: '', features: '',
      // Reset new fields
      fuelType: '',
      engine: {
        displacement: '',
        cylinders: '',
        horsepower: '',
        configuration: ''
      },
      mileage: {
        city: '',
        highway: '',
        unit: 'km/l'
      }
    });
    setThumbnailFile(null);
    setNewImageFiles([]);
    setThumbnailPreview('');
    setExistingImages([]);
    setNewImagePreviews([]);
    setCurrentProduct(null);
  };
  
  const handleAddProduct = () => {
    setFormMode('add');
    resetFormState();
    setView('form');
  };

  const handleEditProduct = (product) => {
    setFormMode('edit');
    setCurrentProduct(product);
    setFormData({
      title: product.title,
      category: product.category._id || product.category,
      make: product.make._id || product.make,
      unitPrice: product.unitPrice,
      discountPercentage: product.discountPercentage || 0,
      year: product.year,
      model: product.model,
      quantity: product.quantity,
      weight: product.weight,
      features: product.features,
      // Set values for new fields
      fuelType: product.fuelType || '',
      engine: {
        displacement: product.engine?.displacement || '',
        cylinders: product.engine?.cylinders || '',
        horsepower: product.engine?.horsepower || '',
        configuration: product.engine?.configuration || ''
      },
      mileage: {
        city: product.mileage?.city || '',
        highway: product.mileage?.highway || '',
        unit: product.mileage?.unit || 'km/l'
      }
    });
    setThumbnailFile(null);
    setNewImageFiles([]);
    setThumbnailPreview(product.thumbnail);
    setExistingImages(product.images || []);
    setNewImagePreviews([]);
    setView('form');
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          fetchProducts(); 
        } else {
          const data = await response.json();
          console.error('Failed to delete product:', data.message);
          alert(`Failed to delete product: ${data.message}`);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested object fields
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  const handleFeaturesChange = (e) => {
    setFormData({ ...formData, features: e.target.value });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setThumbnailPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImageFiles(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setNewImagePreviews(prev => [...prev, ev.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const removeNewImage = (index) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Add simple fields
      const simpleFields = ['title', 'model', 'year', 'unitPrice', 'discountPercentage', 'quantity', 'weight', 'features', 'category', 'make', 'fuelType'];
      simpleFields.forEach(field => {
        if (formData[field] !== undefined) {
          formDataToSend.append(field, formData[field]);
        }
      });
      
      // Add nested engine fields
      for (const key in formData.engine) {
        formDataToSend.append(`engine.${key}`, formData.engine[key]);
      }
      
      // Add nested mileage fields
      for (const key in formData.mileage) {
        formDataToSend.append(`mileage.${key}`, formData.mileage[key]);
      }
      
      if (thumbnailFile) {
        formDataToSend.append('thumbnail', thumbnailFile);
      }
      
      newImageFiles.forEach(file => {
        formDataToSend.append('images', file);
      });

      if (formMode === 'edit') {
        existingImages.forEach(image => {
          formDataToSend.append('existingImages', image);
        });
      }
      
      let response;
      if (formMode === 'add') {
        response = await fetch('/api/products', {
          method: 'POST',
          body: formDataToSend,
        });
      } else {
        response = await fetch(`/api/products/${currentProduct._id}`, {
          method: 'PUT',
          body: formDataToSend,
        });
      }
      
      const data = await response.json();
      
      if (data.success) {
        setView('list');
        fetchProducts(); 
      } else {
        console.error('Error saving product:', data.message);
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('An unexpected error occurred while saving the product.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedMake('');
    setMinPrice('');
    setMaxPrice('');
    setCurrentPage(1);
  };

  const cancelForm = () => {
    setView('list');
  };

  const renderForm = () => {
    const allImagePreviews = [...existingImages, ...newImagePreviews];
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {formMode === 'add' ? 'Add New Car' : 'Edit Car'}
              </h1>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <span>Dashboard</span>
                <FaChevronRight className="mx-2 text-gray-400 h-3 w-3" />
                <span>Car Management</span>
                <FaChevronRight className="mx-2 text-gray-400 h-3 w-3" />
                <span className="text-blue-600 font-medium">
                  {formMode === 'add' ? 'Add New Car' : 'Edit Car'}
                </span>
              </div>
            </div>
            
            <button 
              onClick={cancelForm}
              className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg transition-all"
            >
              <FaList className="mr-2" /> 
              <span className="font-medium">Back to List</span>
            </button>
          </div>
        </div>
        
        <div id="productForm" className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white">
            <h2 className="text-xl font-bold flex items-center">
              {formMode === 'add' ? (
                <>
                  <FaPlus className="mr-2" /> Add New Car
                </>
              ) : (
                <>
                  <FaEdit className="mr-2" /> Edit Car: {formData.title}
                </>
              )}
            </h2>
            <p className="mt-1 text-blue-100 text-sm">
              Fill out the form below with the car details. Fields marked with * are required.
            </p>
          </div>
              
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Car Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Brand *
                  </label>
                  <select
                    name="make"
                    value={formData.make}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Brand</option>
                    {makes.map(make => (
                      <option key={make._id} value={make._id}>
                        {make.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Model *
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Year *
                  </label>
                  <input
                    type="number"
                    name="year"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                {/* New field: Fuel Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    <FaGasPump className="inline mr-1" /> Fuel Type *
                  </label>
                  <select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Fuel Type</option>
                    <option value="Gasoline">Gasoline</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="CNG">CNG</option>
                    <option value="LPG">LPG</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Price ($) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      name="unitPrice"
                      min="0"
                      step="0.01"
                      value={formData.unitPrice}
                      onChange={handleInputChange}
                      className="w-full pl-8 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Discount (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="discountPercentage"
                      min="0"
                      max="100"
                      step="0.01"
                      value={formData.discountPercentage}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    min="0"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Weight (kg) *
                  </label>
                  <input
                    type="number"
                    name="weight"
                    min="0"
                    step="0.01"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* New section: Engine Details */}
                <div className="md:col-span-2">
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                      <FaCogs className="mr-2 text-blue-600" /> Engine Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Engine Displacement (cc) *
                        </label>
                        <input
                          type="number"
                          name="engine.displacement"
                          min="0"
                          value={formData.engine.displacement}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Number of Cylinders *
                        </label>
                        <input
                          type="number"
                          name="engine.cylinders"
                          min="0"
                          value={formData.engine.cylinders}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Horsepower (hp) *
                        </label>
                        <input
                          type="number"
                          name="engine.horsepower"
                          min="0"
                          value={formData.engine.horsepower}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Engine Configuration *
                        </label>
                        <input
                          type="text"
                          name="engine.configuration"
                          placeholder="e.g., V6, Inline-4, Flat-6"
                          value={formData.engine.configuration}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* New section: Mileage Information */}
                <div className="md:col-span-2">
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                      <FaTachometerAlt className="mr-2 text-blue-600" /> Mileage Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          City Mileage *
                        </label>
                        <input
                          type="number"
                          name="mileage.city"
                          min="0"
                          step="0.1"
                          value={formData.mileage.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Highway Mileage *
                        </label>
                        <input
                          type="number"
                          name="mileage.highway"
                          min="0"
                          step="0.1"
                          value={formData.mileage.highway}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Mileage Unit *
                        </label>
                        <select
                          name="mileage.unit"
                          value={formData.mileage.unit}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="km/l">km/l</option>
                          <option value="mpg">mpg (Miles Per Gallon)</option>
                          <option value="l/100km">l/100km</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Features *
                  </label>
                  <CustomEditor 
                    value={formData.features} 
                    onChange={handleFeaturesChange}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Use the toolbar to format text, add lists, links and other content
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Thumbnail Image {formMode === 'add' && '*'}
                  </label>
                  <div className="flex items-center space-x-4">
                    {thumbnailPreview ? (
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="h-24 w-24 object-cover rounded-lg border border-gray-200"
                      />
                    ) : (
                      <div className="h-24 w-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400">
                        <FaImage size={24} />
                      </div>
                    )}
                    <div className="flex-1">
                      <label className="flex flex-col items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg border-2 border-blue-100 border-dashed cursor-pointer hover:bg-blue-100 transition-colors">
                        <FaUpload className="mb-1" />
                        <span className="text-sm font-medium">Select Thumbnail</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailChange}
                          className="hidden"
                          required={formMode === 'add' && !thumbnailPreview}
                        />
                      </label>
                      <p className="mt-1 text-xs text-gray-500">
                        Recommended: 800x600px, max 2MB
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Images {formMode === 'add' && '*'}
                  </label>
                  <div>
                    <label className="flex flex-col items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg border-2 border-blue-100 border-dashed cursor-pointer hover:bg-blue-100 transition-colors">
                      <FaUpload className="mb-1" />
                      <span className="text-sm font-medium">Select Multiple Images</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImagesChange}
                        className="hidden"
                        required={formMode === 'add' && allImagePreviews.length === 0}
                      />
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      You can upload multiple images.
                    </p>
                  </div>
                  {allImagePreviews.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {existingImages.map((preview, index) => (
                        <div key={`existing-${index}`} className="relative">
                          <img
                            src={preview}
                            alt={`Image preview ${index + 1}`}
                            className="h-24 w-24 object-cover rounded-md border border-gray-200"
                          />
                          <button type="button" onClick={() => removeExistingImage(index)} className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-600 text-white rounded-full p-1 leading-none">
                            <FaTimes size={10} />
                          </button>
                        </div>
                      ))}
                      {newImagePreviews.map((preview, index) => (
                        <div key={`new-${index}`} className="relative">
                          <img
                            src={preview}
                            alt={`New image preview ${index + 1}`}
                            className="h-24 w-24 object-cover rounded-md border border-gray-200"
                          />
                          <button type="button" onClick={() => removeNewImage(index)} className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-600 text-white rounded-full p-1 leading-none">
                            <FaTimes size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-8 flex items-center justify-end space-x-3 border-t border-gray-100 pt-6">
                <button
                  type="button"
                  onClick={cancelForm}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shadow-sm"
                  disabled={submitting}
                >
                  <div className="flex items-center">
                    <FaArrowLeft className="mr-2" />
                    Cancel
                  </div>
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="flex items-center">
                      <FaSpinner className="animate-spin mr-2" />
                      {formMode === 'add' ? 'Adding...' : 'Updating...'}
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <FaSave className="mr-2" />
                      {formMode === 'add' ? 'Save New Car' : 'Update Car'}
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const renderList = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Car Management</h1>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <span>Dashboard</span>
                <FaChevronRight className="mx-2 text-gray-400 h-3 w-3" />
                <span className="text-blue-600 font-medium">Car Management</span>
              </div>
            </div>
            
            <div className="flex items-center mt-3 sm:mt-0">              
              <button 
                onClick={handleAddProduct}
                className="flex items-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                <FaPlus className="mr-2" /> 
                <span className="font-medium">Add New Car</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-800 flex items-center">
                <FaFilter className="mr-2 text-blue-600" /> 
                Search & Filters
              </h2>
              <button 
                onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
                className="text-gray-500 hover:text-gray-700"
              >
                {isFiltersExpanded ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>
          </div>
          
          <div className={`transition-all duration-300 overflow-hidden ${isFiltersExpanded ? 'max-h-96' : 'max-h-24'}`}>
            <div className="p-5 bg-gray-50 border-b border-gray-100">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search cars by name, model, or features..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <select
                    value={selectedMake}
                    onChange={(e) => setSelectedMake(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Brands</option>
                    {makes.map(make => (
                      <option key={make._id} value={make._id}>
                        {make.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                  <input
                    type="number"
                    placeholder="$0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                  <input
                    type="number"
                    placeholder="No limit"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reset Filters
                </button>
                <button
                  onClick={() => fetchProducts()}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
            <div className="flex flex-wrap justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <FaCarSide className="mr-2 text-blue-600" /> Car Inventory
              </h2>
              <div className="text-sm text-gray-500 mt-2 sm:mt-0">
                Total: <span className="font-semibold text-blue-600">{totalProducts}</span> cars
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 font-medium">Loading car inventory...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car Details</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inventory</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.length > 0 ? (
                    products.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-14 w-14">
                              {product.thumbnail ? (
                                <img
                                  className="h-14 w-14 rounded-lg object-cover shadow-sm border border-gray-200"
                                  src={product.thumbnail}
                                  alt={product.title}
                                />
                              ) : (
                                <div className="h-14 w-14 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                                  <FaCarSide className="text-gray-400" size={24} />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.title}</div>
                              <div className="text-xs text-gray-500">{product.model}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {product.category?.name || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {product.make?.name || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">${product.unitPrice?.toLocaleString()}</div>
                          {product.discountPercentage > 0 && (
                            <div className="text-xs font-medium text-green-600 flex items-center">
                              <FaCheckCircle className="mr-1" size={10} /> {product.discountPercentage}% off
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className={`text-sm font-medium ${
                            product.quantity > 10 
                              ? 'text-green-600' 
                              : product.quantity > 0 
                                ? 'text-orange-500' 
                                : 'text-red-600'
                          }`}>
                            {product.quantity} units
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {product.year}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <button 
                              onClick={() => handleEditProduct(product)}
                              className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100"
                              title="Edit"
                            >
                              <FaEdit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product._id)}
                              className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                              title="Delete"
                            >
                              <FaTrash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center">
                          <FaExclamationCircle className="h-12 w-12 text-gray-300 mb-4" />
                          <p className="text-gray-500 font-medium mb-2">No cars found</p>
                          <p className="text-gray-400 text-sm max-w-md">
                            No cars match your search criteria. Try adjusting your filters or add a new car.
                          </p>
                          <button
                            onClick={handleAddProduct}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <FaPlus className="inline mr-2" /> Add Your First Car
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {totalPages > 1 && (
            <div className="bg-white px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{currentPage}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`px-3 py-2 rounded-md text-sm font-medium ${
                            currentPage === pageNumber
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return view === 'form' ? renderForm() : renderList();
}