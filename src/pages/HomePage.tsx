import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Calendar, MessageSquare, Award } from 'lucide-react';
import Button from '../components/ui/Button';

const HomePage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                Connect with Expert Tutors for Academic Success
              </h1>
              <p className="mt-4 text-xl text-blue-100">
                Get personalized help with assignments, exam prep, and more from qualified tutors in any subject.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/auth?mode=signup">
                  <Button variant="primary" size="lg" className="bg-white text-blue-700 hover:bg-gray-100">
                    Get Started
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-blue-700">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Students studying together" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">How ScholarStream Works</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Get the academic help you need in three simple steps
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Submit Your Assignment</h3>
              <p className="mt-2 text-gray-600">
                Describe your assignment, upload relevant files, and set your deadline.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Match with a Tutor</h3>
              <p className="mt-2 text-gray-600">
                Our system matches you with qualified tutors in your subject area.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600">
                <MessageSquare className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Collaborate and Learn</h3>
              <p className="mt-2 text-gray-600">
                Connect through chat or video sessions to get personalized help.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Why Choose ScholarStream</h2>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                    <Award className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Qualified Tutors</h3>
                  <p className="mt-2 text-gray-600">
                    All our tutors are thoroughly vetted for their expertise and teaching abilities.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                    <Calendar className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Flexible Scheduling</h3>
                  <p className="mt-2 text-gray-600">
                    Book sessions at times that work for you, with 24/7 availability.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Real-time Collaboration</h3>
                  <p className="mt-2 text-gray-600">
                    Connect through chat, video, and file sharing for effective learning.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Subject Variety</h3>
                  <p className="mt-2 text-gray-600">
                    Get help in any subject, from math and science to humanities and languages.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to boost your academic performance?</span>
            <span className="block text-blue-200">Join ScholarStream today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link to="/auth?mode=signup">
                <Button variant="primary" size="lg" className="bg-white text-blue-700 hover:bg-gray-100">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;