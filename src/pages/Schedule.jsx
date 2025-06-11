import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { userService } from '../services';

const Schedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sessions, setSessions] = useState([]);
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'week'
  const [loading, setLoading] = useState(true);

  // Mock sessions data
  const mockSessions = [
    {
      id: '1',
      title: 'Guitar Lesson with Sarah',
      participantId: 'user2',
      skillTitle: 'Guitar Basics',
      scheduledAt: '2024-01-16T15:00:00Z',
      duration: 60,
      location: 'Community Center',
      status: 'confirmed',
      type: 'teaching'
    },
    {
      id: '2',
      title: 'Python Learning Session',
      participantId: 'user3',
      skillTitle: 'Python Programming',
      scheduledAt: '2024-01-18T10:00:00Z',
      duration: 90,
      location: 'Virtual Meeting',
      status: 'pending',
      type: 'learning'
    },
    {
      id: '3',
      title: 'Italian Cooking Class',
      participantId: 'user4',
      skillTitle: 'Italian Cooking',
      scheduledAt: '2024-01-20T14:00:00Z',
      duration: 120,
      location: 'My Kitchen',
      status: 'confirmed',
      type: 'teaching'
    },
    {
      id: '4',
      title: 'Photography Walk',
      participantId: 'user5',
      skillTitle: 'Photography Basics',
      scheduledAt: '2024-01-22T09:00:00Z',
      duration: 180,
      location: 'Downtown Park',
      status: 'confirmed',
      type: 'learning'
    }
  ];

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    try {
      // Load participant data for each session
      const sessionsWithUsers = await Promise.all(
        mockSessions.map(async (session) => {
          try {
            const participant = await userService.getById(session.participantId);
            return { ...session, participant };
          } catch (err) {
            return { ...session, participant: { name: 'Unknown User' } };
          }
        })
      );
      setSessions(sessionsWithUsers);
    } catch (err) {
      console.error('Failed to load sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSession = (sessionId) => {
    setSessions(prev => 
      prev.map(session => 
        session.id === sessionId 
          ? { ...session, status: 'confirmed' }
          : session
      )
    );
    toast.success('Session confirmed!');
  };

  const handleCancelSession = (sessionId) => {
    if (!confirm('Are you sure you want to cancel this session?')) return;
    
    setSessions(prev => prev.filter(session => session.id !== sessionId));
    toast.success('Session cancelled');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-success text-white';
      case 'pending': return 'bg-warning text-gray-800';
      case 'cancelled': return 'bg-error text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTypeColor = (type) => {
    return type === 'teaching' ? 'bg-primary/10 border-primary text-primary' : 'bg-secondary/10 border-secondary text-secondary';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getSessionsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toDateString();
    return sessions.filter(session => {
      const sessionDate = new Date(session.scheduledAt);
      return sessionDate.toDateString() === dateStr;
    });
  };

  const upcomingSessions = sessions
    .filter(session => new Date(session.scheduledAt) >= new Date())
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-1/4" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-card p-6">
                <div className="h-64 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-card animate-pulse">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl text-primary mb-2">My Schedule</h1>
          <p className="text-gray-600">Manage your skill-sharing sessions</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'month'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar/List View */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            {viewMode === 'month' ? (
              <div className="p-6">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                      <ApperIcon name="ChevronLeft" className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentDate(new Date())}
                      className="px-3 py-1 text-sm text-primary border border-primary rounded-lg hover:bg-primary/5"
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                      <ApperIcon name="ChevronRight" className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                  
                  {getDaysInMonth(currentDate).map((date, index) => {
                    const daySessions = date ? getSessionsForDate(date) : [];
                    const isToday = date && date.toDateString() === new Date().toDateString();
                    
                    return (
                      <div
                        key={index}
                        className={`min-h-[80px] p-1 border border-gray-100 ${
                          date ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                        } ${isToday ? 'bg-primary/5 border-primary/20' : ''}`}
                      >
                        {date && (
                          <>
                            <div className={`text-sm font-medium mb-1 ${
                              isToday ? 'text-primary' : 'text-gray-900'
                            }`}>
                              {date.getDate()}
                            </div>
                            <div className="space-y-1">
                              {daySessions.slice(0, 2).map(session => (
                                <div
                                  key={session.id}
                                  className={`text-xs p-1 rounded text-center truncate ${
                                    session.type === 'teaching' 
                                      ? 'bg-primary/10 text-primary' 
                                      : 'bg-secondary/10 text-secondary'
                                  }`}
                                >
                                  {formatTime(session.scheduledAt)}
                                </div>
                              ))}
                              {daySessions.length > 2 && (
                                <div className="text-xs text-gray-500 text-center">
                                  +{daySessions.length - 2} more
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {sessions.length === 0 ? (
                  <div className="p-12 text-center">
                    <ApperIcon name="Calendar" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions scheduled</h3>
                    <p className="text-gray-500">Start browsing skills to schedule your first session!</p>
                  </div>
                ) : (
                  sessions.map((session, index) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{session.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                              {session.status}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <ApperIcon name="Calendar" className="w-4 h-4" />
                                <span>{formatDate(session.scheduledAt)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <ApperIcon name="Clock" className="w-4 h-4" />
                                <span>{formatTime(session.scheduledAt)} ({session.duration}min)</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ApperIcon name="MapPin" className="w-4 h-4" />
                              <span>{session.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ApperIcon name="User" className="w-4 h-4" />
                              <span>with {session.participant?.name}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className={`px-2 py-1 rounded border text-xs font-medium ${getTypeColor(session.type)}`}>
                            {session.type === 'teaching' ? 'Teaching' : 'Learning'}
                          </div>
                          
                          {session.status === 'pending' && (
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleConfirmSession(session.id)}
                                className="p-1 text-success hover:bg-success/10 rounded"
                              >
                                <ApperIcon name="Check" className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleCancelSession(session.id)}
                                className="p-1 text-error hover:bg-error/10 rounded"
                              >
                                <ApperIcon name="X" className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                          
                          <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                            <ApperIcon name="MoreVertical" className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Sessions Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Upcoming Sessions</h3>
            
            {upcomingSessions.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Clock" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No upcoming sessions</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{session.skillTitle}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(session.type)}`}>
                        {session.type === 'teaching' ? 'Teaching' : 'Learning'}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="User" className="w-3 h-3" />
                        <span>{session.participant?.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Calendar" className="w-3 h-3" />
                        <span>{new Date(session.scheduledAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Clock" className="w-3 h-3" />
                        <span>{formatTime(session.scheduledAt)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">This Month</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sessions Teaching</span>
                <span className="font-semibold text-primary">
                  {sessions.filter(s => s.type === 'teaching').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sessions Learning</span>
                <span className="font-semibold text-secondary">
                  {sessions.filter(s => s.type === 'learning').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Hours</span>
                <span className="font-semibold text-gray-900">
                  {Math.round(sessions.reduce((total, s) => total + s.duration, 0) / 60)}h
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;