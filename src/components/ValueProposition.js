import React from 'react';

const ValueProposition = () => {
  const values = [
    {
      icon: 'fas fa-sparkles',
      iconClass: 'value-icon--indigo',
      title: 'Design-led product studio',
      description: 'Strategy, UX, engineering, and launch rituals bundled into one decisive sprint cadence.',
      items: ['Leadership-aligned sprints.', 'Shippable experiences from day one.']
    },
    {
      icon: 'fas fa-people-group',
      iconClass: 'value-icon--pink',
      title: 'HR-as-a-Service backbone',
      description: 'Localized payroll, compliance, and employee journeys automated for African markets.',
      items: ['Role-based portals that feel native.', 'Audit trails ready for regulators.']
    },
    {
      icon: 'fas fa-link',
      iconClass: 'value-icon--emerald',
      title: 'Continuous partnership',
      description: 'We stay embedded, evolving product releases and people operations as one narrative.',
      items: ['Lifecycle analytics at a glance.', 'Dedicated success pod in your timezone.']
    }
  ];

  return (
    <section id="agency-services" className="section-shell py-20 px-4 md:px-8">
      <div className="container mx-auto max-w-5xl text-center section-heading" data-animate="fade-up">
        <span className="section-eyebrow">Value Proposition</span>
        <h2 className="section-title">One partner keeping product velocity and people certainty in lockstep.</h2>
        <p className="section-lead">
          We dissolve handoff gaps so your next launch and your workforce operations stay in the same momentum.
        </p>
      </div>
      <div className="container mx-auto max-w-6xl value-grid">
        {values.map((value, index) => (
          <article key={index} className="value-card" data-animate="fade-up" style={{ '--animate-delay': `${index * 0.1}s` }}>
            <div className={`value-icon ${value.iconClass}`}>
              <i className={value.icon}></i>
            </div>
            <h3>{value.title}</h3>
            <p>{value.description}</p>
            <ul>
              {value.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ValueProposition;


