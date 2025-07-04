import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Droplet, MessageCircle, Heart, Share2, AlertCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { usePaintListingActions } from '../hooks/usePaintListingActions';

const PaintDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [paint, setPaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [message, setMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const { toggleSavedPaint } = usePaintListingActions();

  useEffect(() => {
    const fetchPaintDetails = async () => {
      try {
        if (!id) {
          throw new Error('Paint ID is required');
        }

        const { data, error } = await supabase
          .from('paint_listings')
          .select(`
            *,
            profiles:user_id (
              name,
              postcode,
              avatar_url,
              created_at
            )
          `)
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error('Paint listing not found');

        setPaint(data);

        // Check if paint is saved by current user
        if (user) {
          const { data: savedData, error: savedError } = await supabase
            .from('saved_paints')
            .select('id')
            .eq('paint_listing_id', id)
            .eq('user_id', user.id)
            .maybeSingle();
          
          if (savedError) {
            console.error('Error checking saved status:', savedError);
          } else {
            setIsSaved(!!savedData);
          }
        }
      } catch (err) {
        console.error('Error fetching paint details:', err);
        toast.error('Failed to load paint details');
        navigate('/browse');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPaintDetails();
    }
  }, [id, navigate, user]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to send messages');
      navigate('/login');
      return;
    }

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          paint_listing_id: paint.id,
          sender_id: user.id,
          receiver_id: paint.user_id,
          message: message
        }]);

      if (error) throw error;

      setMessageSent(true);
      setMessage('');
      toast.success('Message sent successfully');

      setTimeout(() => {
        setMessageSent(false);
        setShowMessageForm(false);
      }, 3000);
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message');
    }
  };

  const handleSaveClick = async () => {
    if (!user) {
      toast.error('Please sign in to save paint');
      navigate('/login');
      return;
    }

    try {
      const result = await toggleSavedPaint(paint.id);
      if (result !== null) {
        setIsSaved(result);
      }
    } catch (err) {
      console.error('Error toggling saved paint:', err);
    }
  };

  const handleShareClick = async () => {
    if (isSharing) {
      return; // Prevent multiple share attempts
    }

    try {
      setIsSharing(true);
      if (navigator.share) {
        await navigator.share({
          title: `${paint.brand} - ${paint.colour}`,
          text: `Check out this paint on PaintCycle: ${paint.brand} ${paint.colour}`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (err) {
      // Only show error toast for non-cancellation errors
      if (err.name !== 'AbortError' && err.message !== 'Share canceled') {
        console.error('Error sharing:', err);
        toast.error('Failed to share');
      }
    } finally {
      setIsSharing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-600">Loading paint details...</p>
        </div>
      </div>
    );
  }

  if (!paint) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">Paint listing not found</p>
          <Link 
            to="/browse"
            className="mt-4 inline-flex items-center text-red-700 hover:text-red-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/browse" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Browse
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Paint Colour Display */}
          <div 
            className="h-64 md:h-auto" 
            style={{ backgroundColor: paint.colour_hex }}
          ></div>
          
          {/* Paint Details */}
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{paint.brand}</h1>
                <p className="text-xl text-gray-600">{paint.colour}</p>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                {paint.amount}
              </span>
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                <div>
                  <p className="text-gray-700">{paint.postcode}</p>
                  <p className="text-sm text-gray-500">Exact location shared after messaging</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                <div>
                  <p className="text-gray-700">Opened {new Date(paint.date_opened).toLocaleDateString()}</p>
                  {paint.purchase_location && (
                    <p className="text-sm text-gray-500">Purchased from {paint.purchase_location}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start">
                <Droplet className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                <div>
                  <p className="text-gray-700">Condition: {paint.condition}</p>
                </div>
              </div>
              
              {paint.notes && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <h3 className="font-medium text-gray-900 mb-1">Notes from donor:</h3>
                  <p className="text-gray-700">{paint.notes}</p>
                </div>
              )}
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => setShowMessageForm(!showMessageForm)}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <MessageCircle className="h-5 w-5 mr-1" />
                Contact Donor
              </button>
              <button 
                onClick={handleSaveClick}
                className={`inline-flex items-center justify-center px-4 py-2 border ${
                  isSaved 
                    ? 'border-emerald-500 text-emerald-700 bg-emerald-50' 
                    : 'border-gray-300 text-gray-700 bg-white'
                } text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500`}
              >
                <Heart className={`h-5 w-5 mr-1 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Saved' : 'Save'}
              </button>
              <button 
                onClick={handleShareClick}
                disabled={isSharing}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Share2 className="h-5 w-5 mr-1" />
                Share
              </button>
            </div>
          </div>
        </div>
        
        {/* Message Form */}
        {showMessageForm && (
          <div className="p-6 border-t border-gray-200">
            {messageSent ? (
              <div className="bg-emerald-50 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-emerald-800">Message Sent!</h3>
                    <div className="mt-2 text-sm text-emerald-700">
                      <p>
                        Your message has been sent to the donor. They will be notified and can respond to you directly.
                        You'll receive an email notification when they reply.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendMessage}>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact the Donor</h3>
                <div className="flex items-center mb-4">
                  <img 
                    src={paint.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(paint.profiles?.name || 'User')}&background=0D9488&color=fff`}
                    alt={paint.profiles?.name || 'User'} 
                    className="h-10 w-10 rounded-full object-cover mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{paint.profiles?.name || 'Anonymous User'}</p>
                    <p className="text-sm text-gray-500">
                      Member since {paint.profiles?.created_at ? new Date(paint.profiles.created_at).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </div>
                <textarea
                  rows={4}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="Hi! I'm interested in your paint. When would be a good time to collect it?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowMessageForm(false)}
                    className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
      
      {/* Safety Tips */}
      <div className="mt-8 bg-yellow-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-yellow-800 mb-4">Safety Tips for Collecting Paint</h3>
        <ul className="space-y-2 text-yellow-700">
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-yellow-200 text-yellow-800 mr-2">1</span>
            Meet in a public place during daylight hours when possible.
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-yellow-200 text-yellow-800 mr-2">2</span>
            Check the paint condition before taking it home.
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-yellow-200 text-yellow-800 mr-2">3</span>
            Store paint properly: keep it sealed, away from extreme temperatures, and out of reach of children.
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-yellow-200 text-yellow-800 mr-2">4</span>
            Test the paint on a small area before using it for your entire project.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PaintDetailPage;