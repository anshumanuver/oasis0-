import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { FileText, Users, Scale, MessageCircle } from 'lucide-react';

export default function Index() {
  const { user, profile } = useAuth();
  
  const isClient = profile?.role === 'client';
  const isNeutral = profile?.role === 'neutral';
  
  return (
    <MainLayout withFooter={true} showNotifications={false}>
      <div className="relative isolate">
        {/* Hero section */}
        <div className="relative px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Online Dispute Resolution Platform
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Resolve disputes efficiently and fairly through our secure online platform.
                We offer mediation, negotiation, and arbitration services for all types of conflicts.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                {user ? (
                  <>
                    <Button asChild size="lg">
                      <Link to="/dashboard-redirect">Go to Dashboard</Link>
                    </Button>
                    {isClient && (
                      <Button asChild variant="outline" size="lg">
                        <Link to="/cases/new">File a Case</Link>
                      </Button>
                    )}
                    {isNeutral && (
                      <Button asChild variant="outline" size="lg">
                        <Link to="/hearings">Manage Hearings</Link>
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button asChild size="lg">
                      <Link to="/register">Get Started</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link to="/login">
                        Log in <span aria-hidden="true">→</span>
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service highlights */}
      <div className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Dispute Resolution Services
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We offer multiple pathways to resolution, tailored to your specific needs
            </p>
          </div>
          
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col rounded-lg bg-white shadow-lg">
              <div className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-indigo-600 text-white mb-6">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Mediation</h3>
                <p className="mt-4 text-base text-gray-500">
                  Work with a neutral third party who facilitates communication and helps both sides reach a mutually agreeable resolution.
                </p>
              </div>
              <div className="flex flex-1 flex-col justify-end p-6 pt-0">
                <Button asChild variant="outline" className="w-full">
                  <Link to={user ? "/cases/new" : "/register"}>
                    {user ? "Request Mediation" : "Learn More"}
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col rounded-lg bg-white shadow-lg">
              <div className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-indigo-600 text-white mb-6">
                  <Scale className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Arbitration</h3>
                <p className="mt-4 text-base text-gray-500">
                  Present your case to an impartial arbitrator who makes a binding or non-binding decision after hearing both sides.
                </p>
              </div>
              <div className="flex flex-1 flex-col justify-end p-6 pt-0">
                <Button asChild variant="outline" className="w-full">
                  <Link to={user ? "/cases/new" : "/register"}>
                    {user ? "Request Arbitration" : "Learn More"}
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col rounded-lg bg-white shadow-lg">
              <div className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-indigo-600 text-white mb-6">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Negotiation</h3>
                <p className="mt-4 text-base text-gray-500">
                  Engage in structured negotiations on our platform with optional neutral guidance to reach settlement efficiently.
                </p>
              </div>
              <div className="flex flex-1 flex-col justify-end p-6 pt-0">
                <Button asChild variant="outline" className="w-full">
                  <Link to={user ? "/cases/new" : "/register"}>
                    {user ? "Start Negotiation" : "Learn More"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Resolve Faster</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to resolve disputes online
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our platform provides all the tools needed for successful online dispute resolution,
              from secure communications to document sharing and virtual hearings.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                  </div>
                  Secure Online Platform
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Our platform provides a secure environment for all parties to communicate 
                  and exchange information confidentially.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  Expert Mediators
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Access our network of qualified and experienced mediators specialized
                  in various dispute types.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3-.52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
                    </svg>
                  </div>
                  Fair & Impartial Process
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Our structured process ensures fairness and impartiality throughout the
                  dispute resolution journey.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  </div>
                  Convenient Scheduling
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Schedule and attend virtual hearings at times convenient for all parties,
                  with no need for travel or physical presence.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* CTA section for logged-in clients */}
      {user && isClient && (
        <div className="bg-indigo-700">
          <div className="mx-auto max-w-2xl py-16 px-6 text-center sm:py-20 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to resolve your dispute?
            </h2>
            <p className="mt-4 text-lg leading-6 text-indigo-100">
              Our platform makes it easy to file a new case and start the resolution process.
            </p>
            <Button asChild className="mt-8 bg-white text-indigo-700 hover:bg-indigo-50" size="lg">
              <Link to="/cases/new">
                File a New Case
              </Link>
            </Button>
          </div>
        </div>
      )}
      
      {/* CTA section for logged-in neutrals */}
      {user && isNeutral && (
        <div className="bg-orrr-blue-700">
          <div className="mx-auto max-w-2xl py-16 px-6 text-center sm:py-20 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Manage your mediation cases
            </h2>
            <p className="mt-4 text-lg leading-6 text-blue-100">
              Access your active cases and upcoming hearings from your mediator dashboard.
            </p>
            <Button asChild className="mt-8 bg-white text-orrr-blue-700 hover:bg-blue-50" size="lg">
              <Link to="/mediator-dashboard">
                Go to Mediator Dashboard
              </Link>
            </Button>
          </div>
        </div>
      )}
      
      {/* CTA for non-logged in users */}
      {!user && (
        <div className="bg-gray-100">
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Ready to get started?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
                Create an account to begin resolving your disputes online or learn more about our services.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button asChild>
                  <Link to="/register">
                    Create account
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/about">
                    Learn more
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
