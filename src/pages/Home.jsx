import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';
import { skillService, userService } from '../services';

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSkills: 0,
    activeMatches: 0,
    creditsEarned: 42,
    completedSessions: 0
  });
  const [recentSkills, setRecentSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const skills = await skillService.getAll();
        setRecentSkills(skills.slice(0, 3));
        setStats(prev => ({
          ...prev,
          totalSkills: skills.length,
          activeMatches: Math.floor(skills.length * 0.3),
          completedSessions: Math.floor(skills.length * 0.2)
        }));
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const quickActions = [
    {
      title: 'Browse Skills',
      description: 'Discover what your neighbors can teach',
      icon: 'Search',
      color: 'bg-primary',
      action: () => navigate('/browse')
    },
    {
      title: 'Share a Skill',
      description: 'Teach something you love',
      icon: 'Plus',
      color: 'bg-secondary',
      action: () => navigate('/my-skills')
    },
    {
      title: 'Check Messages',
      description: 'Connect with learning partners',
      icon: 'MessageCircle',
      color: 'bg-accent',
      action: () => navigate('/messages')
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="font-heading text-4xl md:text-5xl text-primary">
          Welcome to Your Community
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Connect with neighbors, share skills, and learn something new. 
          Building community one skill swap at a time.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Skills Available', value: stats.totalSkills, icon: 'Star', color: 'text-primary' },
          { label: 'Active Matches', value: stats.activeMatches, icon: 'Users', color: 'text-secondary' },
          { label: 'Credits Earned', value: stats.creditsEarned, icon: 'Coins', color: 'text-warning' },
          { label: 'Sessions Done', value: stats.completedSessions, icon: 'CheckCircle', color: 'text-success' }
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
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {loading ? '...' : stat.value}
            </div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.action}
              className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-200 text-left group"
            >
              <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <ApperIcon name={action.icon} className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-gray-600 text-sm">{action.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Skills Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Recent Skills</h2>
          <button
            onClick={() => navigate('/browse')}
            className="text-primary hover:text-primary/80 font-medium text-sm flex items-center space-x-1"
          >
            <span>View all</span>
            <ApperIcon name="ArrowRight" className="w-4 h-4" />
          </button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-card animate-pulse">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : recentSkills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentSkills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer"
                onClick={() => navigate('/browse')}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      skill.type === 'offer' ? 'bg-success/10 text-success' : 'bg-info/10 text-info'
                    }`}>
                      {skill.type === 'offer' ? 'Teaching' : 'Learning'}
                    </span>
                    <span className="text-xs text-gray-500">{skill.category}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{skill.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{skill.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-xl shadow-card">
            <ApperIcon name="Lightbulb" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No skills available yet. Be the first to share!</p>
          </div>
        )}
      </div>

      {/* Community Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-secondary rounded-xl p-8 text-white text-center"
      >
        <h2 className="font-heading text-3xl mb-2">Growing Together</h2>
        <p className="text-primary-100 mb-6">
          Join a community where everyone teaches and everyone learns
        </p>
        <div className="grid grid-cols-3 gap-8">
          <div>
            <div className="text-3xl font-bold mb-1">{stats.totalSkills}+</div>
            <div className="text-sm text-primary-100">Skills Shared</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">{stats.activeMatches}+</div>
            <div className="text-sm text-primary-100">Active Connections</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">{stats.completedSessions}+</div>
            <div className="text-sm text-primary-100">Sessions Completed</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;