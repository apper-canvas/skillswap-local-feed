import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../components/ApperIcon';
import { userService, skillService } from '../services';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock conversations data
  const mockConversations = [
    {
      id: '1',
      participantId: 'user2',
      lastMessage: 'Sounds good! Let\'s schedule for tomorrow at 3 PM',
      lastMessageTime: '2024-01-15T15:30:00Z',
      unreadCount: 2,
      skillTitle: 'Guitar Lessons'
    },
    {
      id: '2',
      participantId: 'user3',
      lastMessage: 'I\'d love to learn Python from you!',
      lastMessageTime: '2024-01-15T12:00:00Z',
      unreadCount: 0,
      skillTitle: 'Python Programming'
    },
    {
      id: '3',
      participantId: 'user4',
      lastMessage: 'When would be a good time for the cooking lesson?',
      lastMessageTime: '2024-01-14T18:45:00Z',
      unreadCount: 1,
      skillTitle: 'Italian Cooking'
    }
  ];

  const mockMessages = {
    '1': [
      {
        id: '1',
        senderId: 'user2',
        content: 'Hi! I saw your guitar lesson offer. I\'m interested in learning!',
        timestamp: '2024-01-15T14:00:00Z'
      },
      {
        id: '2',
        senderId: 'current-user',
        content: 'Great! I\'d be happy to teach you. What\'s your current skill level?',
        timestamp: '2024-01-15T14:15:00Z'
      },
      {
        id: '3',
        senderId: 'user2',
        content: 'I\'m a complete beginner. Never held a guitar before!',
        timestamp: '2024-01-15T14:30:00Z'
      },
      {
        id: '4',
        senderId: 'current-user',
        content: 'Perfect! We can start with the basics. When would work for you?',
        timestamp: '2024-01-15T15:00:00Z'
      },
      {
        id: '5',
        senderId: 'user2',
        content: 'Sounds good! Let\'s schedule for tomorrow at 3 PM',
        timestamp: '2024-01-15T15:30:00Z'
      }
    ],
    '2': [
      {
        id: '6',
        senderId: 'user3',
        content: 'I\'d love to learn Python from you!',
        timestamp: '2024-01-15T12:00:00Z'
      }
    ],
    '3': [
      {
        id: '7',
        senderId: 'user4',
        content: 'When would be a good time for the cooking lesson?',
        timestamp: '2024-01-14T18:45:00Z'
      }
    ]
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setLoading(true);
    try {
      // Load participant data for each conversation
      const conversationsWithUsers = await Promise.all(
        mockConversations.map(async (conv) => {
          try {
            const participant = await userService.getById(conv.participantId);
            return { ...conv, participant };
          } catch (err) {
            return { ...conv, participant: { name: 'Unknown User', avatar: null } };
          }
        })
      );
      setConversations(conversationsWithUsers);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setMessages(mockMessages[conversation.id] || []);
    // Mark as read
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversation.id 
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const message = {
      id: Date.now().toString(),
      senderId: 'current-user',
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Update last message in conversation
    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedConversation.id
          ? { ...conv, lastMessage: newMessage, lastMessageTime: message.timestamp }
          : conv
      )
    );
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="h-full flex">
        {/* Conversations Skeleton */}
        <div className="w-80 border-r border-gray-200 bg-white">
          <div className="p-4 border-b border-gray-200">
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="space-y-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 animate-pulse">
                <div className="flex space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Messages Skeleton */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse" />
          </div>
          <div className="flex-1 p-4 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-lg animate-pulse ${
                  i % 2 === 0 ? 'bg-gray-200' : 'bg-gray-300'
                }`}>
                  <div className="h-4 bg-gray-400 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex max-w-full overflow-hidden">
      {/* Conversations List */}
      <div className="w-80 border-r border-gray-200 bg-white flex-shrink-0 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
        </div>
        
        {conversations.length === 0 ? (
          <div className="p-8 text-center">
            <ApperIcon name="MessageCircle" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No conversations yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <motion.button
                key={conversation.id}
                whileHover={{ backgroundColor: '#f9fafb' }}
                onClick={() => handleSelectConversation(conversation)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                  selectedConversation?.id === conversation.id ? 'bg-primary/5 border-r-2 border-primary' : ''
                }`}
              >
                <div className="flex space-x-3">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <ApperIcon name="User" className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate">
                        {conversation.participant?.name || 'Unknown User'}
                      </h3>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-1">{conversation.skillTitle}</p>
                    <p className="text-sm text-gray-400 truncate">
                      {conversation.lastMessage}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatMessageTime(conversation.lastMessageTime)}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                  <ApperIcon name="User" className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {selectedConversation.participant?.name}
                  </h2>
                  <p className="text-sm text-gray-500">{selectedConversation.skillTitle}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100">
                  <ApperIcon name="Calendar" className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100">
                  <ApperIcon name="MoreVertical" className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${message.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg break-words ${
                    message.senderId === 'current-user'
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-900 shadow-sm border border-gray-200'
                  }`}>
                    <p>{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.senderId === 'current-user' ? 'text-primary-100' : 'text-gray-500'
                    }`}>
                      {formatMessageTime(message.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ApperIcon name="Send" className="w-4 h-4" />
                </motion.button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <ApperIcon name="MessageCircle" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;