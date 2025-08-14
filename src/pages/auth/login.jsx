import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, MessageCircle, Users, TrendingUp } from 'lucide-react'
import { useSelector, useDispatch } from "react-redux";
import { setLoginField, setAuthenticated } from "../../redux/slices/authSlice";
import { navigationLinks } from '../../utils/constants';
import { useLoginMutation } from '../../redux/api/authApiSlice';

const Login = () => {
  const dispatch = useDispatch();

  const { email, password } = useSelector((state) => state.auth.login);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); 
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading,}] = useLoginMutation();

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setAuthenticated({ isAuthenticated: true, user: result.user }));
      // Optionally redirect here
    } catch (err) {
      alert(err?.data?.message || "Login failed");
    }

  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(setLoginField({ field: name, value }));
  };

  const features = [
    {
      icon: MessageCircle,
      title: 'WhatsApp Integration',
      description: 'Direct coordination with other HR professionals'
    },
    {
      icon: Users,
      title: 'Duplicate Detection',
      description: 'Instant candidate verification to prevent conflicts'
    },
    {
      icon: TrendingUp,
      title: 'Success Analytics',
      description: 'Track your hiring performance and collaboration metrics'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">OS</span>
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">OfferSync</span>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Or{' '}
              <Link to={navigationLinks.register.path} className="font-medium text-primary-600 hover:text-primary-500">
                create a new account
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={handleInputChange}
                    placeholder="priya@techcorpa.com"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin -ml-1 mr-3 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="text-center text-sm text-gray-500">
                Demo credentials: Any email and password
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Features */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 flex flex-col justify-center px-12">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold text-white mb-8">
              Transform HR Collaboration
            </h2>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                    <p className="mt-1 text-primary-100">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-white bg-opacity-10 rounded-lg">
              <p className="text-sm text-white">
                "OfferSync reduced our candidate confusion by 85% and improved collaboration with other companies."
              </p>
              <p className="mt-2 text-xs text-primary-100">- HR Director, TechCorp</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login