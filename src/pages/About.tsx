
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale, Users, Clock, Shield, CheckCircle, Globe } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: <Scale className="h-8 w-8 text-orrr-blue-500" />,
      title: 'Fair Resolution',
      description: 'Unbiased dispute resolution with certified mediators and arbitrators.'
    },
    {
      icon: <Users className="h-8 w-8 text-orrr-teal-500" />,
      title: 'Expert Mediators',
      description: 'Access to qualified neutrals with expertise in various dispute types.'
    },
    {
      icon: <Clock className="h-8 w-8 text-orrr-blue-500" />,
      title: 'Fast Process',
      description: 'Resolve disputes quickly without lengthy court proceedings.'
    },
    {
      icon: <Shield className="h-8 w-8 text-orrr-teal-500" />,
      title: 'Secure Platform',
      description: 'Your data and communications are protected with enterprise-grade security.'
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      title: 'Proven Results',
      description: 'High success rate in achieving mutually satisfactory resolutions.'
    },
    {
      icon: <Globe className="h-8 w-8 text-orrr-blue-500" />,
      title: 'Online Access',
      description: 'Participate from anywhere with our comprehensive online platform.'
    }
  ];

  return (
    <MainLayout>
      <div className="container py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orrr-blue-600 to-orrr-teal-500 bg-clip-text text-transparent">
            About orrr
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Online Resolution and Reconciliation Resource (orrr) is a comprehensive platform for 
            dispute resolution, offering mediation, arbitration, and negotiation services online.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/register">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/cases/new">File a Case</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center h-full">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Services Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-orrr-blue-50 to-orrr-blue-100 border-orrr-blue-200">
              <CardHeader>
                <CardTitle className="text-orrr-blue-700">Mediation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Work with a neutral third party to facilitate communication and reach 
                  a mutually agreeable resolution.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orrr-teal-50 to-orrr-teal-100 border-orrr-teal-200">
              <CardHeader>
                <CardTitle className="text-orrr-teal-700">Arbitration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Present your case to an impartial arbitrator who will make a 
                  binding decision based on the evidence and arguments.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-700">Negotiation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Engage in structured negotiations with optional neutral guidance 
                  to reach a settlement.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Process Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orrr-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">File Your Case</h3>
              <p className="text-gray-600">Submit your dispute details and select your preferred resolution method.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orrr-teal-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Get Matched</h3>
              <p className="text-gray-600">We assign a qualified neutral based on your case type and requirements.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Resolve</h3>
              <p className="text-gray-600">Participate in sessions and work toward a fair resolution.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Close Case</h3>
              <p className="text-gray-600">Finalize your agreement and close your case successfully.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-orrr-blue-500 to-orrr-teal-500 text-white rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Resolve Your Dispute?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands who have successfully resolved their disputes through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/register">Start Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orrr-blue-600">
              <Link to="#contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
