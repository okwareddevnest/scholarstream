import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Button from '../ui/Button';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">ScholarStream</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="hidden md:flex items-center space-x-6">
                  <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
                    Dashboard
                  </Link>
                  {user.role === 'student' && (
                    <Link to="/assignments" className="text-gray-700 hover:text-blue-600">
                      Assignments
                    </Link>
                  )}
                  {user.role === 'tutor' && (
                    <Link to="/sessions" className="text-gray-700 hover:text-blue-600">
                      Sessions
                    </Link>
                  )}
                  <Link to="/messages" className="text-gray-700 hover:text-blue-600">
                    Messages
                  </Link>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Link to="/profile" className="flex items-center text-gray-700 hover:text-blue-600">
                    <User className="h-5 w-5 mr-1" />
                    <span className="hidden md:inline">{user.firstName}</span>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    <span className="hidden md:inline">Sign Out</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/auth">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;