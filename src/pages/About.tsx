
import MainLayout from '@/components/layout/MainLayout';

export default function About() {
  return (
    <MainLayout>
      <div className="container py-16">
        <h1 className="text-3xl font-bold mb-8">About Our Platform</h1>
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            Our Online Dispute Resolution (ODR) Platform is a secure, digital space designed to help parties 
            resolve disputes efficiently and effectively without the need for traditional court proceedings.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p>
            We aim to make justice more accessible by providing a user-friendly platform where disputes can be 
            resolved through mediation, negotiation, and arbitration. Our platform connects clients with qualified 
            neutrals who help facilitate resolution.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-medium mb-3">1. File Your Case</h3>
              <p>Submit your dispute details through our secure platform, describing the issue and desired outcome.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-medium mb-3">2. Connect with a Neutral</h3>
              <p>Get matched with a qualified mediator or arbitrator with expertise in your type of dispute.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-medium mb-3">3. Resolve Online</h3>
              <p>Participate in virtual hearings, negotiations, and document exchanges until resolution is reached.</p>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Team</h2>
          <p>
            Our platform is supported by a team of legal technology experts, experienced mediators, and 
            customer support specialists dedicated to helping you resolve disputes efficiently and fairly.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
