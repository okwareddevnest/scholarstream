import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Calendar, Clock, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';

const DashboardPage: React.FC = () => {
  const { user, isLoading } = useAuthStore();
  const navigate = useNavigate();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Don't render anything while checking auth status
  }

  // Mock data for dashboard
  const studentDashboard = (
    <div className="space-y-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Active Assignments</h3>
        </div>
        <div className="p-6">
          {/* Mock assignment list */}
          <div className="space-y-4">
            <div className="border rounded-md p-4 hover:bg-gray-50">
              <div className="flex justify-between">
                <h4 className="font-medium">Calculus Problem Set</h4>
                <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">In Progress</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Due in 3 days</p>
            </div>
            <div className="border rounded-md p-4 hover:bg-gray-50">
              <div className="flex justify-between">
                <h4 className="font-medium">Physics Lab Report</h4>
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Matched</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Due in 5 days</p>
            </div>
          </div>
          
          <div className="mt-4">
            <Button
              variant="primary"
              onClick={() => navigate('/assignments/new')}
            >
              New Assignment
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Upcoming Sessions</h3>
        </div>
        <div className="p-6">
          {/* Mock session list */}
          <div className="space-y-4">
            <div className="border rounded-md p-4 hover:bg-gray-50">
              <div className="flex justify-between">
                <h4 className="font-medium">Calculus with Dr. Smith</h4>
                <span className="text-sm text-gray-600">Today, 4:00 PM</span>
              </div>
              <div className="flex items-center mt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/sessions/123')}
                >
                  Join Session
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tutorDashboard = (
    <div className="space-y-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Assignment Requests</h3>
        </div>
        <div className="p-6">
          {/* Mock assignment requests */}
          <div className="space-y-4">
            <div className="border rounded-md p-4 hover:bg-gray-50">
              <div className="flex justify-between">
                <h4 className="font-medium">Advanced Statistics Help</h4>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">New Request</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Due in 7 days</p>
              <div className="flex items-center mt-2 space-x-2">
                <Button
                  variant="primary"
                  size="sm"
                >
                  Accept
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                >
                  Decline
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Upcoming Sessions</h3>
        </div>
        <div className="p-6">
          {/* Mock session list */}
          <div className="space-y-4">
            <div className="border rounded-md p-4 hover:bg-gray-50">
              <div className="flex justify-between">
                <h4 className="font-medium">Calculus with Alex Johnson</h4>
                <span className="text-sm text-gray-600">Today, 4:00 PM</span>
              </div>
              <div className="flex items-center mt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/sessions/123')}
                >
                  Join Session
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Earnings Overview</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold">$420.00</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold">$1,250.00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {user.firstName}!
        </h1>
        <p className="text-gray-600">
          {user.role === 'student' 
            ? 'Here\'s an overview of your academic progress and upcoming sessions.' 
            : 'Here\'s an overview of your tutoring activities and upcoming sessions.'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {user.role === 'student' ? 'Active Assignments' : 'Active Tutoring Jobs'}
            </p>
            <p className="text-xl font-semibold">2</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <Calendar className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Upcoming Sessions</p>
            <p className="text-xl font-semibold">1</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <Clock className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {user.role === 'student' ? 'Hours of Tutoring' : 'Hours Tutored'}
            </p>
            <p className="text-xl font-semibold">12</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <div className="rounded-full bg-yellow-100 p-3 mr-4">
            {user.role === 'student' ? (
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            ) : (
              <Users className="h-6 w-6 text-yellow-600" />
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {user.role === 'student' ? 'Completed Assignments' : 'Students Helped'}
            </p>
            <p className="text-xl font-semibold">5</p>
          </div>
        </div>
      </div>
      
      {user.role === 'student' ? studentDashboard : tutorDashboard}
    </div>
  );
};

export default DashboardPage;