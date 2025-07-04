import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, MapPin, Settings, MessageCircle, Package, LogOut, Edit, Trash2, AlertCircle, Save, Send, Heart, Recycle, RefreshCw, Gift } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { usePaintListings } from '../hooks/usePaintListings';
import { useMessages } from '../hooks/useMessages';
import { useSavedPaints } from '../hooks/useSavedPaints';
import { usePaintListingActions } from '../hooks/usePaintListingActions';
import { toast } from 'react-hot-toast';

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const { profile, loading: profileLoading, updating, updateProfile } = useProfile();
  const { paintListings, loading: paintLoading } = usePaintListings(true);
  const { messages, replyToMessage, markAsRead } = useMessages();
  const { savedPaints } = useSavedPaints();
  const { toggleSavedPaint, markAsDonated, relistPaint } = usePaintListingActions();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('listings');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedThread, setSelectedThread] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [editForm, setEditForm] = useState({
    name: '',
    postcode: '',
  });

  // Filter donated paints
  const donatedPaints = paintListings.filter(paint => paint.status === 'collected');
  const activePaints = paintListings.filter(paint => paint.status === 'active');

  // Check if we should show messages tab on mount
  useEffect(() => {
    const savedTab = window.sessionStorage.getItem('profileActiveTab');
    if (savedTab) {
      setActiveTab(savedTab);
      window.sessionStorage.removeItem('profileActiveTab');
    }
  }, []);

  // Group messages by conversation (paint listing)
  const conversations = React.useMemo(() => {
    const groups = messages.reduce((acc, message) => {
      const key = message.paint_listing_id;
      if (!acc[key]) {
        acc[key] = {
          paintListing: message.paint_listings,
          messages: [],
          lastMessage: null,
          unreadCount: 0,
          otherUser: message.sender_id === user?.id ? message.receiver : message.sender
        };
      }
      acc[key].messages.push(message);
      if (!acc[key].lastMessage || new Date(message.created_at) > new Date(acc[key].lastMessage.created_at)) {
        acc[key].lastMessage = message;
      }
      if (!message.read && message.receiver_id === user?.id) {
        acc[key].unreadCount++;
      }
      return acc;
    }, {});

    return Object.entries(groups).sort(([,a], [,b]) => 
      new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime()
    );
  }, [messages, user]);

  // Mark unread messages as read when viewing a thread
  React.useEffect(() => {
    if (selectedThread && user) {
      const thread = conversations.find(([id]) => id === selectedThread);
      if (thread) {
        const [, conversation] = thread;
        conversation.messages.forEach(message => {
          if (!message.read && message.receiver_id === user.id) {
            markAsRead(message.id);
          }
        });
      }
    }
  }, [selectedThread, conversations, user, markAsRead]);

  React.useEffect(() => {
    if (profile) {
      setEditForm({
        name: profile.name,
        postcode: profile.postcode || '',
      });
    }
  }, [profile]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (profile) {
      setEditForm({
        name: profile.name,
        postcode: profile.postcode || '',
      });
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    try {
      const success = await updateProfile({
        name: editForm.name,
        postcode: editForm.postcode,
      });

      if (success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setShowDeleteConfirm(true);
  };
  
  const handleConfirmDelete = () => {
    console.log('Deleting item:', itemToDelete);
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!selectedThread || !replyText.trim()) return;

    try {
      const originalMessage = messages.find(m => m.paint_listing_id === selectedThread);
      if (!originalMessage) return;

      await replyToMessage(originalMessage, replyText);
      setReplyText('');
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send message');
    }
  };

  const handleMarkAsDonated = async (paintId) => {
    try {
      await markAsDonated(paintId);
      toast.success('Paint marked as donated successfully');
    } catch (error) {
      console.error('Error marking paint as donated:', error);
      toast.error('Failed to mark paint as donated');
    }
  };

  const handleRelistPaint = async (paintId) => {
    try {
      await relistPaint(paintId);
      toast.success('Paint re-listed successfully');
    } catch (error) {
      console.error('Error re-listing paint:', error);
      toast.error('Failed to re-list paint');
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-50 p-4 rounded-md">
          <p className="text-yellow-700">Please sign in to view your profile.</p>
          <Link 
            to="/login" 
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col items-center text-center">
              <img 
                src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'User')}&background=0D9488&color=fff`}
                alt={profile?.name} 
                className="h-24 w-24 rounded-full object-cover mb-4"
              />
              
              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="w-full">
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="postcode" className="block text-sm font-medium text-gray-700">
                      Postcode
                    </label>
                    <input
                      type="text"
                      id="postcode"
                      value={editForm.postcode}
                      onChange={(e) => setEditForm(prev => ({ ...prev, postcode: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      disabled={updating}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400"
                      disabled={updating}
                    >
                      <Save className="h-4 w-4 inline-block mr-1" />
                      {updating ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-900">{profile?.name}</h2>
                  <p className="text-gray-600 text-sm">Member since {new Date(profile?.created_at).toLocaleDateString()}</p>
                  
                  <div className="mt-6 w-full">
                    <div className="flex items-center text-gray-700 mb-3">
                      <Mail className="h-5 w-5 mr-2 text-gray-500" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                      <span>{profile?.postcode || 'No postcode set'}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleEditClick}
                    className="mt-6 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                </>
              )}
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Dashboard</h3>
              <nav className="space-y-2">
                <button 
                  onClick={() => {
                    setActiveTab('listings');
                    setSelectedThread(null);
                  }}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                    activeTab === 'listings' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Package className="h-5 w-5 mr-2" />
                  My Paint Listings
                  {activePaints.length > 0 && (
                    <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      {activePaints.length}
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => {
                    setActiveTab('donated');
                    setSelectedThread(null);
                  }}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                    activeTab === 'donated' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Recycle className="h-5 w-5 mr-2" />
                  Donated Paints
                  {donatedPaints.length > 0 && (
                    <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      {donatedPaints.length}
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => {
                    setActiveTab('messages');
                    setSelectedThread(null);
                  }}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                    activeTab === 'messages' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Messages
                  {messages.filter(m => !m.read && m.receiver_id === user.id).length > 0 && (
                    <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      {messages.filter(m => !m.read && m.receiver_id === user.id).length}
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => {
                    setActiveTab('saved');
                    setSelectedThread(null);
                  }}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                    activeTab === 'saved' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Saved Paints
                  {savedPaints.length > 0 && (
                    <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      {savedPaints.length}
                    </span>
                  )}
                </button>
                <button 
                  onClick={handleSignOut}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign Out
                </button>
              </nav>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-3">
          {/* Paint Listings Tab */}
          {activeTab === 'listings' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Paint Listings</h2>
                <Link 
                  to="/list-paint"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Add New Listing
                </Link>
              </div>
              
              {activePaints.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <p className="text-gray-600 mb-4">You haven't listed any paint yet.</p>
                  <Link 
                    to="/list-paint"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    List Your First Paint
                  </Link>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {activePaints.map((paint) => (
                      <li key={paint.id} className="p-4 hover:bg-gray-50">
                        <Link to={`/paint/${paint.id}`} className="block">
                          <div className="flex items-center space-x-4">
                            <div 
                              className="h-16 w-16 rounded-md" 
                              style={{ backgroundColor: paint.colour_hex }}
                            ></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {paint.brand} - {paint.colour}
                              </p>
                              <p className="text-sm text-gray-500">
                                {paint.amount} · Added {new Date(paint.created_at).toLocaleDateString()}
                              </p>
                              <div className="flex items-center mt-1">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Active
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-2" onClick={(e) => e.preventDefault()}>
                              <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleMarkAsDonated(paint.id);
                                }}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                              >
                                <Recycle className="h-4 w-4 mr-1" />
                                Mark as Donated
                              </button>
                              <button 
                                className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteClick(paint.id);
                                }}
                                className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Donated Paints Tab */}
          {activeTab === 'donated' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Donated Paints</h2>
              </div>
              
              {donatedPaints.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <Recycle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">You haven't donated any paint yet.</p>
                  <Link 
                    to="/list-paint"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    List Paint to Donate
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {donatedPaints.map((paint) => {
                    // Find conversations related to this paint
                    const paintConversations = conversations.filter(([id]) => id === paint.id);
                    
                    return (
                      <div key={paint.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-4">
                          <div className="flex items-center space-x-4">
                            <div 
                              className="h-16 w-16 rounded-md" 
                              style={{ backgroundColor: paint.colour_hex }}
                            ></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                {paint.brand} - {paint.colour}
                              </p>
                              <p className="text-sm text-gray-500">
                                {paint.amount} · Donated {new Date(paint.updated_at).toLocaleDateString()}
                              </p>
                              <div className="flex items-center mt-1">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  Donated
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRelistPaint(paint.id)}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Re-list Paint
                            </button>
                          </div>

                          {paintConversations.length > 0 && (
                            <div className="mt-4 border-t border-gray-200 pt-4">
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Conversations</h4>
                              <div className="space-y-3">
                                {paintConversations.map(([id, conversation]) => (
                                  <div key={id} className="bg-gray-50 rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center">
                                        <img 
                                          src={conversation.otherUser?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.otherUser?.name || 'User')}&background=0D9488&color=fff`}
                                          alt={conversation.otherUser?.name} 
                                          className="h-6 w-6 rounded-full mr-2"
                                        />
                                        <span className="text-sm font-medium text-gray-900">
                                          {conversation.otherUser?.name}
                                        </span>
                                      </div>
                                      <span className="text-xs text-gray-500">
                                        {new Date(conversation.lastMessage.created_at).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                      {conversation.lastMessage.message}
                                    </p>
                                    <button
                                      onClick={() => {
                                        setActiveTab('messages');
                                        setSelectedThread(id);
                                      }}
                                      className="mt-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                                    >
                                      View Conversation
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedThread ? 'Conversation' : 'Messages'}
                </h2>
                {selectedThread && (
                  <button
                    onClick={() => setSelectedThread(null)}
                    className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                  >
                    Back to Messages
                  </button>
                )}
              </div>
              
              {conversations.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">You don't have any messages yet.</p>
                  <Link 
                    to="/browse"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
                  >
                    Browse Paint Listings
                  </Link>
                </div>
              ) : selectedThread ? (
                // Thread View
                <div className="bg-white rounded-lg shadow-md">
                  {/* Thread Header */}
                  {conversations.find(([id]) => id === selectedThread)?.[1].paintListing && (
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div 
                            className="h-12 w-12 rounded-md mr-4" 
                            style={{ backgroundColor: conversations.find(([id]) => id === selectedThread)[1].paintListing.colour_hex }}
                          ></div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {conversations.find(([id]) => id === selectedThread)[1].paintListing.brand} - {conversations.find(([id]) => id === selectedThread)[1].paintListing.colour}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {conversations.find(([id]) => id === selectedThread)[1].paintListing.amount}
                            </p>
                          </div>
                        </div>
                        
                        {/* Mark as Donated button - only show for paint owner and if paint is active */}
                        {(() => {
                          const paintListing = conversations.find(([id]) => id === selectedThread)?.[1].paintListing;
                          const isPaintOwner = paintListing && user && paintListing.user_id === user.id;
                          const isPaintActive = paintListing && paintListing.status === 'active';
                          
                          if (isPaintOwner && isPaintActive) {
                            return (
                              <button
                                onClick={() => handleMarkAsDonated(selectedThread)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                              >
                                <Gift className="h-4 w-4 mr-2" />
                                Mark as Donated
                              </button>
                            );
                          } else if (isPaintOwner && !isPaintActive) {
                            return (
                              <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                <Gift className="h-4 w-4 mr-2" />
                                Donated
                              </span>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </div>
                  )}
                  
                  {/* Messages */}
                  <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
                    {conversations.find(([id]) => id === selectedThread)?.[1].messages
                      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                      .map((message) => {
                        const isFromMe = message.sender_id === user?.id;
                        
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`flex items-start max-w-[80%] ${isFromMe ? 'flex-row-reverse' : ''}`}>
                              <img 
                                src={
                                  (isFromMe ? profile?.avatar_url : message.sender?.avatar_url) || 
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent((isFromMe ? profile?.name : message.sender?.name) || 'User')}&background=0D9488&color=fff`
                                }
                                alt={(isFromMe ? profile?.name : message.sender?.name) || 'User'} 
                                className="h-8 w-8 rounded-full object-cover"
                              />
                              <div 
                                className={`mx-2 p-3 rounded-lg ${
                                  isFromMe 
                                    ? 'bg-emerald-100 text-emerald-900' 
                                    : 'bg-gray-100 text-gray-900'
                                }`}
                              >
                                <p className="text-sm">{message.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(message.created_at).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                    })}
                  </div>
                  
                  {/* Reply Form */}
                  <form onSubmit={handleSendReply} className="p-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                      />
                      <button
                        type="submit"
                        disabled={!replyText.trim()}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                // Conversations List
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {conversations.map(([paintListingId, conversation]) => (
                      <li 
                        key={paintListingId}
                        onClick={() => setSelectedThread(paintListingId)}
                        className="p-4 hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="flex items-start space-x-4">
                          <div 
                            className="h-12 w-12 rounded-md" 
                            style={{ backgroundColor: conversation.paintListing?.colour_hex }}
                          ></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between">
                              <p className="text-sm font-medium text-gray-900">
                                {conversation.otherUser?.name || 'Unknown User'}
                                {conversation.unreadCount > 0 && (
                                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                    {conversation.unreadCount} new
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(conversation.lastMessage.created_at).toLocaleString()}
                              </p>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {conversation.paintListing?.brand} - {conversation.paintListing?.colour}
                            </p>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                              {conversation.lastMessage.message}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {/* Saved Paints Tab */}
          {activeTab === 'saved' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Saved Paints</h2>
              
              {savedPaints.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <p className="text-gray-600 mb-4">You haven't saved any paint listings yet.</p>
                  <Link 
                    to="/browse"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    Browse Paint Listings
                  </Link>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {savedPaints.map((saved) => {
                      const paint = saved.paint_listing;
                      if (!paint) return null;
                      
                      return (
                        <li key={saved.id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-center space-x-4">
                            <div 
                              className="h-16 w-16 rounded-md" 
                              style={{ backgroundColor: paint.colour_hex }}
                            ></div>
                            <div className="flex-1 min-w-0">
                              <Link to={`/paint/${paint.id}`} className="hover:text-emerald-600">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {paint.brand} - {paint.colour}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {paint.amount} · Added {new Date(saved.created_at).toLocaleDateString()}
                                </p>
                                <div className="flex items-center mt-1">
                                  <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                                  <span className="text-sm text-gray-500">{paint.postcode}</span>
                                </div>
                              </Link>
                            </div>
                            <button 
                              onClick={() => toggleSavedPaint(paint.id)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Heart className="h-5 w-5 fill-current" />
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Paint Listing</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this paint listing? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleConfirmDelete}
                >
                  Delete
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;