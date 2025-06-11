import { useState, useEffect, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import { skillService, matchService, userService } from '../services';

const MainFeature = () => {
  const [skills, setSkills] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('skills'); // 'skills' or 'matches'

  const categories = ['all', 'Technology', 'Music', 'Cooking', 'Language', 'Arts', 'Sports', 'Other'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [skillsData, matchesData] = await Promise.all([
        skillService.getAll(),
        matchService.getAll()
      ]);
      setSkills(skillsData);
      setMatches(matchesData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load skills and matches');
    } finally {
      setLoading(false);
    }
  };

  const handleMatchSkill = async (skillId) => {
    try {
      const newMatch = await matchService.create({
        skillId,
        teacherId: skills.find(s => s.id === skillId)?.userId,
        learnerId: 'current-user',
        status: 'pending',
        compatibilityScore: Math.floor(Math.random() * 30) + 70 // 70-100%
      });
      setMatches(prev => [...prev, newMatch]);
      toast.success('Match request sent!');
    } catch (err) {
      toast.error('Failed to create match');
    }
};

  const filteredSkills = useMemo(() => {
    return selectedCategory === 'all' 
      ? skills 
      : skills.filter(skill => skill.category === selectedCategory);
  }, [skills, selectedCategory]);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Category Filter Skeleton */}
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 w-24 bg-gray-200 rounded-full animate-pulse flex-shrink-0" />
          ))}
        </div>
        
        {/* Skills Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-card"
            >
              <div className="animate-pulse space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-200 rounded-full w-16" />
                  <div className="h-8 bg-gray-200 rounded-lg w-20" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Skills</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (filteredSkills.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="Users" className="w-16 h-16 text-gray-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No skills found</h3>
          <p className="mt-2 text-gray-500">
            {selectedCategory === 'all' 
              ? "Be the first to share your skills with the community!" 
              : `No skills found in ${selectedCategory}. Try a different category.`}
          </p>
          <button
            onClick={() => setSelectedCategory('all')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            View All Skills
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('skills')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'skills'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Browse Skills
          </button>
          <button
            onClick={() => setViewMode('matches')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'matches'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Your Matches ({matches.length})
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'skills' ? (
          <motion.div
            key="skills"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Category Filter */}
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                    selectedCategory === category
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-surface text-gray-600 hover:bg-surface/80'
                  }`}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSkills.map((skill, index) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  index={index}
                  onMatch={handleMatchSkill}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="matches"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {matches.length === 0 ? (
              <div className="text-center py-12">
                <ApperIcon name="Heart" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No matches yet</h3>
                <p className="text-gray-500 mt-2">Start browsing skills to find your perfect learning partners!</p>
                <button
                  onClick={() => setViewMode('skills')}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Browse Skills
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matches.map((match, index) => (
                  <MatchCard key={match.id} match={match} index={index} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SkillCard = memo(({ skill, index, onMatch }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await userService.getById(skill.userId);
        setUser(userData);
      } catch (err) {
        console.error('Failed to load user:', err);
      }
    };
    
    if (skill.userId) {
      loadUser();
    }
  }, [skill.userId]);

  const getTypeColor = (type) => {
    return type === 'offer' ? 'bg-success text-white' : 'bg-info text-white';
  };

  const getTypeIcon = (type) => {
    return type === 'offer' ? 'Lightbulb' : 'BookOpen';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-200 border border-gray-100"
    >
      {/* User Info */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
          <ApperIcon name="User" className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">
            {user?.name || 'Loading...'}
          </h4>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <ApperIcon name="MapPin" className="w-3 h-3" />
            <span>0.5 mi away</span>
            <div className="flex items-center space-x-1">
              <ApperIcon name="Star" className="w-3 h-3 text-warning" />
              <span>{user?.rating || 5.0}</span>
            </div>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(skill.type)}`}>
          <div className="flex items-center space-x-1">
            <ApperIcon name={getTypeIcon(skill.type)} className="w-3 h-3" />
            <span>{skill.type === 'offer' ? 'Teaching' : 'Learning'}</span>
          </div>
        </div>
      </div>

      {/* Skill Info */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{skill.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{skill.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-surface text-primary text-xs font-medium rounded-full">
              {skill.category}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              {skill.level}
            </span>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onMatch(skill.id)}
            className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors"
          >
            <div className="flex items-center space-x-1">
              <ApperIcon name="Heart" className="w-4 h-4" />
              <span>Connect</span>
            </div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const MatchCard = ({ match, index }) => {
  const [skill, setSkill] = useState(null);
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    const loadMatchData = async () => {
      try {
        const [skillData, teacherData] = await Promise.all([
          skillService.getById(match.skillId),
          userService.getById(match.teacherId)
        ]);
        setSkill(skillData);
        setTeacher(teacherData);
      } catch (err) {
        console.error('Failed to load match data:', err);
      }
    };
    loadMatchData();
  }, [match]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-success text-white';
      case 'pending': return 'bg-warning text-gray-800';
      case 'declined': return 'bg-error text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl p-6 shadow-card border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{teacher?.name || 'Loading...'}</h4>
            <p className="text-sm text-gray-500">{skill?.title || 'Loading...'}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(match.status)}`}>
          {match.status}
        </span>
      </div>

      {/* Compatibility Score */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Compatibility</span>
          <span className="text-sm font-bold text-primary">{match.compatibilityScore}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${match.compatibilityScore}%` }}
            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
            transition={{ duration: 1, delay: index * 0.2 }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 px-3 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          <div className="flex items-center justify-center space-x-1">
            <ApperIcon name="MessageCircle" className="w-4 h-4" />
            <span>Message</span>
          </div>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 px-3 py-2 bg-secondary text-white text-sm font-medium rounded-lg hover:bg-secondary/90 transition-colors"
        >
          <div className="flex items-center justify-center space-x-1">
            <ApperIcon name="Calendar" className="w-4 h-4" />
            <span>Schedule</span>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MainFeature;