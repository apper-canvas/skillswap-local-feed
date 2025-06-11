import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { userService, skillService } from '../services';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userSkills, setUserSkills] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  // Mock current user data
  const mockUser = {
    id: 'current-user',
    name: 'Alex Thompson',
    email: 'alex.thompson@email.com',
    location: 'Downtown District',
    bio: 'Passionate about sharing knowledge and learning new skills. I love connecting with neighbors and building our community through skill exchange.',
    avatar: null,
    rating: 4.8,
    reviewCount: 24,
    creditBalance: 42,
    joinedDate: '2023-08-15',
    completedSessions: 18,
    skillsOffered: 5,
    skillsRequested: 3
  };

  // Mock transactions
  const mockTransactions = [
    {
      id: '1',
      type: 'earned',
      amount: 2,
      description: 'Python Programming session with Sarah',
      timestamp: '2024-01-15T15:00:00Z',
      participantName: 'Sarah Johnson'
    },
    {
      id: '2',
      type: 'spent',
      amount: 1,
      description: 'Guitar lesson with Mike',
      timestamp: '2024-01-14T10:00:00Z',
      participantName: 'Mike Wilson'
    },
    {
      id: '3',
      type: 'earned',
      amount: 3,
      description: 'Web Development workshop',
      timestamp: '2024-01-12T14:00:00Z',
      participantName: 'Lisa Chen'
    }
  ];

  // Mock ratings
  const mockRatings = [
    {
      id: '1',
      rating: 5,
      comment: 'Alex is an amazing teacher! Very patient and knowledgeable.',
      reviewerName: 'Sarah Johnson',
      skillTitle: 'Python Programming',
      timestamp: '2024-01-15T16:00:00Z'
    },
    {
      id: '2',
      rating: 5,
      comment: 'Great session! Learned so much about web development.',
      reviewerName: 'Lisa Chen',
      skillTitle: 'Web Development',
      timestamp: '2024-01-12T15:00:00Z'
    },
    {
      id: '3',
      rating: 4,
      comment: 'Very helpful and well-prepared. Would recommend!',
      reviewerName: 'David Park',
      skillTitle: 'JavaScript Basics',
      timestamp: '2024-01-10T11:00:00Z'
    }
  ];

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      // In a real app, this would load the current user's data
      setUser(mockUser);
      
      const allSkills = await skillService.getAll();
      const currentUserSkills = allSkills.filter(skill => skill.userId === 'current-user');
      setUserSkills(currentUserSkills);
      
      setTransactions(mockTransactions);
      setRatings(mockRatings);
    } catch (err) {
      console.error('Failed to load profile data:', err);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = () => {
    // In a real app, this would save to backend
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTransactionIcon = (type) => {
    return type === 'earned' ? 'TrendingUp' : 'TrendingDown';
  };

  const getTransactionColor = (type) => {
    return type === 'earned' ? 'text-success' : 'text-error';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Profile Header Skeleton */}
          <div className="bg-white rounded-xl shadow-card p-8 animate-pulse">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          </div>
          
          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-card animate-pulse">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-6 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-card p-8"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="w-12 h-12 text-white" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <div className="flex items-center space-x-4 text-gray-600">
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="MapPin" className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Calendar" className="w-4 h-4" />
                    <span>Joined {formatDate(user.joinedDate)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <ApperIcon
                        key={i}
                        name="Star"
                        className={`w-4 h-4 ${
                          i < Math.floor(user.rating) ? 'text-warning fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {user.rating} ({user.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors flex items-center space-x-2"
            >
              <ApperIcon name="Edit" className="w-4 h-4" />
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">About</h3>
            {isEditing ? (
              <div className="space-y-4">
                <textarea
                  value={user.bio}
                  onChange={(e) => setUser(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <p className="text-gray-600">{user.bio}</p>
            )}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Credit Balance', value: user.creditBalance, icon: 'Coins', color: 'text-warning' },
            { label: 'Sessions Completed', value: user.completedSessions, icon: 'CheckCircle', color: 'text-success' },
            { label: 'Skills Teaching', value: user.skillsOffered, icon: 'Lightbulb', color: 'text-primary' },
            { label: 'Skills Learning', value: user.skillsRequested, icon: 'BookOpen', color: 'text-secondary' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-card text-center"
            >
              <div className={`w-12 h-12 ${stat.color.replace('text-', 'bg-')}/10 rounded-full flex items-center justify-center mx-auto mb-3`}>
                <ApperIcon name={stat.icon} className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: 'overview', label: 'Overview', icon: 'BarChart3' },
                { id: 'skills', label: 'My Skills', icon: 'Star' },
                { id: 'transactions', label: 'Transactions', icon: 'CreditCard' },
                { id: 'reviews', label: 'Reviews', icon: 'MessageSquare' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <ApperIcon name={tab.icon} className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {transactions.slice(0, 3).map(transaction => (
                        <div key={transaction.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className={`w-8 h-8 ${
                            transaction.type === 'earned' ? 'bg-success/10' : 'bg-error/10'
                          } rounded-full flex items-center justify-center`}>
                            <ApperIcon 
                              name={getTransactionIcon(transaction.type)} 
                              className={`w-4 h-4 ${getTransactionColor(transaction.type)}`} 
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 truncate">{transaction.description}</p>
                            <p className="text-xs text-gray-500">{formatDate(transaction.timestamp)}</p>
                          </div>
                          <span className={`text-sm font-semibold ${getTransactionColor(transaction.type)}`}>
                            {transaction.type === 'earned' ? '+' : '-'}{transaction.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Skills */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Popular Skills</h3>
                    <div className="space-y-3">
                      {userSkills.filter(s => s.type === 'offer').slice(0, 3).map(skill => (
                        <div key={skill.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <ApperIcon name="Lightbulb" className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{skill.title}</p>
                            <p className="text-xs text-gray-500">{skill.category}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="Star" className="w-3 h-3 text-warning" />
                            <span className="text-xs text-gray-600">4.8</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">My Skills ({userSkills.length})</h3>
                </div>
                
                {userSkills.length === 0 ? (
                  <div className="text-center py-8">
                    <ApperIcon name="Star" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No skills added yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userSkills.map(skill => (
                      <div key={skill.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{skill.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            skill.type === 'offer' ? 'bg-success/10 text-success' : 'bg-info/10 text-info'
                          }`}>
                            {skill.type === 'offer' ? 'Teaching' : 'Learning'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{skill.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 bg-surface text-primary text-xs rounded-full">
                              {skill.category}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              {skill.level}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">Transaction History</h3>
                  <div className="text-lg font-bold text-primary">
                    Balance: {user.creditBalance} credits
                  </div>
                </div>
                
                <div className="space-y-3">
                  {transactions.map(transaction => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 ${
                          transaction.type === 'earned' ? 'bg-success/10' : 'bg-error/10'
                        } rounded-full flex items-center justify-center`}>
                          <ApperIcon 
                            name={getTransactionIcon(transaction.type)} 
                            className={`w-5 h-5 ${getTransactionColor(transaction.type)}`} 
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-sm text-gray-500">with {transaction.participantName}</p>
                          <p className="text-xs text-gray-400">{formatDate(transaction.timestamp)}</p>
                        </div>
                      </div>
                      <div className={`text-lg font-semibold ${getTransactionColor(transaction.type)}`}>
                        {transaction.type === 'earned' ? '+' : '-'}{transaction.amount} credits
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">Reviews & Ratings</h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <ApperIcon
                          key={i}
                          name="Star"
                          className={`w-4 h-4 ${
                            i < Math.floor(user.rating) ? 'text-warning fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium text-gray-900">{user.rating}</span>
                    <span className="text-sm text-gray-500">({user.reviewCount} reviews)</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {ratings.map(rating => (
                    <div key={rating.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900">{rating.reviewerName}</h4>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <ApperIcon
                                  key={i}
                                  name="Star"
                                  className={`w-3 h-3 ${
                                    i < rating.rating ? 'text-warning fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">{rating.skillTitle}</p>
                        </div>
                        <span className="text-xs text-gray-400">{formatDate(rating.timestamp)}</span>
                      </div>
                      <p className="text-gray-700">{rating.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;