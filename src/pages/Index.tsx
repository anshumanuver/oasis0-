import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';

export default function Index() {
  const { user } = useAuth();

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-orrr-blue-50 to-white">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                <span className="text-orrr-blue-600">Resolve disputes</span> efficiently with our online platform
              </h1>
              <p className="text-lg mb-8 text-gray-600">
                orrr is an Online Dispute Resolution platform that provides negotiation, mediation, arbitration, and conciliation services to help you resolve disputes faster and more cost-effectively.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {user ? (
                  <>
                    <Button size="lg" className="text-base px-8" asChild>
                      <Link to="/cases/new">File a New Case</Link>
                    </Button>
                    <Button size="lg" variant="outline" className="text-base px-8" asChild>
                      <Link to="/dashboard">Go to Dashboard</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="lg" className="text-base px-8" asChild>
                      <Link to="/register">Get Started</Link>
                    </Button>
                    <Button size="lg" variant="outline" className="text-base px-8" asChild>
                      <Link to="/about">Learn More</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="md:w-1/2 mt-12 md:mt-0">
              <img 
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2274&q=80" 
                alt="Online Dispute Resolution" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Dispute Resolution Services</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose from a range of dispute resolution methods tailored to your specific needs
            </p>
          </div>
          
          {/* File a Case CTA for authenticated users */}
          {user && (
            <div className="mb-12 bg-orrr-blue-50 p-6 rounded-lg shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Ready to resolve your dispute?</h3>
                  <p className="text-gray-600 mb-4 md:mb-0">
                    Start the process by filing a new case in our system.
                  </p>
                </div>
                <Button size="lg" className="text-base px-8" asChild>
                  <Link to="/cases/new">File a New Case</Link>
                </Button>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Negotiation */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="rounded-full bg-orrr-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orrr-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Negotiation</h3>
              <p className="text-gray-600 mb-4">
                Resolve disputes directly with the other party using our secure negotiation platform.
              </p>
              <Link to="/services/negotiation" className="text-orrr-blue-600 font-medium hover:underline inline-flex items-center">
                Learn more
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            {/* Mediation */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="rounded-full bg-orrr-teal-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orrr-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20h-2m7-10V5a2 2 0 11-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Mediation</h3>
              <p className="text-gray-600 mb-4">
                Work with a neutral third-party mediator to facilitate communication and reach a resolution.
              </p>
              <Link to="/services/mediation" className="text-orrr-teal-600 font-medium hover:underline inline-flex items-center">
                Learn more
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            {/* Arbitration */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="rounded-full bg-orrr-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orrr-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Arbitration</h3>
              <p className="text-gray-600 mb-4">
                Have your dispute decided by a neutral arbitrator in a binding or non-binding process.
              </p>
              <Link to="/services/arbitration" className="text-orrr-blue-600 font-medium hover:underline inline-flex items-center">
                Learn more
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            {/* Conciliation */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="rounded-full bg-orrr-teal-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orrr-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Conciliation</h3>
              <p className="text-gray-600 mb-4">
                Work towards an amicable settlement with a conciliator who offers potential solutions.
              </p>
              <Link to="/services/conciliation" className="text-orrr-teal-600 font-medium hover:underline inline-flex items-center">
                Learn more
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How orrr Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our simple process helps you resolve disputes quickly and efficiently
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="bg-white rounded-lg p-6 shadow-md relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-orrr-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold">
                1
              </div>
              <div className="text-center pt-6">
                <h3 className="text-xl font-semibold mb-4">File Your Case</h3>
                <p className="text-gray-600">
                  Create an account and provide details about your dispute. Upload relevant documents to support your case.
                </p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white rounded-lg p-6 shadow-md relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-orrr-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold">
                2
              </div>
              <div className="text-center pt-6">
                <h3 className="text-xl font-semibold mb-4">Choose Resolution Method</h3>
                <p className="text-gray-600">
                  Select the dispute resolution method that best suits your needs, from negotiation to arbitration.
                </p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="bg-white rounded-lg p-6 shadow-md relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-orrr-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold">
                3
              </div>
              <div className="text-center pt-6">
                <h3 className="text-xl font-semibold mb-4">Resolve Your Dispute</h3>
                <p className="text-gray-600">
                  Engage in the resolution process through our secure platform with video conferencing and document sharing.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            {user ? (
              <Button size="lg" className="text-base px-8" asChild>
                <Link to="/cases/new">File a Case Now</Link>
              </Button>
            ) : (
              <Button size="lg" className="text-base px-8" asChild>
                <Link to="/register">Get Started Now</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hear from individuals and businesses who have successfully resolved disputes using orrr
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <img
                    src="https://randomuser.me/api/portraits/women/45.jpg"
                    alt="Testimonial"
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-gray-500">Small Business Owner</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "orrr helped me resolve a contract dispute with a vendor in just two weeks. The mediation process was smooth and the platform was easy to use."
              </p>
              <div className="flex mt-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="Testimonial"
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Michael Chen</h4>
                  <p className="text-sm text-gray-500">Legal Counsel</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "As an attorney, I've recommended orrr to several clients for resolving commercial disputes. The arbitration process is thorough and cost-effective."
              </p>
              <div className="flex mt-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <img
                    src="https://randomuser.me/api/portraits/women/68.jpg"
                    alt="Testimonial"
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Priya Patel</h4>
                  <p className="text-sm text-gray-500">HR Director</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "We used orrr's conciliation service for an employment dispute. The platform's secure document sharing and video conferencing features were invaluable."
              </p>
              <div className="flex mt-4">
                {[1, 2, 3, 4, 5].map((star, idx) => (
                  <svg key={star} className={`w-5 h-5 ${idx < 4 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orrr-blue-600 to-orrr-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Resolve Your Dispute?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of individuals and businesses who have successfully resolved disputes on our platform
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg" variant="secondary" className="text-base px-8" asChild>
              <Link to="/register">Create Account</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 bg-transparent border-white text-white hover:bg-white/10" asChild>
              <Link to="/contact">Talk to an Expert</Link>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
