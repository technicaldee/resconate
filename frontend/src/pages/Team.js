import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

const Team = () => {
  useEffect(() => {
    // Initialize animations for elements with data-animate attribute
    const animatedElements = document.querySelectorAll('[data-animate]');
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => {
      observer.observe(el);
    });

    return () => {
      animatedElements.forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);

  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: 'Inimfon Udoh',
      role: 'Founder & CEO',
      image: '/me.jpeg',
      bio: 'Visionary leader driving Resconate\'s mission to transform African businesses through innovative HR solutions and digital products.',
      social: {
        linkedin: 'https://www.linkedin.com/in/inimfon-udoh-b5b569222/',
        twitter: '',
        email: 'inimfon@resconate.com'
      }
    },
    {
      id: 2,
      name: 'Mike',
      role: 'Technical Lead',
      image: '/mike.jpg',
      bio: 'Expert in building scalable systems and leading technical initiatives that power Resconate\'s platform.',
      social: {
        linkedin: '',
        twitter: '',
        email: 'mike@resconate.com'
      }
    },
    {
      id: 3,
      name: 'Itoro',
      role: 'Product Designer',
      image: '/itoro.jpg',
      bio: 'Creative designer crafting intuitive user experiences and beautiful interfaces for our products.',
      social: {
        linkedin: '',
        twitter: '',
        email: 'itoro@resconate.com'
      }
    },
    {
      id: 4,
      name: 'Emediong',
      role: 'Operations Manager',
      image: '/emediong.jpg',
      bio: 'Ensuring smooth operations and efficient workflows across all Resconate initiatives.',
      social: {
        linkedin: '',
        twitter: '',
        email: 'emediong@resconate.com'
      }
    },
    {
      id: 5,
      name: 'Dorcas',
      role: 'HR Specialist',
      image: '/dorcas.jpg',
      bio: 'Dedicated to building strong teams and creating exceptional workplace experiences for our clients.',
      social: {
        linkedin: '',
        twitter: '',
        email: 'dorcas@resconate.com'
      }
    },
    {
      id: 6,
      name: 'Sherah',
      role: 'Business Development',
      image: '/sherah.jpg',
      bio: 'Driving growth and building strategic partnerships to expand Resconate\'s impact across Africa.',
      social: {
        linkedin: '',
        twitter: '',
        email: 'sherah@resconate.com'
      }
    },
    {
      id: 7,
      name: 'Innie',
      role: 'Developer',
      image: '/innie.jpg',
      bio: 'Full-stack developer building robust solutions that power Resconate\'s digital infrastructure.',
      social: {
        linkedin: '',
        twitter: '',
        email: 'innie@resconate.com'
      }
    }
  ];

  // Partnerships data
  const partnerships = [
    {
      id: 1,
      name: 'HealthFound',
      logo: '/healthfound-logo.jpeg',
      description: 'HealthFound is a media and intelligence platform dedicated to spotlighting startups, founders, companies, policy changes and emerging technologies in Africa\'s healthcare ecosystem. We provide credible insights, structured data, and sector-focused stories that help investors, students, innovators, institutions, and researchers understand the trends shaping the continent\'s health ecosystem. Through research, reporting, community initiatives, and student-focused impact programs, HealthFound is building a central hub for information, inspiration, and innovation across African healthcare.',
      link: 'https://linktr.ee/Healthfound24.7',
      website: 'https://linktr.ee/Healthfound24.7'
    }
  ];

  return (
    <div className="App">
      <Header />
      <main id="main-content">
        {/* Team Section */}
        <section id="team" className="section-shell py-20 px-4 md:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16" data-animate="fade-up">
              <span className="section-eyebrow">Our Team</span>
              <h2 className="section-title">Meet the Resconate Team</h2>
              <p className="section-lead max-w-3xl mx-auto">
                A diverse group of talented individuals working together to transform how African businesses operate.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div 
                  key={member.id} 
                  className="team-card"
                  data-animate="fade-up"
                  style={{ '--animate-delay': `${index * 0.1}s` }}
                >
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="team-card__avatar"
                  />
                  <h3 className="team-card__name">{member.name}</h3>
                  <p className="team-card__role">{member.role}</p>
                  <p className="team-card__bio">{member.bio}</p>
                  <div className="team-card__social">
                    {member.social.linkedin && (
                      <a 
                        href={member.social.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="team-card__social-link"
                        aria-label={`${member.name} LinkedIn`}
                      >
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                    )}
                    {member.social.twitter && (
                      <a 
                        href={member.social.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="team-card__social-link"
                        aria-label={`${member.name} Twitter`}
                      >
                        <i className="fab fa-twitter"></i>
                      </a>
                    )}
                    {member.social.email && (
                      <a 
                        href={`mailto:${member.social.email}`}
                        className="team-card__social-link"
                        aria-label={`Email ${member.name}`}
                      >
                        <i className="fas fa-envelope"></i>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partnerships Section */}
        <section id="partnerships" className="section-shell py-20 px-4 md:px-8" style={{ background: 'rgba(17, 24, 39, 0.5)' }}>
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16" data-animate="fade-up">
              <span className="section-eyebrow">Partnerships</span>
              <h2 className="section-title">Strategic Partners</h2>
              <p className="section-lead max-w-3xl mx-auto">
                We collaborate with innovative organizations to create greater impact across Africa.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {partnerships.map((partner, index) => (
                <div 
                  key={partner.id} 
                  className="partnership-card"
                  data-animate="fade-up"
                  style={{ '--animate-delay': `${index * 0.1}s` }}
                >
                  <div className="partnership-logo">
                    <img 
                      src={partner.logo} 
                      alt={partner.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.nextElementSibling;
                        if (fallback) fallback.style.display = 'block';
                      }}
                    />
                    <div style={{ display: 'none', fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                      {partner.name}
                    </div>
                  </div>
                  <h3 className="team-card__name">{partner.name}</h3>
                  <p className="team-card__bio" style={{ textAlign: 'left', marginBottom: 'var(--space-6)' }}>{partner.description}</p>
                  {partner.link && (
                    <a 
                      href={partner.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      Learn More
                      <i className="fas fa-external-link-alt"></i>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Team;

