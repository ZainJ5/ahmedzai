import { useState, useEffect } from 'react';
import { FaTimes, FaChevronDown, FaCheck, FaGasPump, FaCogs } from 'react-icons/fa';

export default function FilterSidebar({ 
  categories, 
  brands, 
  filters, 
  onFilterChange,
  isMobile = false,
  onClose = () => {}
}) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [expandedSections, setExpandedSections] = useState({
    year: true,
    brands: true,
    categories: true,
    engineConfiguration: true,
    fuelType: true,
    sort: false
  });
  
  const engineConfigOptions = [
    { value: 'Inline', label: 'Inline/Straight' },
    { value: 'V-type', label: 'V-Type (V6, V8, etc.)' },
    { value: 'Flat', label: 'Flat/Boxer' },
    { value: 'Rotary', label: 'Rotary' },
    { value: 'Single', label: 'Single Cylinder' },
    { value: 'Electric', label: 'Electric Motor' },
    { value: 'Hybrid', label: 'Hybrid' },
    { value: 'Other', label: 'Other' }
  ];
  
  const fuelTypeOptions = [
    { value: 'Diesel', label: 'Diesel' },
    { value: 'Gasoline', label: 'Gasoline/Petrol' },
    { value: 'Electric', label: 'Electric' },
    { value: 'Hybrid', label: 'Hybrid' },
    { value: 'CNG', label: 'CNG' },
    { value: 'LPG', label: 'LPG' },
    { value: 'Other', label: 'Other' }
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = [
    { value: '', label: 'All years' },
    ...Array.from({ length: 30 }, (_, i) => ({
      value: (currentYear - i).toString(),
      label: (currentYear - i).toString()
    }))
  ];
  
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);
  
  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCheckboxChange = (key, value) => {
    const currentValues = [...(localFilters[key] || [])];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    const newFilters = { ...localFilters, [key]: newValues };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const isItemSelected = (key, value) => {
    const currentValues = localFilters[key];
    
    if (Array.isArray(currentValues)) {
      return currentValues.includes(value);
    } else if (typeof currentValues === 'string') {
      return currentValues === value;
    }
    return false;
  };

  const clearFilters = () => {
    const resetFilters = {
      category: [],
      brand: [],
      year: '',
      engineConfiguration: '',
      fuelType: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-800">
          Filters
        </h2>
        {isMobile && (
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        )}
      </div>
      
      <div className="p-4">
        <div className="mb-6">
          <div 
            className="flex items-center justify-between cursor-pointer mb-2" 
            onClick={() => toggleSection('year')}
          >
            <h3 className="text-md font-medium text-gray-700">Year</h3>
            <FaChevronDown 
              className={`text-gray-400 transition-transform ${expandedSections.year ? 'transform rotate-180' : ''}`} 
              size={14}
            />
          </div>
          
          {expandedSections.year && (
            <div className="mt-2">
              <select
                value={localFilters.year || ''}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full border border-gray-200 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {yearOptions.map(year => (
                  <option key={year.value} value={year.value}>{year.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <div 
            className="flex items-center justify-between cursor-pointer mb-2" 
            onClick={() => toggleSection('engineConfiguration')}
          >
            <div className="flex items-center">
              <FaCogs className="text-gray-500 mr-2" size={12} />
              <h3 className="text-md font-medium text-gray-700">Engine Type</h3>
            </div>
            <FaChevronDown 
              className={`text-gray-400 transition-transform ${expandedSections.engineConfiguration ? 'transform rotate-180' : ''}`} 
              size={14}
            />
          </div>
          
          {expandedSections.engineConfiguration && (
            <div className="mt-2 space-y-2">
              <div 
                onClick={() => handleFilterChange('engineConfiguration', '')}
                className={`flex items-center gap-2 cursor-pointer py-1 px-2 rounded-md w-full transition-colors ${
                  !localFilters.engineConfiguration ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center ${
                  !localFilters.engineConfiguration 
                    ? 'bg-blue-600 border-blue-600' 
                    : 'border border-gray-300'
                }`}>
                  {!localFilters.engineConfiguration && <FaCheck className="text-white text-xs" />}
                </div>
                <span className="text-sm text-gray-700">All Engine Types</span>
              </div>
              
              {engineConfigOptions.map(option => (
                <div key={option.value} className="flex items-center">
                  <div 
                    onClick={() => handleFilterChange('engineConfiguration', option.value)}
                    className={`flex items-center gap-2 cursor-pointer py-1 px-2 rounded-md w-full transition-colors ${
                      localFilters.engineConfiguration === option.value ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center ${
                      localFilters.engineConfiguration === option.value ? 'bg-blue-600 border-blue-600' : 'border border-gray-300'
                    }`}>
                      {localFilters.engineConfiguration === option.value && <FaCheck className="text-white text-xs" />}
                    </div>
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <div 
            className="flex items-center justify-between cursor-pointer mb-2" 
            onClick={() => toggleSection('fuelType')}
          >
            <div className="flex items-center">
              <FaGasPump className="text-gray-500 mr-2" size={12} />
              <h3 className="text-md font-medium text-gray-700">Fuel Type</h3>
            </div>
            <FaChevronDown 
              className={`text-gray-400 transition-transform ${expandedSections.fuelType ? 'transform rotate-180' : ''}`} 
              size={14}
            />
          </div>
          
          {expandedSections.fuelType && (
            <div className="mt-2 space-y-2">
              <div 
                onClick={() => handleFilterChange('fuelType', '')}
                className={`flex items-center gap-2 cursor-pointer py-1 px-2 rounded-md w-full transition-colors ${
                  !localFilters.fuelType ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center ${
                  !localFilters.fuelType 
                    ? 'bg-blue-600 border-blue-600' 
                    : 'border border-gray-300'
                }`}>
                  {!localFilters.fuelType && <FaCheck className="text-white text-xs" />}
                </div>
                <span className="text-sm text-gray-700">All Fuel Types</span>
              </div>
              
              {fuelTypeOptions.map(option => (
                <div key={option.value} className="flex items-center">
                  <div 
                    onClick={() => handleFilterChange('fuelType', option.value)}
                    className={`flex items-center gap-2 cursor-pointer py-1 px-2 rounded-md w-full transition-colors ${
                      localFilters.fuelType === option.value ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center ${
                      localFilters.fuelType === option.value ? 'bg-blue-600 border-blue-600' : 'border border-gray-300'
                    }`}>
                      {localFilters.fuelType === option.value && <FaCheck className="text-white text-xs" />}
                    </div>
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <div 
            className="flex items-center justify-between cursor-pointer mb-2" 
            onClick={() => toggleSection('brands')}
          >
            <h3 className="text-md font-medium text-gray-700">Brands</h3>
            <FaChevronDown 
              className={`text-gray-400 transition-transform ${expandedSections.brands ? 'transform rotate-180' : ''}`} 
              size={14}
            />
          </div>
          
          {expandedSections.brands && (
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto pr-1 styled-scrollbar">
              {brands.map((brand) => (
                <div key={brand._id} className="flex items-center">
                  <div 
                    onClick={() => handleCheckboxChange('brand', brand._id)}
                    className="flex items-center gap-2 cursor-pointer py-1 px-2 rounded-md w-full transition-colors hover:bg-gray-50"
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center ${
                      isItemSelected('brand', brand._id) 
                        ? 'bg-blue-600 border-blue-600' 
                        : 'border border-gray-300'
                    }`}>
                      {isItemSelected('brand', brand._id) && <FaCheck className="text-white text-xs" />}
                    </div>
                    <span className="text-sm text-gray-700">{brand.name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <div 
            className="flex items-center justify-between cursor-pointer mb-2" 
            onClick={() => toggleSection('categories')}
          >
            <h3 className="text-md font-medium text-gray-700">Categories</h3>
            <FaChevronDown 
              className={`text-gray-400 transition-transform ${expandedSections.categories ? 'transform rotate-180' : ''}`} 
              size={14}
            />
          </div>
          
          {expandedSections.categories && (
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto pr-1 styled-scrollbar">
              {categories.map((category) => (
                <div key={category._id} className="flex items-center">
                  <div 
                    onClick={() => handleCheckboxChange('category', category._id)}
                    className="flex items-center gap-2 cursor-pointer py-1 px-2 rounded-md w-full transition-colors hover:bg-gray-50"
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center ${
                      isItemSelected('category', category._id) 
                        ? 'bg-blue-600 border-blue-600' 
                        : 'border border-gray-300'
                    }`}>
                      {isItemSelected('category', category._id) && <FaCheck className="text-white text-xs" />}
                    </div>
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <div 
            className="flex items-center justify-between cursor-pointer mb-2" 
            onClick={() => toggleSection('sort')}
          >
            <h3 className="text-md font-medium text-gray-700">Sort By</h3>
            <FaChevronDown 
              className={`text-gray-400 transition-transform ${expandedSections.sort ? 'transform rotate-180' : ''}`} 
              size={14}
            />
          </div>
          
          {expandedSections.sort && (
            <div className="mt-2">
              <select
                value={`${localFilters.sortBy || 'createdAt'}-${localFilters.sortOrder || 'desc'}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  handleFilterChange('sortBy', sortBy);
                  handleFilterChange('sortOrder', sortOrder);
                }}
                className="w-full border border-gray-200 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="unitPrice-asc">Price: Low to High</option>
                <option value="unitPrice-desc">Price: High to Low</option>
                <option value="title-asc">Name: A to Z</option>
                <option value="title-desc">Name: Z to A</option>
              </select>
            </div>
          )}
        </div>
      </div>
      
      <div className="px-4 pb-4">
        <button
          onClick={clearFilters}
          className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md transition-colors text-sm flex items-center justify-center"
        >
          <FaTimes className="mr-2" /> Clear All Filters
        </button>
      </div>

      {isMobile && (
        <div className="px-4 pb-4 pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
}