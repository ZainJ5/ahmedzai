import { useState, useEffect } from 'react';
import { FaTimes, FaChevronDown, FaCheck, FaGasPump, FaCar, FaTachometerAlt, FaPalette, FaCarSide, FaTags, FaTruck } from 'react-icons/fa';

export default function FilterSidebar({ 
  productCategories,
  truckCategories,
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
    fuelType: true,
    sort: false,
    model: true,
    chassis: true,
    color: true,
    mileage: true,
    tag: true 
  });
  
  const categoriesToShow = localFilters.tag === 'Trucks' ? truckCategories : productCategories;
  
  const fuelTypeOptions = [
    { value: 'Diesel', label: 'Diesel' },
    { value: 'Gasoline', label: 'Gasoline/Petrol' },
    { value: 'Electric', label: 'Electric' },
    { value: 'Hybrid', label: 'Hybrid' },
    { value: 'CNG', label: 'CNG' },
    { value: 'LPG', label: 'LPG' },
    { value: 'Other', label: 'Other' }
  ];

  const tagOptions = [
    { value: 'Trucks', label: 'Trucks' }
  ];

  const currentYear = new Date().getFullYear();
  const generateYears = (label) => {
    const years = [];
    years.push({ value: '', label: label });
    for (let year = currentYear; year >= currentYear - 30; year--) {
      years.push({ value: year.toString(), label: year.toString() });
    }
    return years;
  };
  
  const yearFromOptions = generateYears('From');
  const yearToOptions = generateYears('To');
  
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);
  
  const handleFilterChange = (key, value) => {
    if (key === 'tag') {
      const newFilters = { 
        ...localFilters, 
        [key]: value,
        category: [] 
      };
      setLocalFilters(newFilters);
      onFilterChange(newFilters);
    } else {
      const newFilters = { ...localFilters, [key]: value };
      setLocalFilters(newFilters);
      onFilterChange(newFilters);
    }
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
      yearFrom: '',
      yearTo: '',
      fuelType: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      model: '',
      chassis: '',
      color: '',
      minMileage: '',
      maxMileage: '',
      tag: '' 
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
            onClick={() => toggleSection('tag')}
          >
            <div className="flex items-center">
              <FaTags className="text-gray-500 mr-2" size={12} />
              <h3 className="text-md font-medium text-gray-700">Vehicle Type</h3>
            </div>
            <FaChevronDown 
              className={`text-gray-400 transition-transform ${expandedSections.tag ? 'transform rotate-180' : ''}`} 
              size={14}
            />
          </div>
          
          {expandedSections.tag && (
            <div className="mt-2 space-y-2">
              <div 
                onClick={() => handleFilterChange('tag', '')}
                className={`flex items-center gap-2 cursor-pointer py-1 px-2 rounded-md w-full transition-colors ${
                  !localFilters.tag ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center ${
                  !localFilters.tag 
                    ? 'bg-blue-600 border-blue-600' 
                    : 'border border-gray-300'
                }`}>
                  {!localFilters.tag && <FaCheck className="text-white text-xs" />}
                </div>
                <span className="text-sm text-gray-700 flex items-center">
                  <FaCarSide className="mr-1" size={12} /> All Vehicles
                </span>
              </div>
              
              {tagOptions.map(option => (
                <div key={option.value} className="flex items-center">
                  <div 
                    onClick={() => handleFilterChange('tag', option.value)}
                    className={`flex items-center gap-2 cursor-pointer py-1 px-2 rounded-md w-full transition-colors ${
                      localFilters.tag === option.value ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center ${
                      localFilters.tag === option.value ? 'bg-blue-600 border-blue-600' : 'border border-gray-300'
                    }`}>
                      {localFilters.tag === option.value && <FaCheck className="text-white text-xs" />}
                    </div>
                    <span className="text-sm text-gray-700 flex items-center">
                      <FaTruck className="mr-1" size={12} /> {option.label} Only
                    </span>
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
            <h3 className="text-md font-medium text-gray-700">
              {localFilters.tag === 'Trucks' ? 'Truck Categories' : 'Vehicle Categories'}
            </h3>
            <FaChevronDown 
              className={`text-gray-400 transition-transform ${expandedSections.categories ? 'transform rotate-180' : ''}`} 
              size={14}
            />
          </div>
          
          {expandedSections.categories && (
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto pr-1 styled-scrollbar">
              {categoriesToShow.length > 0 ? (
                categoriesToShow.map((category) => (
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
                ))
              ) : (
                <div className="text-sm text-gray-500 py-2 italic">
                  No categories available
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mb-6">
          <div 
            className="flex items-center justify-between cursor-pointer mb-2" 
            onClick={() => toggleSection('brands')}
          >
            <h3 className="text-md font-medium text-gray-700">Make/Brand</h3>
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
            onClick={() => toggleSection('model')}
          >
            <div className="flex items-center">
              <FaCar className="text-gray-500 mr-2" size={12} />
              <h3 className="text-md font-medium text-gray-700">Model</h3>
            </div>
            <FaChevronDown 
              className={`text-gray-400 transition-transform ${expandedSections.model ? 'transform rotate-180' : ''}`} 
              size={14}
            />
          </div>
          
          {expandedSections.model && (
            <div className="mt-2">
              <input
                type="text"
                placeholder="Enter model"
                value={localFilters.model || ''}
                onChange={(e) => handleFilterChange('model', e.target.value)}
                className="w-full border border-gray-200 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              />
            </div>
          )}
        </div>

        <div className="mb-6">
          <div 
            className="flex items-center justify-between cursor-pointer mb-2" 
            onClick={() => toggleSection('year')}
          >
            <h3 className="text-md font-medium text-gray-700">Year Range</h3>
            <FaChevronDown 
              className={`text-gray-400 transition-transform ${expandedSections.year ? 'transform rotate-180' : ''}`} 
              size={14}
            />
          </div>
          
          {expandedSections.year && (
            <div className="mt-2 space-y-2">
              <select
                value={localFilters.yearFrom || ''}
                onChange={(e) => handleFilterChange('yearFrom', e.target.value)}
                className="w-full border border-gray-200 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              >
                {yearFromOptions.map(year => (
                  <option key={year.value} value={year.value}>{year.label}</option>
                ))}
              </select>
              <select
                value={localFilters.yearTo || ''}
                onChange={(e) => handleFilterChange('yearTo', e.target.value)}
                className="w-full border border-gray-200 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              >
                {yearToOptions.map(year => (
                  <option key={year.value} value={year.value}>{year.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="mb-6">
          <div 
            className="flex items-center justify-between cursor-pointer mb-2" 
            onClick={() => toggleSection('mileage')}
          >
            <div className="flex items-center">
              <FaTachometerAlt className="text-gray-500 mr-2" size={12} />
              <h3 className="text-md font-medium text-gray-700">Mileage Range</h3>
            </div>
            <FaChevronDown 
              className={`text-gray-400 transition-transform ${expandedSections.mileage ? 'transform rotate-180' : ''}`} 
              size={14}
            />
          </div>
          
          {expandedSections.mileage && (
            <div className="mt-2 space-y-2">
              <input
                type="number"
                placeholder="Min Mileage (e.g. 10000)"
                value={localFilters.minMileage || ''}
                onChange={(e) => handleFilterChange('minMileage', e.target.value)}
                className="w-full border border-gray-200 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              />
              <input
                type="number"
                placeholder="Max Mileage (e.g. 50000)"
                value={localFilters.maxMileage || ''}
                onChange={(e) => handleFilterChange('maxMileage', e.target.value)}
                className="w-full border border-gray-200 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              />
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
            onClick={() => toggleSection('chassis')}
          >
            <div className="flex items-center">
              <FaCarSide className="text-gray-500 mr-2" size={12} />
              <h3 className="text-md font-medium text-gray-700">Chassis</h3>
            </div>
            <FaChevronDown 
              className={`text-gray-400 transition-transform ${expandedSections.chassis ? 'transform rotate-180' : ''}`} 
              size={14}
            />
          </div>
          
          {expandedSections.chassis && (
            <div className="mt-2">
              <input
                type="text"
                placeholder="Enter chassis"
                value={localFilters.chassis || ''}
                onChange={(e) => handleFilterChange('chassis', e.target.value)}
                className="w-full border border-gray-200 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              />
            </div>
          )}
        </div>

        <div className="mb-6">
          <div 
            className="flex items-center justify-between cursor-pointer mb-2" 
            onClick={() => toggleSection('color')}
          >
            <div className="flex items-center">
              <FaPalette className="text-gray-500 mr-2" size={12} />
              <h3 className="text-md font-medium text-gray-700">Colour</h3>
            </div>
            <FaChevronDown 
              className={`text-gray-400 transition-transform ${expandedSections.color ? 'transform rotate-180' : ''}`} 
              size={14}
            />
          </div>
          
          {expandedSections.color && (
            <div className="mt-2">
              <input
                type="text"
                placeholder="Enter colour"
                value={localFilters.color || ''}
                onChange={(e) => handleFilterChange('color', e.target.value)}
                className="w-full border border-gray-200 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              />
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
                className="w-full border border-gray-200 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
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
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors text-sm"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
}