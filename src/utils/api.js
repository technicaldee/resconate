// API utility functions
export const apiUrl = (endpoint) => {
  const baseUrl = process.env.REACT_APP_API_URL || '';
  return `${baseUrl}${endpoint}`;
};

export const fetchProjects = async () => {
  try {
    const response = await fetch(apiUrl('/api/projects'));
    if (!response.ok) throw new Error('Failed to fetch projects');
    return await response.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

export const fetchTestimonials = async () => {
  try {
    const response = await fetch(apiUrl('/api/testimonials'));
    if (!response.ok) throw new Error('Failed to fetch testimonials');
    return await response.json();
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
};


