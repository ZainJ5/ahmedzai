'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const HeroManagement = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(null);
  
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');
  
  const fetchSlides = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/hero');
      console.log('Fetched slides:', response.data.data); 
      setSlides(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch hero slides');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSlides();
  }, []);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Only images are allowed');
        e.target.value = null;
        return;
      }
      
      setMediaFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const resetForm = () => {
    setMediaFile(null);
    setMediaPreview('');
    setCurrentSlide(null);
  };
  
  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };
  
  const openEditModal = (slide) => {
    setCurrentSlide(slide);
    setMediaPreview(slide.mediaUrl);
    setShowModal(true);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      
      if (mediaFile) {
        formData.append('media', mediaFile);
      }
      
      if (currentSlide) {
        await axios.put(`/api/hero/${currentSlide._id}`, formData);
      } else {
        formData.append('position', slides.length);
        await axios.post('/api/hero', formData);
      }
      
      setShowModal(false);
      resetForm();
      fetchSlides();
    } catch (err) {
      setError('Error saving hero slide');
      console.error(err);
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this slide?')) {
      try {
        await axios.delete(`/api/hero/${id}`);
        fetchSlides();
      } catch (err) {
        setError('Error deleting hero slide');
        console.error(err);
      }
    }
  };
  
  const moveSlide = async (id, direction) => {
    try {
      const currentIndex = slides.findIndex(slide => slide._id === id);
      if ((direction === 'up' && currentIndex > 0) || 
          (direction === 'down' && currentIndex < slides.length - 1)) {
        
        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        const slideToSwap = slides[newIndex];
        
        const formData1 = new FormData();
        formData1.append('position', slideToSwap.position);
        
        const formData2 = new FormData();
        formData2.append('position', slides[currentIndex].position);
        
        await axios.put(`/api/hero/${id}`, formData1);
        await axios.put(`/api/hero/${slideToSwap._id}`, formData2);
        
        fetchSlides();
      }
    } catch (err) {
      setError('Error reordering slides');
      console.error(err);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Hero Images</h2>
        <button 
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="mr-2" /> Add New Image
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading images...</p>
        </div>
      ) : slides.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hero images found. Click "Add New Image" to upload one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {slides.map((slide) => (
            <div key={slide._id} className="relative bg-gray-100 rounded-lg overflow-hidden group">
              <div className="aspect-w-16 aspect-h-9 relative h-48">
                <img
                  src={slide.mediaUrl} 
                  alt="Hero image" 
                  fill
                  className="object-cover"
                  onError={(e) => {
                    console.error('Failed to load image:', slide.mediaUrl);
                    e.target.src = '/placeholder-image.jpg'; 
                  }}
                  unoptimized 
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(slide)}
                    className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(slide._id)}
                    className="bg-white text-red-600 p-2 rounded-full hover:bg-gray-100"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="absolute top-2 right-2 flex flex-col space-y-1">
                <button
                  onClick={() => moveSlide(slide._id, 'up')}
                  className="bg-white text-blue-600 p-1 rounded-full hover:bg-gray-100"
                  disabled={slides.indexOf(slide) === 0}
                >
                  <FaArrowUp className={slides.indexOf(slide) === 0 ? 'text-gray-300' : ''} />
                </button>
                <button
                  onClick={() => moveSlide(slide._id, 'down')}
                  className="bg-white text-blue-600 p-1 rounded-full hover:bg-gray-100"
                  disabled={slides.indexOf(slide) === slides.length - 1}
                >
                  <FaArrowDown className={slides.indexOf(slide) === slides.length - 1 ? 'text-gray-300' : ''} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {currentSlide ? 'Edit Hero Image' : 'Add New Hero Image'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image {!currentSlide && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-200 focus:border-blue-500"
                    accept="image/*"
                    required={!currentSlide}
                  />
                  <p className="text-xs text-gray-500 mt-1">Max size: 5MB. Recommended size: 1920x1080px</p>
                </div>
                
                {(mediaPreview || currentSlide) && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                    <div className="bg-gray-100 rounded-lg p-2 w-full">
                      <div className="relative w-full h-40">
                        <img
                          src={mediaPreview || currentSlide?.mediaUrl || ''} 
                          alt="Preview" 
                          fill
                          className="object-contain rounded"
                          unoptimized
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                >
                  {currentSlide ? 'Update Image' : 'Upload Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroManagement;