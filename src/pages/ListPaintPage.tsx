import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { usePaintListingActions } from '../hooks/usePaintListingActions';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const ListPaintPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createPaintListing, loading } = usePaintListingActions();
  
  const [formData, setFormData] = useState({
    brand: '',
    colour: '',
    colourHex: '#FFFFFF',
    amount: '',
    dateOpened: '',
    purchaseLocation: '',
    postcode: '',
    condition: '',
    notes: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to list paint');
      navigate('/login');
      return;
    }

    try {
      console.log('Current user:', user);
      console.log('Form data:', formData);

      // Convert relative date to actual date
      let dateOpened = new Date();
      switch (formData.dateOpened) {
        case 'Less than 1 month ago':
          dateOpened.setMonth(dateOpened.getMonth() - 1);
          break;
        case '1-3 months ago':
          dateOpened.setMonth(dateOpened.getMonth() - 2);
          break;
        case '3-6 months ago':
          dateOpened.setMonth(dateOpened.getMonth() - 4);
          break;
        case '6-12 months ago':
          dateOpened.setMonth(dateOpened.getMonth() - 9);
          break;
        case 'More than 12 months ago':
          dateOpened.setMonth(dateOpened.getMonth() - 15);
          break;
        case 'Never opened':
          dateOpened = new Date();
          break;
        default:
          dateOpened = new Date();
      }

      console.log('Processed date:', dateOpened.toISOString());

      const paintListing = await createPaintListing({
        brand: formData.brand,
        colour: formData.colour,
        colour_hex: formData.colourHex,
        amount: formData.amount,
        date_opened: dateOpened.toISOString(),
        purchase_location: formData.purchaseLocation || null,
        postcode: formData.postcode,
        condition: formData.condition,
        notes: formData.notes || null,
        status: 'active',
        image_url: null
      });

      console.log('Paint listing result:', paintListing);

      if (paintListing) {
        toast.success('Paint listed successfully!');
        navigate(`/paint/${paintListing.id}`);
      } else {
        throw new Error('Failed to create paint listing');
      }
    } catch (err) {
      console.error('Error creating paint listing:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to list paint');
    }
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-50 p-4 rounded-md">
          <p className="text-yellow-700">Please sign in to list paint.</p>
          <button 
            onClick={() => navigate('/login')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">List Your Paint</h1>
      <p className="text-gray-600 mb-8">
        Share your leftover paint with others in your community. Fill out the form below with as much detail as possible.
      </p>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="space-y-6">
          {/* Paint Details Section */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Paint Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Brand */}
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                  Brand <span className="text-red-500">*</span>
                </label>
                <select
                  id="brand"
                  name="brand"
                  required
                  value={formData.brand}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
                >
                  <option value="">Select a brand</option>
                  <option value="Farrow & Ball">Farrow & Ball</option>
                  <option value="Dulux">Dulux</option>
                  <option value="Crown">Crown</option>
                  <option value="Little Greene">Little Greene</option>
                  <option value="Valspar">Valspar</option>
                  <option value="Benjamin Moore">Benjamin Moore</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              {/* Colour Name */}
              <div>
                <label htmlFor="colour" className="block text-sm font-medium text-gray-700 mb-1">
                  Colour Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="colour"
                  name="colour"
                  required
                  value={formData.colour}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="e.g. Elephant's Breath, Navy Blue"
                />
              </div>
              
              {/* Colour Picker */}
              <div>
                <label htmlFor="colourHex" className="block text-sm font-medium text-gray-700 mb-1">
                  Colour <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    id="colourHex"
                    name="colourHex"
                    required
                    value={formData.colourHex}
                    onChange={handleChange}
                    className="h-10 w-10 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <span className="ml-2 text-sm text-gray-500">
                    Select the closest colour match
                  </span>
                </div>
              </div>
              
              {/* Amount */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount <span className="text-red-500">*</span>
                </label>
                <select
                  id="amount"
                  name="amount"
                  required
                  value={formData.amount}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
                >
                  <option value="">Select amount</option>
                  <option value="Less than 1L">Less than 1L</option>
                  <option value="1L">1L</option>
                  <option value="2L">2L</option>
                  <option value="2.5L">2.5L</option>
                  <option value="3L">3L</option>
                  <option value="5L">5L</option>
                  <option value="More than 5L">More than 5L</option>
                </select>
              </div>
              
              {/* Date Opened */}
              <div>
                <label htmlFor="dateOpened" className="block text-sm font-medium text-gray-700 mb-1">
                  Date Opened <span className="text-red-500">*</span>
                </label>
                <select
                  id="dateOpened"
                  name="dateOpened"
                  required
                  value={formData.dateOpened}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
                >
                  <option value="">Select when opened</option>
                  <option value="Less than 1 month ago">Less than 1 month ago</option>
                  <option value="1-3 months ago">1-3 months ago</option>
                  <option value="3-6 months ago">3-6 months ago</option>
                  <option value="6-12 months ago">6-12 months ago</option>
                  <option value="More than 12 months ago">More than 12 months ago</option>
                  <option value="Never opened">Never opened</option>
                </select>
              </div>
              
              {/* Purchase Location */}
              <div>
                <label htmlFor="purchaseLocation" className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Location
                </label>
                <input
                  type="text"
                  id="purchaseLocation"
                  name="purchaseLocation"
                  value={formData.purchaseLocation}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="e.g. B&Q, Homebase, DIY mix"
                />
              </div>
            </div>
          </div>
          
          {/* Location & Condition Section */}
          <div className="pt-4 border-t border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Location & Condition</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Postcode */}
              <div>
                <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-1">
                  Postcode <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <div className="relative flex items-stretch flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="postcode"
                      name="postcode"
                      required
                      value={formData.postcode}
                      onChange={handleChange}
                      className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g. N1 9GU"
                    />
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Your full address will not be shown publicly
                </p>
              </div>
              
              {/* Condition */}
              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                  Condition <span className="text-red-500">*</span>
                </label>
                <select
                  id="condition"
                  name="condition"
                  required
                  value={formData.condition}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
                >
                  <option value="">Select condition</option>
                  <option value="Unopened">Unopened</option>
                  <option value="Like new (90%+ remaining)">Like new (90%+ remaining)</option>
                  <option value="Good (50-90% remaining)">Good (50-90% remaining)</option>
                  <option value="Some left (25-50% remaining)">Some left (25-50% remaining)</option>
                  <option value="Just a bit (less than 25%)">Just a bit (less than 25%)</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Photo Upload */}
          <div className="pt-4 border-t border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Photo (Optional)</h2>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Camera className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500"
                  >
                    <span>Upload a photo</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>
          
          {/* Additional Notes */}
          <div className="pt-4 border-t border-gray-200">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              placeholder="Any additional information about the paint (e.g. finish type, special instructions)"
            />
          </div>
          
          {/* Safety Notice */}
          <div className="bg-yellow-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Safety Notice</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Please ensure your paint is properly sealed and in good condition. 
                    We recommend only sharing paint that is less than 2 years old.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/browse')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                {loading ? 'Listing...' : 'List Paint'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ListPaintPage;