/**
 * Login Page Component
 * Google OAuth login page
 */

import { BookOpen, Brain, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const { login } = useAuth();

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'AI-Powered Analysis',
      description: 'Extract key concepts from any study material automatically'
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Smart Flashcards',
      description: 'Generate flashcards instantly for effective learning'
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Interactive Study',
      description: 'Review with flip animations and track your progress'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left side - Branding */}
            <div className="bg-primary-600 p-8 md:p-12 text-white">
              <div className="flex items-center gap-3 mb-8">
                <BookOpen className="w-10 h-10" />
                <h1 className="text-2xl font-bold">Study Assistant</h1>
              </div>
              
              <h2 className="text-3xl font-bold mb-4">
                Learn Smarter with AI
              </h2>
              <p className="text-primary-100 mb-8">
                Transform any study material into interactive flashcards and 
                highlighted key concepts with the power of artificial intelligence.
              </p>

              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="p-2 bg-white/10 rounded-lg">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-primary-100">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Login */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="max-w-sm mx-auto w-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-600 mb-8">
                  Sign in to access your study materials and flashcards.
                </p>

                <button
                  onClick={login}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 
                           bg-white border border-gray-300 rounded-lg shadow-sm 
                           hover:bg-gray-50 hover:shadow transition-all duration-200
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  {/* Google Icon */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="font-medium text-gray-700">
                    Continue with Google
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </button>

                <p className="mt-6 text-center text-xs text-gray-500">
                  By signing in, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
