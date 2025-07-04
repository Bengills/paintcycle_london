import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, Droplet, Users, BarChart3, Award, ArrowRight } from 'lucide-react';

const AboutPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-500 to-teal-600 py-20 sm:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1070534/pexels-photo-1070534.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-10"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            1 in 3 UK households hoards leftover paint.<br />
            <span className="text-yellow-300">Let's put it to work.</span>
          </h1>
          <p className="text-xl text-white max-w-3xl mx-auto mb-10">
            PaintCycle London connects you with neighbours to share unused paint—for free. 
            Reduce waste, save money, and colour your world sustainably.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/list-paint" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-emerald-700 bg-white hover:bg-gray-100 md:text-lg">
              List Your Paint
            </Link>
            <Link to="/browse" className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-emerald-700 md:text-lg">
              Browse Local Paint
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-6">
                PaintCycle London was founded with a simple but powerful mission: to stop paint waste by connecting Londoners who have leftover paint with those who need it.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Did you know that 1 in 3 UK households hoards leftover paint? That's millions of litres of perfectly usable paint sitting in sheds and cupboards, eventually destined for landfill where it can harm our environment.
              </p>
              <p className="text-lg text-gray-700">
                We're building a community of eco-conscious Londoners who believe in the power of reuse, sharing resources, and reducing environmental harm—one paint can at a time.
              </p>
            </div>
            <div className="mt-10 lg:mt-0">
              <img 
                src="https://images.pexels.com/photos/5583114/pexels-photo-5583114.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Paint tins" 
                className="rounded-lg shadow-lg w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Impact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Impact</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-emerald-100 text-emerald-600 mb-4">
                <Recycle className="h-6 w-6" />
              </div>
              <div className="text-4xl font-bold text-emerald-700 mb-2">12,487</div>
              <p className="text-gray-600">Litres of paint saved from landfill</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-emerald-100 text-emerald-600 mb-4">
                <Users className="h-6 w-6" />
              </div>
              <div className="text-4xl font-bold text-emerald-700 mb-2">3,245</div>
              <p className="text-gray-600">Active community members</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-emerald-100 text-emerald-600 mb-4">
                <Droplet className="h-6 w-6" />
              </div>
              <div className="text-4xl font-bold text-emerald-700 mb-2">£187,305</div>
              <p className="text-gray-600">Estimated money saved by our community</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-emerald-200"></div>
            
            {/* Step 1 */}
            <div className="relative mb-16">
              <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                <div className="md:text-right">
                  <h3 className="text-xl font-bold text-emerald-700 mb-2">1. List Your Paint</h3>
                  <p className="text-gray-600 mb-4 md:mb-0">
                    Create a simple listing with details about your leftover paint: brand, colour, amount, and when it was opened. Add a photo if you like. Your postcode helps us show your paint to nearby users.
                  </p>
                </div>
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
                  <div className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">1</div>
                </div>
                <div className="mt-4 md:mt-0">
                  <img 
                    src="https://images.pexels.com/photos/6444255/pexels-photo-6444255.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Person photographing paint tin" 
                    className="rounded-lg shadow-md w-full h-[300px] object-cover"
                  />
                </div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="relative mb-16">
              <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                <div className="md:order-last">
                  <h3 className="text-xl font-bold text-emerald-700 mb-2">2. Browse and Search</h3>
                  <p className="text-gray-600 mb-4 md:mb-0">
                    Looking for paint? Use our search filters to find exactly what you need. Filter by brand, colour family, distance from your location, and how recently the paint was opened.
                  </p>
                </div>
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
                  <div className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">2</div>
                </div>
                <div className="mt-4 md:mt-0 md:text-right">
                  <img 
                    src="https://images.pexels.com/photos/5583115/pexels-photo-5583115.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Browsing paint" 
                    className="rounded-lg shadow-md w-full h-[300px] object-cover"
                  />
                </div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="relative">
              <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                <div>
                  <h3 className="text-xl font-bold text-emerald-700 mb-2">3. Connect and Collect</h3>
                  <p className="text-gray-600 mb-4 md:mb-0">
                    Found what you need? Message the lister directly through our platform to arrange collection. No personal contact details are shared until you both agree. Meet safely, collect your paint, and get creating!
                  </p>
                </div>
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
                  <div className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">3</div>
                </div>
                <div className="mt-4 md:mt-0">
                  <img 
                    src="https://images.pexels.com/photos/5370638/pexels-photo-5370638.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Paint collection" 
                    className="rounded-lg shadow-md w-full h-[300px] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-16 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/3727464/pexels-photo-3727464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Sarah Johnson" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Sarah Johnson</h3>
                <p className="text-emerald-600 mb-4">Founder & CEO</p>
                <p className="text-gray-600">
                  Former interior designer with a passion for sustainability and reducing waste in the design industry.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="David Chen" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">David Chen</h3>
                <p className="text-emerald-600 mb-4">CTO</p>
                <p className="text-gray-600">
                  Tech expert with experience building community platforms that connect people and resources.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/3727468/pexels-photo-3727468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Maya Patel" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Maya Patel</h3>
                <p className="text-emerald-600 mb-4">Community Manager</p>
                <p className="text-gray-600">
                  Environmental activist and community organizer dedicated to making London more sustainable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Partners Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Partners</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            <div className="flex justify-center">
              <div className="h-16 w-32 bg-gray-200 rounded flex items-center justify-center text-gray-500 font-medium">
                Partner Logo
              </div>
            </div>
            <div className="flex justify-center">
              <div className="h-16 w-32 bg-gray-200 rounded flex items-center justify-center text-gray-500 font-medium">
                Partner Logo
              </div>
            </div>
            <div className="flex justify-center">
              <div className="h-16 w-32 bg-gray-200 rounded flex items-center justify-center text-gray-500 font-medium">
                Partner Logo
              </div>
            </div>
            <div className="flex justify-center">
              <div className="h-16 w-32 bg-gray-200 rounded flex items-center justify-center text-gray-500 font-medium">
                Partner Logo
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to join London's paint-sharing community?</h2>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto mb-8">
            Whether you have leftover paint to share or you're looking for the perfect shade, 
            PaintCycle London makes it easy to connect with neighbors and reduce waste.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-emerald-700 bg-white hover:bg-gray-100 md:text-lg">
              Create an Account
            </Link>
            <Link to="/browse" className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-emerald-600 md:text-lg">
              Start Browsing
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          <p className="mt-6 text-emerald-200 text-sm">
            #ZeroWasteLondon #SustainableDecor
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;