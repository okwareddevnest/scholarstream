import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/authStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import type { UserRole } from '../../types';

type FormMode = 'signin' | 'signup';

interface AuthFormProps {
  defaultMode?: FormMode;
  onSuccess?: () => void;
}

interface SignInFormData {
  email: string;
  password: string;
}

interface SignUpFormData extends SignInFormData {
  firstName: string;
  lastName: string;
  role: UserRole;
}

const AuthForm: React.FC<AuthFormProps> = ({ 
  defaultMode = 'signin',
  onSuccess
}) => {
  const [mode, setMode] = useState<FormMode>(defaultMode);
  const { signIn, signUp, isLoading, error } = useAuthStore();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset
  } = useForm<SignUpFormData>();

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    reset();
  };

  const onSubmit = async (data: SignUpFormData) => {
    try {
      if (mode === 'signin') {
        await signIn(data.email, data.password);
      } else {
        await signUp(
          data.email, 
          data.password, 
          data.role, 
          data.firstName, 
          data.lastName
        );
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">
          {mode === 'signin' ? 'Sign in to your account' : 'Create a new account'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={toggleMode}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {mode === 'signup' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                {...register('firstName', { required: 'First name is required' })}
                error={errors.firstName?.message}
                placeholder="John"
                fullWidth
              />
              <Input
                label="Last Name"
                {...register('lastName', { required: 'Last name is required' })}
                error={errors.lastName?.message}
                placeholder="Doe"
                fullWidth
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="student"
                    {...register('role', { required: 'Please select a role' })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2">Student</span>
                </label>
                <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="tutor"
                    {...register('role', { required: 'Please select a role' })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2">Tutor</span>
                </label>
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>
          </>
        )}

        <Input
          label="Email Address"
          type="email"
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          error={errors.email?.message}
          placeholder="you@example.com"
          fullWidth
        />

        <Input
          label="Password"
          type="password"
          {...register('password', { 
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters'
            }
          })}
          error={errors.password?.message}
          placeholder="••••••••"
          fullWidth
        />

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          fullWidth
        >
          {mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </Button>
      </form>
    </div>
  );
};

export default AuthForm;