import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Recycle, Map, MessageCircle, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PaintListing } from '../lib/supabase';
import { useImpactStats } from '../hooks/useImpactStats';

const HomePage = () => {
  const [recentPaintListings, setRecentPaintListings] = useState<PaintListing[]>([]);
  const [loading, setLoading] = useState(true);
  const { totalLitres, donatedPaints, loading: statsLoading } = useImpactStats();
  const [currentDonatedIndex, setCurrentDonatedIndex] = useState(0);

  useEffect(() => {
    const fetchRecentPaintListings = async () => {
      try {
        const { data, error } = await supabase
          .from('paint_listings')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(4);

        if (error) throw error;
        setRecentPaintListings(data || []);
      } catch (err) {
        console.error('Error fetching recent paint listings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPaintListings();

    // Subscribe to changes in paint_listings table
    const subscription = supabase
      .channel('paint_listings_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'paint_listings',
      }, () => {
        // Refetch listings when changes occur
        fetchRecentPaintListings();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const nextDonatedPaint = () => {
    setCurrentDonatedIndex((prev) => 
      prev === donatedPaints.length - 1 ? 0 : prev + 1
    );
  };

  const previousDonatedPaint = () => {
    setCurrentDonatedIndex((prev) => 
      prev === 0 ? donatedPaints.length - 1 : prev - 1
    );
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-500 to-teal-600 py-20 sm:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615529328331-f8917597711f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            1 in 3 UK households wastes leftover paint.<br />
            <span className="text-yellow-300">Let's put it to work.</span>
          </h1>
          <p className="text-xl text-white max-w-3xl mx-auto mb-10">
            PaintCycle London connects you with neighbours to share unused paint—for free. 
            Reduce waste, save money, and colour your world sustainably.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/list-paint" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-emerald-700 bg-white hover:bg-gray-100 md:text-lg">
              List Your Paint
            </Link>
            <Link to="/browse" className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-emerald-700 md:text-lg">
              Browse Local Paint
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          
          <div className="mt-16 bg-white/90 backdrop-blur-sm rounded-lg py-6 px-4 shadow-lg">
            <p className="text-emerald-800 font-medium mb-2">Our Impact So Far</p>
            <div className="text-4xl font-bold text-emerald-700">
              {statsLoading ? (
                <span className="text-2xl">Calculating...</span>
              ) : (
                `${totalLitres.toLocaleString(undefined, { maximumFractionDigits: 1 })} litres`
              )}
            </div>
            <p className="text-gray-600">of paint saved from landfills</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-emerald-100 text-emerald-600 mb-4">
                <Recycle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">List</h3>
              <p className="text-gray-600">Snap a photo, add details, and post your leftover paint for others to use.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-emerald-100 text-emerald-600 mb-4">
                <Map className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Search</h3>
              <p className="text-gray-600">Find the perfect shade nearby using our interactive map and filters.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-emerald-100 text-emerald-600 mb-4">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Collect</h3>
              <p className="text-gray-600">Contact the lister to arrange a convenient collection time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Paints Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Recently Added Paints</h2>
            <Link to="/browse" className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center">
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading recent paint listings...</p>
            </div>
          ) : recentPaintListings.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No paint listings available yet.</p>
              <Link 
                to="/list-paint"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
              >
                Be the First to List Paint
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentPaintListings.map((paint) => (
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
                      <span className="text-sm text-gray-500">{paint.postcode}</span>
                      <Link 
                        to={`/paint/${paint.id}`}
                        className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                      >
                        View details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Donated Paints Carousel */}
          {donatedPaints.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Recently Donated Paints</h2>
              <div className="relative">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="flex items-center">
                    <button
                      onClick={previousDonatedPaint}
                      className="p-2 text-gray-600 hover:text-gray-900"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    
                    <div className="flex-1 p-6">
                      <div className="flex items-center space-x-6">
                        <div 
                          className="h-32 w-32 rounded-md flex-shrink-0" 
                          style={{ backgroundColor: donatedPaints[currentDonatedIndex].colour_hex }}
                        ></div>
                        <div>
                          <h3 className="text-xl font-medium text-gray-900">
                            {donatedPaints[currentDonatedIndex].brand} - {donatedPaints[currentDonatedIndex].colour}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            {donatedPaints[currentDonatedIndex].amount}
                          </p>
                          <p className="text-gray-500 mt-2">
                            Donated by {donatedPaints[currentDonatedIndex].profiles?.name || 'Anonymous'} from {donatedPaints[currentDonatedIndex].postcode}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Donated {new Date(donatedPaints[currentDonatedIndex].updated_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={nextDonatedPaint}
                      className="p-2 text-gray-600 hover:text-gray-900"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-center space-x-2">
                  {donatedPaints.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentDonatedIndex(index)}
                      className={`h-2 w-2 rounded-full ${
                        index === currentDonatedIndex 
                          ? 'bg-emerald-600' 
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Success Stories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                  alt="Sarah" 
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Sarah T.</h3>
                  <p className="text-gray-600">Café Owner, Hackney</p>
                </div>
              </div>
              <p className="text-gray-700">
                "I redecorated my entire café using paint from PaintCycle. Saved over £300 and found the exact shade of blue I was looking for. The process was so simple!"
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                  alt="James" 
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">James K.</h3>
                  <p className="text-gray-600">Interior Designer, Islington</p>
                </div>
              </div>
              <p className="text-gray-700">
                "As a designer, I often need small amounts of specific colors. PaintCycle has been a game-changer for my business and helps me reduce waste on every project."
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                  alt="Maya" 
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Maya L.</h3>
                  <p className="text-gray-600">Community Center Volunteer</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Our community center was transformed with donated paint from PaintCycle. We created a beautiful mural wall that would have been impossible with our limited budget."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to join London's paint-sharing community?</h2>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto mb-8">
            Whether you have leftover paint to share or you're looking for the perfect shade, 
            PaintCycle London makes it easy to connect with neighbors and reduce waste.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-emerald-700 bg-white hover:bg-gray-100 md:text-lg">
              Create an Account
            </Link>
            <Link to="/browse" className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-emerald-600 md:text-lg">
              Start Browsing
            </Link>
          </div>
          <p className="mt-6 text-emerald-200 text-sm">
            #ZeroWasteLondon #SustainableDecor
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
