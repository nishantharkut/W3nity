
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Code, Users, Calendar, Briefcase, ArrowRight, Zap } from 'lucide-react';

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-primary-50 via-white to-tech-blue/5 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Welcome to SparkVerse
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in leading-tight">
            Connect. Collaborate. Create.
            <span className="text-primary-600 block">In the Tech Ecosystem</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fade-in leading-relaxed">
            Join the premier platform where developers, designers, and tech professionals 
            find opportunities, attend events, and build meaningful connections in Web3 and beyond.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in mb-12">
            <Button asChild size="lg" className="bg-primary-600 hover:bg-primary-700 text-lg px-8 py-3 group">
              <Link to="/freelance" className="flex items-center">
                Find Work
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
              <Link to="/events">Browse Events</Link>
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <Briefcase className="h-10 md:h-12 w-10 md:w-12 text-primary-600 mb-3 md:mb-4" />
            <h3 className="text-lg font-semibold mb-2">Freelance Opportunities</h3>
            <p className="text-gray-600 text-sm">Find high-quality projects from verified clients</p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <Calendar className="h-10 md:h-12 w-10 md:w-12 text-tech-green mb-3 md:mb-4" />
            <h3 className="text-lg font-semibold mb-2">Tech Events</h3>
            <p className="text-gray-600 text-sm">Attend workshops, conferences, and networking events</p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <Users className="h-10 md:h-12 w-10 md:w-12 text-tech-purple mb-3 md:mb-4" />
            <h3 className="text-lg font-semibold mb-2">Community</h3>
            <p className="text-gray-600 text-sm">Connect with like-minded professionals</p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <Code className="h-10 md:h-12 w-10 md:w-12 text-tech-orange mb-3 md:mb-4" />
            <h3 className="text-lg font-semibold mb-2">Web3 Ready</h3>
            <p className="text-gray-600 text-sm">Built for the future of decentralized work</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 bg-white rounded-xl p-6 md:p-8 shadow-sm">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">10K+</div>
            <div className="text-gray-600">Active Developers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-tech-green mb-2">500+</div>
            <div className="text-gray-600">Live Projects</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-tech-purple mb-2">50+</div>
            <div className="text-gray-600">Monthly Events</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
