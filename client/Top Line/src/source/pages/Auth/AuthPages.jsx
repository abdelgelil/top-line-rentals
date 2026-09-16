import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';

export const LoginPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 p-2 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800">
        <SignIn 
          routing="path" 
          path="/login" 
          signUpUrl="/signup"
          afterSignInUrl="/"
          appearance={{
            elements: {
              formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl py-3',
              card: 'shadow-none bg-transparent',
              headerTitle: 'text-slate-900 dark:text-white font-extrabold',
              headerSubtitle: 'text-slate-500 dark:text-slate-400',
            }
          }}
        />
      </div>
    </div>
  );
};

export const SignUpPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 p-2 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800">
        <SignUp 
          routing="path" 
          path="/signup" 
          signInUrl="/login"
          afterSignUpUrl="/"
          appearance={{
            elements: {
              formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl py-3',
              card: 'shadow-none bg-transparent',
            }
          }}
        />
      </div>
    </div>
  );
};