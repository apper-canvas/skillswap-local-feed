import MainFeature from '../components/MainFeature';

const BrowseSkills = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl text-primary mb-2">Discover Skills</h1>
        <p className="text-gray-600">Connect with neighbors and learn something new</p>
      </div>
      
      <MainFeature />
    </div>
  );
};

export default BrowseSkills;