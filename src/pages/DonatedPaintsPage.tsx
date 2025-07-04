import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Gift } from 'lucide-react';
import { useImpactStats } from '../hooks/useImpactStats';

const DonatedPaintsPage = () => {
  const { donatedPaints, totalLitres, loading } = useImpactStats();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-600">Loading donated paints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Impact Stats */}
      <div className="bg-emerald-50 rounded-lg p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Community Impact</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-emerald-600 font-medium">Total Paint Saved</p>
            <p className="text-4xl font-bold text-emerald-700">
              {totalLitres.toLocaleString(undefined, { maximumFractionDigits: 1 })} litres
            </p>
          </div>
          <div>
            <p className="text-sm text-emerald-600 font-medium">Successful Donations</p>
            <p className="text-4xl font-bold text-emerald-700">
              {donatedPaints.length}
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Donated Paints</h2>

      {donatedPaints.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No paints have been donated yet.</p>
          <Link 
            to="/browse"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
          >
            Browse Available Paint
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donatedPaints.map((paint) => (
            <div key={paint.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div 
                className="h-48" 
                style={{ backgroundColor: paint.colour_hex }}
              ></div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900">
                  {paint.brand} - {paint.colour}
                </h3>
                <p className="text-gray-600 mt-1">{paint.amount}</p>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  {paint.postcode}
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <p>Donated by {paint.profiles?.name || 'Anonymous'}</p>
                  <p>Donated on {new Date(paint.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonatedPaintsPage;