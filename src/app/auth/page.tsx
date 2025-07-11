'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const { user, signOut, signIn } = useAuth();
  const router = useRouter();
  
  // Check if we're in demo mode
  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                     process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://demo.supabase.co'

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const signInWithGoogle = async () => {
    if (isDemoMode) {
      // In demo mode, just create a demo user
      const { error } = await signIn('demo@guttracker.com', 'demo123');
      if (!error) {
        router.push('/dashboard');
      }
      return;
    }

    try {
      setLoading(true);
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) {
        console.error('Error signing in with Google:', error.message);
        alert('Error signing in with Google: ' + error.message);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 border border-white/20">
          <div className="text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome back!</h2>
              <p className="text-white/70">You are signed in as:</p>
              <p className="font-semibold text-purple-300">{user.email}</p>
              {isDemoMode && (
                <p className="text-emerald-300 text-sm mt-2">🎯 Demo Mode Active</p>
              )}
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors font-medium"
              >
                Go to Dashboard
              </button>
              
              <button
                onClick={handleSignOut}
                className="w-full bg-white/10 text-white py-3 px-4 rounded-lg hover:bg-white/20 transition-colors border border-white/20"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 border border-white/20">
        <div className="text-center">
          {/* Logo/Icon */}
          <div className="mb-8">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">GutSee</h1>
            <p className="text-white/70">AI-powered gut health tracking</p>
            {isDemoMode && (
              <div className="mt-4 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/50 rounded-lg p-3">
                <p className="text-emerald-200 text-sm font-medium">🎯 Demo Mode Active</p>
                <p className="text-emerald-200/80 text-xs">
                  Try the app without real authentication
                </p>
              </div>
            )}
          </div>

          {/* Sign in options */}
          <div className="space-y-4">
            {/* Google Sign In - works in both demo and real mode */}
            <button
              onClick={signInWithGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-medium">
                {loading ? 'Signing in...' : (isDemoMode ? 'Continue with Demo Google' : 'Continue with Google')}
              </span>
            </button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900 text-white/60">or</span>
              </div>
            </div>
            
            <Link
              href="/auth/login"
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors font-medium"
            >
              Sign In with Email
            </Link>
            
            <Link
              href="/auth/signup"
              className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              Create Account
            </Link>
          </div>

          {/* Additional info */}
          <div className="mt-6 text-sm text-white/60">
            <p>Secure {isDemoMode ? 'demo' : 'authentication'}</p>
            <p className="mt-2">
              By signing in, you agree to our{' '}
              <a href="/terms" className="text-purple-300 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy" className="text-purple-300 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
