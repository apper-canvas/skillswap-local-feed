import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { skillService } from '../services';

const MySkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [activeTab, setActiveTab] = useState('offers');

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const allSkills = await skillService.getAll();
      // Filter for current user's skills (mock - in real app would use auth)
      const userSkills = allSkills.filter(skill => skill.userId === 'current-user');
      setSkills(userSkills);
    } catch (err) {
      setError(err.message || 'Failed to load skills');
      toast.error('Failed to load your skills');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    
    try {
      await skillService.delete(skillId);
      setSkills(prev => prev.filter(skill => skill.id !== skillId));
      toast.success('Skill deleted successfully');
    } catch (err) {
      toast.error('Failed to delete skill');
    }
  };

  const handleEditSkill = (skill) => {
    setEditingSkill(skill);
    setShowForm(true);
  };

  const filteredSkills = skills.filter(skill => 
    activeTab === 'offers' ? skill.type === 'offer' : skill.type === 'request'
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-card animate-pulse">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl text-primary mb-2">My Skills</h1>
          <p className="text-gray-600">Manage what you teach and want to learn</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditingSkill(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>Add Skill</span>
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-6 w-fit">
        <button
          onClick={() => setActiveTab('offers')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'offers'
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Skills I Teach ({skills.filter(s => s.type === 'offer').length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'requests'
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Skills I Want ({skills.filter(s => s.type === 'request').length})
        </button>
      </div>

      {/* Skills Grid */}
      {filteredSkills.length === 0 ? (
        <div className="text-center py-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <ApperIcon 
              name={activeTab === 'offers' ? 'Lightbulb' : 'BookOpen'} 
              className="w-16 h-16 text-gray-300 mx-auto mb-4" 
            />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'offers' ? 'No skills to teach yet' : 'No learning requests yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {activeTab === 'offers' 
                ? 'Share your expertise with the community!' 
                : 'Let neighbors know what you\'d like to learn!'
              }
            </p>
            <button
              onClick={() => {
                setEditingSkill(null);
                setShowForm(true);
              }}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Add Your First {activeTab === 'offers' ? 'Teaching' : 'Learning'} Skill
            </button>
          </motion.div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, index) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              index={index}
              onEdit={() => handleEditSkill(skill)}
              onDelete={() => handleDeleteSkill(skill.id)}
            />
          ))}
        </div>
      )}

      {/* Skill Form Modal */}
      <AnimatePresence>
        {showForm && (
          <SkillFormModal
            skill={editingSkill}
            onClose={() => {
              setShowForm(false);
              setEditingSkill(null);
            }}
            onSave={(skillData) => {
              if (editingSkill) {
                setSkills(prev => prev.map(s => s.id === editingSkill.id ? { ...s, ...skillData } : s));
                toast.success('Skill updated successfully');
              } else {
                const newSkill = { ...skillData, id: Date.now().toString(), userId: 'current-user' };
                setSkills(prev => [...prev, newSkill]);
                toast.success('Skill added successfully');
              }
              setShowForm(false);
              setEditingSkill(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const SkillCard = ({ skill, index, onEdit, onDelete }) => {
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
      className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-200 border border-gray-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(skill.type)}`}>
          <div className="flex items-center space-x-1">
            <ApperIcon name={getTypeIcon(skill.type)} className="w-3 h-3" />
            <span>{skill.type === 'offer' ? 'Teaching' : 'Learning'}</span>
          </div>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={onEdit}
            className="p-1 text-gray-400 hover:text-primary transition-colors"
          >
            <ApperIcon name="Edit" className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-gray-400 hover:text-error transition-colors"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">{skill.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-3">{skill.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-surface text-primary text-xs font-medium rounded-full">
              {skill.category}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              {skill.level}
            </span>
          </div>
        </div>

        {skill.availability && skill.availability.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Available:</p>
            <div className="flex flex-wrap gap-1">
              {skill.availability.slice(0, 3).map((time, i) => (
                <span key={i} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
                  {time}
                </span>
              ))}
              {skill.availability.length > 3 && (
                <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
                  +{skill.availability.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const SkillFormModal = ({ skill, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: skill?.title || '',
    description: skill?.description || '',
    category: skill?.category || 'Technology',
    level: skill?.level || 'Beginner',
    type: skill?.type || 'offer',
    availability: skill?.availability || []
  });

  const categories = ['Technology', 'Music', 'Cooking', 'Language', 'Arts', 'Sports', 'Other'];
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const timeSlots = [
    'Monday Morning', 'Monday Afternoon', 'Monday Evening',
    'Tuesday Morning', 'Tuesday Afternoon', 'Tuesday Evening',
    'Wednesday Morning', 'Wednesday Afternoon', 'Wednesday Evening',
    'Thursday Morning', 'Thursday Afternoon', 'Thursday Evening',
    'Friday Morning', 'Friday Afternoon', 'Friday Evening',
    'Weekend Morning', 'Weekend Afternoon', 'Weekend Evening'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    onSave(formData);
  };

  const handleAvailabilityChange = (timeSlot) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(timeSlot)
        ? prev.availability.filter(t => t !== timeSlot)
        : [...prev.availability, timeSlot]
    }));
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {skill ? 'Edit Skill' : 'Add New Skill'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What type of skill is this?
              </label>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'offer' }))}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    formData.type === 'offer'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  I can teach this
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'request' }))}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    formData.type === 'request'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  I want to learn this
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., Guitar Lessons, Python Programming, Italian Cooking"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={formData.type === 'offer' 
                  ? "Describe what you can teach and your experience..."
                  : "Describe what you want to learn and your current level..."
                }
                required
              />
            </div>

            {/* Category and Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.type === 'offer' ? 'Your Level' : 'Desired Level'}
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                When are you available?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {timeSlots.map(timeSlot => (
                  <label key={timeSlot} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.availability.includes(timeSlot)}
                      onChange={() => handleAvailabilityChange(timeSlot)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">{timeSlot}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                {skill ? 'Update Skill' : 'Add Skill'}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
};

export default MySkills;