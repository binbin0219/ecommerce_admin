'use client';

import api from '@/lib/api-agent';
import { hideLoader, showLoader } from '@/redux/slices/loaderSlice';
import { addToast } from '@/redux/slices/toastSlice';
import axios from 'axios';
import { useState, ChangeEvent, KeyboardEvent, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';

type FormData = {
  name: string;
  username: string;
  password: string;
};

type FormErrors = {
  name?: string;
  username?: string;
  password?: string;
};

export default function SignUpPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: undefined,
    username: undefined,
    password: undefined,
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSignedUp, setIsSignedUp] = useState<boolean>(false);
  const [isUsernameExisted, setIsUsernameExisted] = useState<boolean>(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);
  const checkUsernameExistTimeoutRef = useRef<NodeJS.Timeout | null>(null);  
  const canRegister = useMemo(() => !Object.keys(errors).length, [errors]);
  const dispatch = useDispatch();

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>, type: keyof FormData) => {
    const { value } = e.target;
    
    const nextFormData = {
      ...formData,
      [type]: value,
    };

    setFormData(nextFormData);

    switch(type){
      case 'name':
        validateName(nextFormData.name);
        break;

      case 'username':
        await validateUsername(nextFormData.username);
        break;

      case 'password':
        validatePassword(nextFormData.password);
        break;
    }
  };

  const validateAll = async (formData: FormData) => {
    const nameValidationResult = validateName(formData.name);
    const usernameValidationResult = await validateUsername(formData.username);
    const passwordValidationResult = validatePassword(formData.password);

    return nameValidationResult &&
      usernameValidationResult &&
      passwordValidationResult
  }

  const validateName = (name: string): boolean => {
    let success = true;
    let errorMsg: string | undefined = undefined;

    if (!name.trim()) {
      errorMsg = 'Name is required';
      success = false;
    }

    setErrors(prev => {
      if (success) {
        const { name, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        name: errorMsg,
      };
    });

    return success;
  };

  const validatePassword = (password: string): boolean => {
    let success = true;
    let errorMsg: string | undefined = undefined;

    if (!password) {
      errorMsg = 'Password is required';
      success = false;
    } else if (password.length < 8) {
      errorMsg = 'Password must be at least 8 characters';
      success = false;
    }

    setErrors(prev => {
      if (success) {
        const { password, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        password: errorMsg,
      };
    });

    return success;
  };

  const validateUsername = async (username: string): Promise<boolean> => {
    if(checkUsernameExistTimeoutRef.current) {
      clearTimeout(checkUsernameExistTimeoutRef.current);
      checkUsernameExistTimeoutRef.current = null;
    }

    setIsCheckingUsername(true);

    let success = true;
    let errorMsg: string | undefined = undefined;

    if (!username.trim()) {
      errorMsg = 'Username is required';
      success = false;
    } else if (username.length < 3) {
      errorMsg = 'Username must be at least 3 characters';
      success = false;
    } else if (await checkIsUsernameExisted(username)) {
      errorMsg = 'Username existed';
      success = false;
    }

    setErrors(prev => {
      if (success) {
        const { username, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        username: errorMsg,
      };
    });

    setIsCheckingUsername(false);
    return success;
  };

  const handleSubmit = async () => {
    try {
      dispatch(showLoader());

      const success = await validateAll(formData);

      if(!success) {
          return;
      }
      
      await api.post('/sellers/sign-up', {
          name: formData.name,
          username: formData.username,
          password: formData.password,
      });

      setIsSignedUp(true);
      dispatch(addToast({
          type: 'success',
          message: 'Sign up successfully!'
      }))
    } catch (error) {
      if(axios.isAxiosError(error) && error.response?.data?.message == 'USERNAME_EXISTED') {
        dispatch(addToast({
            type: 'error',
            message: 'Username existed!'
        }));
        setIsUsernameExisted(true);
      } else {
        console.error(error);
        dispatch(addToast({
            type: 'error',
            message: 'Failed to sign up, please try again!'
        }))
      }
      setIsSignedUp(false);
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const checkIsUsernameExisted = async (username: string): Promise<boolean> => {
    return new Promise((resolve) => {
      checkUsernameExistTimeoutRef.current = setTimeout(async () => {
        try {
          if (!username.trim()) {
            setIsUsernameExisted(false);
            return resolve(false);
          }

          const response = await api.get(
            `/sellers/username/exists/${username}`
          );

          setIsUsernameExisted(response.data);
          return resolve(response.data);
        } catch (error) {
          console.error(error);
          dispatch(
            addToast({
              type: "error",
              message: "Failed to check username availability, please try again!",
            })
          );
        }
      }, 500);
    })
  };

  return (
    <div className="min-h-screen bg-bgPri flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-xl mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-textSec mb-2">
            Create Seller Account
          </h1>
          <p className="text-textPri">
            Join our marketplace and start selling today
          </p>
        </div>

        {/* Sign Up Card */}
        <div className="bg-bgSec rounded-2xl shadow-lg border border-borderPri p-8">
          <div className="space-y-6">
            
            {isSignedUp && (
                <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <h3 className="text-sm font-semibold text-green-800 dark:text-green-300">Account created successfully!</h3>
                        <p className="text-sm text-green-700 dark:text-green-400 mt-1">You can now sign in with your credentials.
                        </p>
                        <a href="/login" className="text-green-700 hover:underline font-medium text-sm">
                            Sign in
                        </a>
                    </div>
                </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-textSec mb-2">
                Store name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange(e, 'name')}
                onKeyDown={handleKeyPress}
                className={`w-full px-4 py-3 bg-bgPri border ${
                  errors.name ? 'border-red-500' : 'border-borderPri'
                } rounded-lg text-textSec placeholder-textPri focus:outline-none focus:ring-2 focus:ring-primary transition-all`}
                placeholder="Enter your store name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-textSec mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                autoComplete="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange(e, 'username')}
                onKeyDown={handleKeyPress}
                className={`w-full px-4 py-3 bg-bgPri border ${
                  errors.username ? 'border-red-500' : 'border-borderPri'
                } rounded-lg text-textSec placeholder-textPri focus:outline-none focus:ring-2 focus:ring-primary transition-all`}
                placeholder="Choose a username"
              />
              {isCheckingUsername && (
                <p className="mt-1 text-sm text-green-500">Checking availability...</p>
              )}
              {!isCheckingUsername && errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-textSec mb-2">
                Password <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <input
                  autoComplete="new-password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange(e, 'password')}
                  onKeyDown={handleKeyPress}
                  className={`w-full px-4 py-3 bg-bgPri border ${
                    errors.password ? 'border-red-500' : 'border-borderPri'
                  } rounded-lg text-textSec placeholder-textPri focus:outline-none focus:ring-2 focus:ring-primary transition-all pr-12`}
                  placeholder="Create a strong password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textPri hover:text-textSec transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.584 10.587a2 2 0 002.829 2.829" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c1.743 0 3.386.44 4.812 1.207" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              disabled={!canRegister}
              onClick={handleSubmit}
              className={`
                w-full bg-primary text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                ${canRegister && 'hover:opacity-90 cursor-pointer'}
              `}
            >
              Create Account
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-textPri">
              Already have an account?{' '}
              <a href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </a>
            </p>
          </div>
        </div>

        {/* Terms */}
        <p className="text-center text-sm text-textPri mt-6">
          By signing up, you agree to our{' '}
          <a href="#" className="text-primary hover:underline">Terms of Service</a>{' '}
          and{' '}
          <a href="#" className="text-primary hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
