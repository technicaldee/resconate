import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

const AboutPage = () => {
  return (
    <div className="App">
      <Header />
      <main id="main-content" style={{ background: 'var(--dark-bg)', minHeight: '100vh' }}>
        <div className="about-page py-16 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold text-white mb-6">About Resconate</h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Empowering Nigerian businesses with modern HR technology designed for local compliance and needs
              </p>
            </div>

            {/* Mission */}
            <div className="card-ng mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                At Resconate, we believe that every Nigerian business, regardless of size, deserves access to 
                professional HR management tools. We're on a mission to simplify HR operations, ensure compliance 
                with Nigerian labor laws, and help businesses focus on what they do best - growing their business.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                We understand the unique challenges Nigerian businesses face - from complex tax calculations to 
                compliance with multiple regulatory bodies. That's why we built Resconate specifically for the 
                Nigerian market, with local compliance built-in from day one.
              </p>
            </div>

            {/* Founder Story */}
            <div className="card-ng mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">Founder's Story</h2>
              <div className="flex items-start space-x-6 mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
                  IU
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Inimfon Udoh</h3>
                  <p className="text-green-400 mb-4">Founder & CEO</p>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    After years of working with Nigerian businesses, I noticed a common problem: HR management 
                    was either too expensive, too complicated, or didn't understand local compliance requirements. 
                    Small and medium businesses were stuck with manual processes, spreadsheets, and the constant 
                    fear of compliance penalties.
                  </p>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    I founded Resconate to solve this problem. We've built a platform that combines the power of 
                    modern technology with deep understanding of Nigerian business needs. Every feature is designed 
                    with local compliance in mind - from PAYE calculations for Akwa Ibom State to NSITF contributions 
                    and PenCom remittances.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    Today, Resconate helps hundreds of Nigerian businesses manage their HR operations efficiently, 
                    stay compliant, and focus on growth. But we're just getting started. Our vision is to become 
                    the HR platform of choice for every Nigerian business.
                  </p>
                </div>
              </div>
            </div>

            {/* Values */}
            <div className="card-ng mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">Our Values</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 bg-gray-800/50 rounded-lg">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Local First</h3>
                  <p className="text-gray-400">
                    Built specifically for Nigerian businesses with local compliance and regulations in mind
                  </p>
                </div>
                <div className="p-6 bg-gray-800/50 rounded-lg">
                  <div className="text-4xl mb-4">💡</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Simplicity</h3>
                  <p className="text-gray-400">
                    Complex HR tasks made simple. No technical expertise required to manage your workforce
                  </p>
                </div>
                <div className="p-6 bg-gray-800/50 rounded-lg">
                  <div className="text-4xl mb-4">🛡️</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Compliance</h3>
                  <p className="text-gray-400">
                    Stay compliant with Nigerian labor laws automatically. Never miss a filing deadline
                  </p>
                </div>
                <div className="p-6 bg-gray-800/50 rounded-lg">
                  <div className="text-4xl mb-4">🤝</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Support</h3>
                  <p className="text-gray-400">
                    Dedicated support team that understands Nigerian business context and challenges
                  </p>
                </div>
                <div className="p-6 bg-gray-800/50 rounded-lg">
                  <div className="text-4xl mb-4">📈</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Growth</h3>
                  <p className="text-gray-400">
                    Scale with your business. From startup to enterprise, we grow with you
                  </p>
                </div>
                <div className="p-6 bg-gray-800/50 rounded-lg">
                  <div className="text-4xl mb-4">🔒</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Security</h3>
                  <p className="text-gray-400">
                    Your data is secure with enterprise-grade security and regular backups
                  </p>
                </div>
              </div>
            </div>

            {/* Why Resconate */}
            <div className="card-ng mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">Why Resconate?</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="text-green-400 text-2xl mt-1">✓</div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Built for Nigeria</h3>
                    <p className="text-gray-400">
                      Unlike generic HR software, Resconate is built specifically for Nigerian businesses. 
                      We understand PAYE, NSITF, ITF, PenCom, and all other local compliance requirements.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-green-400 text-2xl mt-1">✓</div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Affordable Pricing</h3>
                    <p className="text-gray-400">
                      Starting at just ₦50,000/month, Resconate is affordable for businesses of all sizes. 
                      No hidden fees, no setup costs, cancel anytime.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-green-400 text-2xl mt-1">✓</div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Easy to Use</h3>
                    <p className="text-gray-400">
                      No technical training required. Our intuitive interface makes HR management accessible 
                      to everyone, regardless of technical expertise.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-green-400 text-2xl mt-1">✓</div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Local Support</h3>
                    <p className="text-gray-400">
                      Our support team is based in Nigeria and understands local business challenges. 
                      Get help when you need it, in a way that makes sense for Nigerian businesses.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="card-ng bg-gradient-to-r from-green-500/20 to-blue-500/20 border-2 border-green-500/50 text-center">
              <h3 className="text-3xl font-bold text-white mb-4">Join the Resconate Community</h3>
              <p className="text-gray-300 mb-6 text-lg">
                Start your free 14-day trial today. No credit card required.
              </p>
              <div className="flex justify-center space-x-4">
                <a href="/hr-login" className="btn-ng-primary px-8 py-4 text-lg font-semibold">
                  Start Free Trial
                </a>
                <a href="/contact" className="btn-ng-secondary px-8 py-4 text-lg font-semibold">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default AboutPage;

