import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Send, ChevronDown, ChevronUp, Gift } from 'lucide-react';
import { useMessages } from '../hooks/useMessages';
import { useAuth } from '../contexts/AuthContext';
import { Message } from '../lib/supabase';
import { usePaintListingActions } from '../hooks/usePaintListingActions';
import { toast } from 'react-hot-toast';

type GroupedMessages = {
  [key: string]: Message[];
};

const MessagesPage = () => {
  const { messages, loading, error, replyToMessage, markAsRead } = useMessages();
  const { user } = useAuth();
  const { markAsDonated } = usePaintListingActions();
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [sendingReply, setSendingReply] = useState(false);
  const [expandedThreads, setExpandedThreads] = useState<{ [key: string]: boolean }>({});

  const groupedMessages = useMemo(() => {
    return messages.reduce<GroupedMessages>((acc, message) => {
      const key = message.paint_listing_id;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(message);
      return acc;
    }, {});
  }, [messages]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const toggleThread = (paintingId: string) => {
    setExpandedThreads(prev => ({
      ...prev,
      [paintingId]: !prev[paintingId]
    }));
  };

  const handleReplyClick = (message: Message) => {
    setReplyingTo(message);
    setReplyText('');
  };

  const handleMarkAsDonated = async (paintListingId: string) => {
    try {
      await markAsDonated(paintListingId);
      toast.success('Paint marked as donated successfully');
    } catch (error) {
      console.error('Error marking paint as donated:', error);
      toast.error('Failed to mark paint as donated');
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedThread || !replyText.trim()) return;

    try {
      setSendingReply(true);
      const originalMessage = messages.find(m => m.paint_listing_id === selectedThread);
      if (!originalMessage) return;

      await replyToMessage(originalMessage, replyText);
      setReplyText('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send message');
    } finally {
      setSendingReply(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-50 p-4 rounded-md">
          <p className="text-yellow-700">Please sign in to view your messages.</p>
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">Error loading messages: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link to="/profile" className="inline-flex items-center text-emerald-600 hover:text-emerald-700">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Profile
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
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
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedMessages).map(([paintingId, messages]) => {
            const latestMessage = messages[0];
            const paintListing = latestMessage.paint_listings;
            const isExpanded = expandedThreads[paintingId];
            const unreadCount = messages.filter(m => !m.read && m.receiver_id === user.id).length;
            const isDonor = paintListing && user.id === paintListing.user_id;
            const isPaintDonated = paintListing && paintListing.status === 'collected';

            return (
              <div key={paintingId} className="bg-white rounded-lg shadow overflow-hidden">
                <div 
                  className="p-4 bg-gray-50 flex items-center justify-between cursor-pointer"
                  onClick={() => toggleThread(paintingId)}
                >
                  <div>
                    <h3 className="font-medium text-gray-900 flex items-center gap-2">
                      {paintListing?.brand} - {paintListing?.colour}
                      {unreadCount > 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          {unreadCount} new
                        </span>
                      )}
                      {isPaintDonated && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Donated
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Last message: {new Date(latestMessage.created_at).toLocaleString()}
                    </p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>

                {isExpanded && (
                  <div className="divide-y divide-gray-100">
                    {/* Paint Listing Details */}
                    {paintListing && (
                      <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div 
                              className="h-12 w-12 rounded-md" 
                              style={{ backgroundColor: paintListing.colour_hex }}
                            ></div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {paintListing.brand} - {paintListing.colour}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {paintListing.amount} · {paintListing.postcode}
                              </p>
                            </div>
                          </div>
                          {isDonor && !isPaintDonated && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsDonated(paintingId);
                              }}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            >
                              <Gift className="h-4 w-4 mr-2" />
                              Mark as Donated
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {messages.map((message) => {
                      const isFromMe = message.sender_id === user?.id;
                      const otherUser = isFromMe ? message.receiver : message.sender;
                      const userName = otherUser?.name || 'Unknown User';
                      const initials = getInitials(userName);

                      return (
                        <div
                          key={message.id}
                          className={`p-4 ${!message.read && !isFromMe ? 'bg-emerald-50' : ''}`}
                          onClick={() => !message.read && !isFromMe && markAsRead(message.id)}
                        >
                          <div className={`flex items-start gap-3 ${isFromMe ? 'flex-row-reverse' : ''}`}>
                            <div 
                              className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-medium"
                            >
                              {initials}
                            </div>
                            <div className={`flex-1 ${isFromMe ? 'text-right' : ''}`}>
                              <p className="text-sm font-medium text-gray-900">
                                {isFromMe ? 'You' : userName}
                                {!message.read && !isFromMe && (
                                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                    New
                                  </span>
                                )}
                              </p>
                              <p className="mt-1 text-sm text-gray-700">{message.message}</p>
                              <p className="mt-1 text-xs text-gray-500">
                                {new Date(message.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          {!isFromMe && (
                            <div className="mt-2 flex justify-end">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReplyClick(message);
                                }}
                                className="inline-flex items-center px-2 py-1 text-sm text-emerald-600 hover:text-emerald-700"
                              >
                                <Send className="h-4 w-4 mr-1" />
                                Reply
                              </button>
                            </div>
                          )}

                          {replyingTo?.id === message.id && (
                            <form
                              onSubmit={(e) => handleSendReply(e, message)}
                              className="mt-3 space-y-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Type your reply..."
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                                rows={3}
                                required
                              />
                              <div className="flex justify-end space-x-2">
                                <button
                                  type="button"
                                  onClick={() => setReplyingTo(null)}
                                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  disabled={sendingReply || !replyText.trim()}
                                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Send
                                </button>
                              </div>
                            </form>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MessagesPage;