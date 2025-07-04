import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Heart, X, Grid, Map } from 'lucide-react';
import MapView from '../components/MapView';
import { usePaintListings } from '../hooks/usePaintListings';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { usePaintListingActions } from '../hooks/usePaintListingActions';
import { useSavedPaints } from '../hooks/useSavedPaints';
import { toast } from 'react-hot-toast';

const BrowsePaintPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    brands: [],
    colorFamilies: [],
    dateOpened: '',
    distance: ''
  });
  const [viewMode, setViewMode] = useState('grid');
  const [mapLoaded, setMapLoaded] = useState(false);

  const { paintListings, loading, error } = usePaintListings();
  const { user } = useAuth();
  const { toggleSavedPaint } = usePaintListingActions();
  const { savedPaints } = useSavedPaints();

  // Track saved paint IDs for quick lookup
  const savedPaintIds = React.useMemo(() => {
    return new Set(savedPaints.map(saved => saved.paint_listing_id));
  }, [savedPaints]);

  useEffect(() => {
    if (viewMode === 'map' && !mapLoaded) {
      setMapLoaded(true);
    }
  }, [viewMode, mapLoaded]);

  const handleCheckboxChange = (filterType, value) => {
    setActiveFilters(prev => {
      const currentValues = [...prev[filterType]];
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [filterType]: currentValues.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [filterType]: [...currentValues, value]
        };
      }
    });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setActiveFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveClick = async (paintId: string, event: React.MouseEvent) => {
    event.preventDefault(); // Prevent navigation if clicking through a Link
    event.stopPropagation(); // Prevent event bubbling
    
    if (!user) {
      toast.error('Please sign in to save paint');
      return;
    }

    try {
      await toggleSavedPaint(paintId);
    } catch (err) {
      console.error('Error saving paint:', err);
    }
  };

  const applyFilters = (paint) => {
    if (activeFilters.brands.length > 0 && !activeFilters.brands.includes(paint.brand)) {
      return false;
    }
    
    if (activeFilters.colorFamilies.length > 0 && !activeFilters.colorFamilies.includes(paint.colorFamily)) {
      return false;
    }
    
    if (activeFilters.dateOpened) {
      const monthsAgo = parseInt(paint.dateOpened);
      if (activeFilters.dateOpened === '6mo' && monthsAgo >= 6) {
        return false;
      } else if (activeFilters.dateOpened === '6-12mo' && (monthsAgo < 6 || monthsAgo > 12)) {
        return false;
      } else if (activeFilters.dateOpened === '12mo+' && monthsAgo <= 12) {
        return false;
      }
    }
    
    if (activeFilters.distance) {
      const maxDistance = parseInt(activeFilters.distance);
      if (paint.distance > maxDistance) {
        return false;
      }
    }
    
    return true;
  };

  const resetFilters = () => {
    setActiveFilters({
      brands: [],
      colorFamilies: [],
      dateOpened: '',
      distance: ''
    });
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'map' : 'grid');
  };

  const filteredPaintListings = paintListings.filter(paint => {
    const matchesSearch = 
      paint.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paint.colour.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paint.postcode.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch && applyFilters(paint);
  });

  const hasActiveFilters = 
    activeFilters.brands.length > 0 || 
    activeFilters.colorFamilies.length > 0 || 
    activeFilters.dateOpened !== '' || 
    activeFilters.distance !== '';

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-600">Loading paint listings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">Error loading paint listings: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Browse Available Paint</h1>
      
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              placeholder="Search by brand, color, or postcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-4 py-2 border ${hasActiveFilters ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 bg-white'} rounded-md shadow-sm text-sm font-medium ${hasActiveFilters ? 'text-emerald-700' : 'text-gray-700'} hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500`}
          >
            <Filter className={`h-5 w-5 mr-2 ${hasActiveFilters ? 'text-emerald-500' : 'text-gray-400'}`} />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                {activeFilters.brands.length + activeFilters.colorFamilies.length + 
                 (activeFilters.dateOpened ? 1 : 0) + (activeFilters.distance ? 1 : 0)}
              </span>
            )}
          </button>
          <button
            onClick={toggleViewMode}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            {viewMode === 'grid' ? (
              <>
                <Map className="h-5 w-5 mr-2 text-gray-400" />
                Map View
              </>
            ) : (
              <>
                <Grid className="h-5 w-5 mr-2 text-gray-400" />
                Grid View
              </>
            )}
          </button>
        </div>
        
        {showFilters && (
          <div className="mt-4 p-4 bg-white border border-gray-200 rounded-md shadow-sm">
            {/* Filter content - unchanged */}
          </div>
        )}
      </div>
      
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {filteredPaintListings.length} {filteredPaintListings.length === 1 ? 'result' : 'results'} found
          {hasActiveFilters && ' with applied filters'}
        </p>
        {hasActiveFilters && (
          <button 
            onClick={resetFilters}
            className="text-sm text-emerald-600 hover:text-emerald-500"
          >
            Clear all filters
          </button>
        )}
      </div>
      
      {filteredPaintListings.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">No paint listings match your search criteria.</p>
          <button 
            onClick={resetFilters}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Clear Filters
          </button>
        </div>
      )}
      
      {filteredPaintListings.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPaintListings.map((paint) => (
            <div key={paint.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Link to={`/paint/${paint.id}`}>
                <div 
                  className="h-48 transition-transform hover:scale-105" 
                  style={{ backgroundColor: paint.colour_hex }}
                ></div>
              </Link>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <Link 
                      to={`/paint/${paint.id}`}
                      className="hover:text-emerald-600"
                    >
                      <h3 className="font-medium text-gray-900">{paint.brand}</h3>
                      <p className="text-gray-600">{paint.colour}</p>
                    </Link>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    {paint.amount}
                  </span>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm text-gray-500 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {paint.postcode}
                    {paint.distance !== null && (
                      <> · {paint.distance} miles away</>
                    )}
                  </span>
                  {user && (
                    <button 
                      onClick={(e) => handleSaveClick(paint.id, e)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Heart 
                        className={`h-5 w-5 ${savedPaintIds.has(paint.id) ? 'fill-current text-red-500' : ''}`} 
                      />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {filteredPaintListings.length > 0 && viewMode === 'map' && mapLoaded && (
        <MapView 
          paintListings={filteredPaintListings} 
          onBackToGrid={() => setViewMode('grid')}
        />
      )}
    </div>
  );
};

export default BrowsePaintPage;