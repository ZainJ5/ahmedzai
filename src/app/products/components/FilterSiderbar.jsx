import { useState, useEffect } from 'react';
import { FaTimes, FaChevronDown, FaCheck } from 'react-icons/fa';

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
    weight: true,
    brands: true,
    categories: true,
    sort: false
  });
  
  const weightOptions = [
    { value: '10', label: 'Up to 10 Ton', min: '0', max: '10' },
    { value: '20', label: 'Up to 20 Ton', min: '0', max: '20' },
    { value: '30', label: 'Up to 30 Ton', min: '0', max: '30' },
    { value: '40', label: 'Up to 40 Ton', min: '0', max: '40' },
    { value: '50', label: 'Up to 50 Ton', min: '0', max: '50' },
    { value: '51', label: 'Over 50 Ton', min: '50', max: '999999' },
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

  const handleWeightChange = (option) => {
    const newFilters = {
      ...localFilters,
      minWeight: option.min,
      maxWeight: option.max,
      selectedWeight: option.value
    };
    
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
  
  const isWeightSelected = (option) => {
    return localFilters.selectedWeight === option.value;
  };

  const clearFilters = () => {
    const resetFilters = {
      category: [],
      brand: [],
      year: '',
      minWeight: '',
      maxWeight: '',
      selectedWeight: '',
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
            onClick={() => toggleSection('weight')}
          >
            <h3 className="text-md font-medium text-gray-700">Weight</h3>
            <FaChevronDown 
              className={`text-gray-400 transition-transform ${expandedSections.weight ? 'transform rotate-180' : ''}`} 
              size={14}
            />
          </div>
          
          {expandedSections.weight && (
            <div className="mt-2 space-y-2">
              <div 
                onClick={() => {
                  const newFilters = {
                    ...localFilters, 
                    minWeight: '', 
                    maxWeight: '', 
                    selectedWeight: ''
                  };
                  setLocalFilters(newFilters);
                  onFilterChange(newFilters);
                }}
                className={`flex items-center gap-2 cursor-pointer py-1 px-2 rounded-md w-full transition-colors ${
                  !localFilters.selectedWeight ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center ${
                  !localFilters.selectedWeight 
                    ? 'bg-blue-600 border-blue-600' 
                    : 'border border-gray-300'
                }`}>
                  {!localFilters.selectedWeight && <FaCheck className="text-white text-xs" />}
                </div>
                <span className="text-sm text-gray-700">All Weights</span>
              </div>
              
              {weightOptions.map(option => (
                <div key={option.value} className="flex items-center">
                  <div 
                    onClick={() => handleWeightChange(option)}
                    className={`flex items-center gap-2 cursor-pointer py-1 px-2 rounded-md w-full transition-colors ${
                      isWeightSelected(option) ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center ${
                      isWeightSelected(option) ? 'bg-blue-600 border-blue-600' : 'border border-gray-300'
                    }`}>
                      {isWeightSelected(option) && <FaCheck className="text-white text-xs" />}
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