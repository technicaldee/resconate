import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { apiFetch } from '../../utils/api';

const GlobalSearch = ({ onResultClick }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const searchRef = useRef(null);
  const router = useRouter();

  const categories = [
    { id: 'all', name: 'All', icon: 'fas fa-search' },
    { id: 'employees', name: 'Employees', icon: 'fas fa-users' },
    { id: 'jobs', name: 'Jobs', icon: 'fas fa-briefcase' },
    { id: 'candidates', name: 'Candidates', icon: 'fas fa-user-tie' },
    { id: 'documents', name: 'Documents', icon: 'fas fa-file' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      performSearch();
    } else {
      setResults([]);
    }
  }, [query, activeCategory]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const response = await apiFetch(
        `/api/search?q=${encodeURIComponent(query)}&category=${activeCategory}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
        setIsOpen(true);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-primary-500/30 text-primary-300">{part}</mark>
      ) : (
        part
      )
    );
  };

  const handleResultClick = (result) => {
    setIsOpen(false);
    setQuery('');
    
    if (onResultClick) {
      onResultClick(result);
    } else {
      // Default navigation
      if (result.type === 'employee') {
        router.push(`/hr-dashboard?tab=employees&id=${result.id}`);
      } else if (result.type === 'job') {
        router.push(`/hr-dashboard?tab=jobs&id=${result.id}`);
      } else if (result.type === 'candidate') {
        router.push(`/hr-dashboard?tab=candidates&id=${result.id}`);
      }
    }
  };

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {});

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Search employees, jobs, candidates..."
          className="w-full px-4 py-3 pl-12 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        />
        <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        {loading && (
          <i className="fas fa-spinner fa-spin absolute right-4 top-1/2 transform -translate-y-1/2 text-primary-500"></i>
        )}
      </div>

      {/* Category Filters */}
      {query.length >= 2 && (
        <div className="flex gap-2 mt-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <i className={`${cat.icon} mr-2`}></i>
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {Object.entries(groupedResults).map(([type, items]) => (
            <div key={type} className="border-b border-gray-700 last:border-b-0">
              <div className="px-4 py-2 bg-gray-900/50 text-xs font-semibold text-gray-400 uppercase">
                {categories.find(c => c.id === type)?.name || type}
              </div>
              {items.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-white font-medium mb-1">
                        {highlightText(result.title, query)}
                      </div>
                      {result.subtitle && (
                        <div className="text-gray-400 text-sm">
                          {highlightText(result.subtitle, query)}
                        </div>
                      )}
                      {result.meta && (
                        <div className="text-gray-500 text-xs mt-1">{result.meta}</div>
                      )}
                    </div>
                    <i className="fas fa-chevron-right text-gray-500 ml-4"></i>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {isOpen && query.length >= 2 && !loading && results.length === 0 && (
        <div className="absolute top-full mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 p-8 text-center">
          <i className="fas fa-search text-4xl text-gray-600 mb-3"></i>
          <p className="text-gray-400">No results found for "{query}"</p>
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;

