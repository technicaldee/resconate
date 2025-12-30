import React, { useState } from 'react';

const ResourceLibrary = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const resources = [
    {
      id: 1,
      title: 'Complete Guide to HR Compliance in Akwa Ibom',
      category: 'guides',
      type: 'PDF',
      size: '2.4 MB',
      downloads: 1247,
      description: 'Comprehensive guide covering all compliance requirements for businesses in Akwa Ibom State',
      icon: '📘'
    },
    {
      id: 2,
      title: 'Payroll Processing Checklist for Nigerian Businesses',
      category: 'checklists',
      type: 'PDF',
      size: '1.8 MB',
      downloads: 892,
      description: 'Step-by-step checklist for accurate payroll processing',
      icon: '✅'
    },
    {
      id: 3,
      title: 'Employee Handbook Template',
      category: 'templates',
      type: 'DOCX',
      size: '3.2 MB',
      downloads: 2156,
      description: 'Ready-to-use employee handbook template for Nigerian companies',
      icon: '📄'
    },
    {
      id: 4,
      title: 'PAYE Tax Calculation Guide',
      category: 'guides',
      type: 'PDF',
      size: '1.5 MB',
      downloads: 1834,
      description: 'Detailed guide on calculating PAYE tax for Akwa Ibom State',
      icon: '📊'
    },
    {
      id: 5,
      title: 'NSITF Contribution Calculator',
      category: 'tools',
      type: 'XLSX',
      size: '0.8 MB',
      downloads: 967,
      description: 'Excel calculator for NSITF contributions',
      icon: '🔢'
    },
    {
      id: 6,
      title: 'HR Compliance Calendar 2025',
      category: 'calendars',
      type: 'PDF',
      size: '1.2 MB',
      downloads: 1456,
      description: 'Annual compliance calendar with all filing deadlines',
      icon: '📅'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Resources', icon: '📚' },
    { id: 'guides', name: 'Guides', icon: '📘' },
    { id: 'checklists', name: 'Checklists', icon: '✅' },
    { id: 'templates', name: 'Templates', icon: '📄' },
    { id: 'tools', name: 'Tools', icon: '🔧' },
    { id: 'calendars', name: 'Calendars', icon: '📅' }
  ];

  const filteredResources = selectedCategory === 'all'
    ? resources
    : resources.filter(r => r.category === selectedCategory);

  return (
    <section className="section-shell py-20 px-4 md:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16" data-animate="fade-up">
          <span className="section-eyebrow">Resource Library</span>
          <h1 className="section-title">Download Free HR Guides, Templates & Tools</h1>
          <p className="section-lead max-w-3xl mx-auto">
            Access comprehensive resources to help you manage HR operations more effectively.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12" data-animate="fade-up">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-lg'
                  : 'bg-gray-800/60 text-gray-300 hover:bg-gray-800/80 border border-white/10'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span className="font-medium">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredResources.map((resource, index) => (
            <div 
              key={resource.id} 
              className="service-card"
              data-animate="fade-up"
              style={{ '--animate-delay': `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl">{resource.icon}</div>
                <span className="service-badge service-badge--core text-xs px-3 py-1">
                  {resource.type}
                </span>
              </div>
              <h3 className="service-title mb-3">{resource.title}</h3>
              <p className="service-description mb-4">{resource.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="text-gray-400 text-xs">
                  <div className="font-medium">{resource.size}</div>
                  <div>{resource.downloads.toLocaleString()} downloads</div>
                </div>
                <button className="btn btn-primary text-sm px-4 py-2">
                  <i className="fas fa-download mr-2"></i>
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Blog Section */}
        <div className="service-card mb-8" data-animate="fade-up">
          <h2 className="section-title text-2xl mb-6">Latest Blog Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: '5 Ways to Reduce HR Costs in 2025', date: 'Dec 20, 2024', readTime: '5 min' },
              { title: 'Understanding Nigerian Tax Compliance', date: 'Dec 15, 2024', readTime: '7 min' },
              { title: 'Best Practices for Employee Onboarding', date: 'Dec 10, 2024', readTime: '4 min' }
            ].map((post, index) => (
              <div 
                key={index} 
                className="p-5 bg-gray-800/40 rounded-lg hover:bg-gray-800/60 transition-all cursor-pointer border border-white/5"
                data-animate="fade-up"
                style={{ '--animate-delay': `${index * 0.1}s` }}
              >
                <div className="text-indigo-400 text-sm font-semibold mb-2">{post.date}</div>
                <h3 className="text-white font-semibold mb-2">{post.title}</h3>
                <div className="text-gray-400 text-xs">{post.readTime} read</div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Tutorials */}
        <div className="service-card" data-animate="fade-up">
          <h2 className="section-title text-2xl mb-6">Video Tutorials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Getting Started with Resconate', duration: '12:34', thumbnail: '🎥' },
              { title: 'Setting Up Payroll', duration: '18:45', thumbnail: '🎥' },
              { title: 'Managing Compliance', duration: '15:20', thumbnail: '🎥' },
              { title: 'Employee Onboarding', duration: '10:15', thumbnail: '🎥' }
            ].map((video, index) => (
              <div 
                key={index} 
                className="flex items-center gap-4 p-5 bg-gray-800/40 rounded-lg hover:bg-gray-800/60 transition-all cursor-pointer border border-white/5"
                data-animate="fade-up"
                style={{ '--animate-delay': `${index * 0.1}s` }}
              >
                <div className="text-4xl">{video.thumbnail}</div>
                <div className="flex-1">
                  <div className="text-white font-semibold mb-1">{video.title}</div>
                  <div className="text-gray-400 text-sm">{video.duration}</div>
                </div>
                <button className="text-indigo-400 hover:text-pink-400 text-xl transition-colors">
                  <i className="fas fa-play"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourceLibrary;

