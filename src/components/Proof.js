import React, { useEffect, useState } from 'react';
import { fetchTestimonials } from '../utils/api';

const Proof = () => {
  const [testimonials, setTestimonials] = useState([
    {
      text: "Resconate moved us from idea to launch without breaking pace. The product landed polished and operations never skipped a beat.",
      name: "Adaeze N.",
      role: "COO, Fintech Startup",
      image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=80"
    },
    {
      text: "Payroll, compliance, and reviews now feel automated. Their squad plugs in like our own people team, on call and proactive.",
      name: "Derrick A.",
      role: "People Lead, Growth Company",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80"
    }
  ]);

  useEffect(() => {
    const loadTestimonials = async () => {
      const data = await fetchTestimonials();
      if (data && data.length > 0) {
        setTestimonials(data);
      }
    };
    loadTestimonials();
  }, []);

  const logos = ['FedAPI', 'Solarmac', 'NX Labs', 'KHOJ', 'DSA'];

  return (
    <section id="proof" className="section-shell section-shell--slate py-20 px-4 md:px-8">
      <div className="container mx-auto max-w-5xl text-center section-heading" data-animate="fade-up">
        <span className="section-eyebrow">Proof</span>
        <h2 className="section-title">Chosen by teams crafting category-defining experiences.</h2>
      </div>
      <div className="container mx-auto max-w-5xl logos-line" data-animate="fade-up">
        {logos.map((logo, index) => (
          <span key={index}>{logo}</span>
        ))}
      </div>
      <div className="container mx-auto max-w-5xl testimonial-grid">
        {testimonials.map((testimonial, index) => (
          <article key={index} className="testimonial-card" data-animate="fade-up" style={{ '--animate-delay': `${index * 0.1}s` }}>
            <p>{testimonial.text}</p>
            <div className="testimonial-meta">
              <img src={testimonial.image} alt="Client portrait" />
              <div>
                <span className="testimonial-name">{testimonial.name}</span>
                <span className="testimonial-role">{testimonial.role}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Proof;


