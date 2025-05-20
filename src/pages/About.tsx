
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Shield, Balance, Users, FileText, Award, Globe } from 'lucide-react';

export default function About() {
  const { user } = useAuth();
  
  return (
    <MainLayout withFooter={true}>
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">About Our Platform</h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We provide accessible, fair, and efficient dispute resolution services through our innovative online platform.
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <Shield className="h-5 w-5 flex-none text-indigo-600" />
                  Our Mission
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    To make dispute resolution more accessible and efficient through technology, reducing the time, cost, and stress traditionally associated with conflict resolution.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <Users className="h-5 w-5 flex-none text-indigo-600" />
                  Our Team
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Our platform is powered by a diverse team of legal experts, mediators, technologists, and customer support professionals dedicated to providing exceptional service.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <Globe className="h-5 w-5 flex-none text-indigo-600" />
                  Our Reach
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    We serve clients globally, handling a wide range of disputes from simple consumer complaints to complex commercial and contractual matters.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* How it works section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">How It Works</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Simple steps to resolve your dispute
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our platform makes dispute resolution straightforward and accessible for everyone involved.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-16">
              <div className="relative">
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white">
                  <span className="text-xl font-bold">1</span>
                </div>
                <div className="pl-16">
                  <h3 className="text-base font-semibold leading-7 text-gray-900">File Your Case</h3>
                  <p className="mt-2 text-base leading-7 text-gray-600">
                    Submit your case details, upload relevant documents, and choose your preferred resolution method: mediation, arbitration, or negotiation.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white">
                  <span className="text-xl font-bold">2</span>
                </div>
                <div className="pl-16">
                  <h3 className="text-base font-semibold leading-7 text-gray-900">Connect With a Neutral</h3>
                  <p className="mt-2 text-base leading-7 text-gray-600">
                    Our system assigns a qualified mediator, arbitrator, or facilitator to your case, based on expertise and availability.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white">
                  <span className="text-xl font-bold">3</span>
                </div>
                <div className="pl-16">
                  <h3 className="text-base font-semibold leading-7 text-gray-900">Resolve Online</h3>
                  <p className="mt-2 text-base leading-7 text-gray-600">
                    Participate in virtual hearings, secure message exchanges, and document sharing until your dispute is resolved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Benefits</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why choose online dispute resolution?
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-indigo-600 text-white">
                    <FileText className="h-6 w-6" />
                  </div>
                  Cost-Effective
                </dt>
                <dd className="mt-1 text-base leading-7 text-gray-600">
                  Save significantly compared to traditional litigation, with transparent pricing and no hidden fees.
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-indigo-600 text-white">
                    <Users className="h-6 w-6" />
                  </div>
                  Expert Neutrals
                </dt>
                <dd className="mt-1 text-base leading-7 text-gray-600">
                  Access qualified mediators and arbitrators with specialized expertise in your specific type of dispute.
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-indigo-600 text-white">
                    <Award className="h-6 w-6" />
                  </div>
                  Efficient Resolution
                </dt>
                <dd className="mt-1 text-base leading-7 text-gray-600">
                  Resolve disputes in weeks rather than months or years, with flexible scheduling and no travel required.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      
      {/* CTA section */}
      <div className="bg-indigo-700">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to resolve your dispute?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-100">
              Start the resolution process today and take the first step toward resolving your conflict efficiently and fairly.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {user ? (
                <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50">
                  <Link to="/cases/new">
                    File a Case
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50">
                    <Link to="/register">
                      Get Started
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-indigo-800">
                    <Link to="/login">
                      Log in
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
