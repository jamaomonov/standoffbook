import React from 'react';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Provider icons
const SteamIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" fill="currentColor" className="w-5 h-5">
    <path d="M496 256c0 137-111.2 248-248.4 248-113.8 0-209.6-76.3-239-180.4l95.2 39.3c6.4 32.1 34.9 56.4 68.9 56.4 39.2 0 71.9-32.4 70.2-73.5l84.5-60.2c52.1 1.3 95.8-40.9 95.8-93.5 0-51.6-42-93.5-93.7-93.5s-93.7 42-93.7 93.5v1.2L176.6 279c-15.5-.9-30.7 3.4-43.5 12.1L0 236.1C10.2 108.4 117.1 8 247.6 8 384.8 8 496 119 496 256zM155.7 384.3l-30.5-12.6a52.79 52.79 0 0 0 27.2 25.8c26.9 11.2 57.8-1.6 69-28.4 5.4-13 5.5-27.3.1-40.3-5.4-13-15.5-23.2-28.5-28.6-12.9-5.4-26.7-5.2-38.9-.6l31.5 13c19.8 8.2 29.2 30.9 20.9 50.7-8.3 19.9-31 29.2-50.8 21zm173.8-129.9c-34.4 0-62.4-28-62.4-62.3s28-62.3 62.4-62.3 62.4 28 62.4 62.3-27.9 62.3-62.4 62.3zm.1-15.6c25.9 0 46.9-21 46.9-46.8 0-25.9-21-46.8-46.9-46.8s-46.9 21-46.9 46.8c.1 25.8 21.1 46.8 46.9 46.8z" />
  </svg>
);

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" fill="currentColor" className="w-5 h-5">
    <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
  </svg>
);

const TelegramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" fill="currentColor" className="w-5 h-5">
    <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm121.8 169.9l-40.7 191.8c-3 13.6-11.1 16.9-22.4 10.5l-62-45.7-29.9 28.8c-3.3 3.3-6.1 6.1-12.5 6.1l4.4-63.1 114.9-103.8c5-4.4-1.1-6.9-7.7-2.5l-142 89.4-61.2-19.1c-13.3-4.2-13.6-13.3 2.8-19.7l239.1-92.2c11.1-4 20.8 2.7 17.2 19.5z" />
  </svg>
);

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { authWithProvider, loading } = useAuth();

  if (!isOpen) return null;

  const handleAuth = async (provider: AuthProvider) => {
    try {
      await authWithProvider(provider);
      onClose();
    } catch (error) {
      console.error('Authentication error:', error);
      // You could set an error state here and display it to the user
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-csm-bg-card rounded-xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-csm-text-secondary hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-bold text-white mb-6 text-center">Sign In</h2>

        <div className="space-y-4">
          <p className="text-csm-text-secondary text-center mb-6">
            Choose a service to sign in with:
          </p>

          <button
            onClick={() => handleAuth('steam')}
            disabled={loading}
            className="flex items-center justify-center bg-[#1b2838] hover:bg-[#2a3f5a] text-white w-full py-3 px-4 rounded-md transition-colors"
          >
            <SteamIcon />
            <span className="ml-3">Sign in with Steam</span>
          </button>

          <button
            onClick={() => handleAuth('google')}
            disabled={loading}
            className="flex items-center justify-center bg-white hover:bg-gray-100 text-gray-800 w-full py-3 px-4 rounded-md transition-colors"
          >
            <GoogleIcon />
            <span className="ml-3">Sign in with Google</span>
          </button>

          <button
            onClick={() => handleAuth('telegram')}
            disabled={loading}
            className="flex items-center justify-center bg-[#0088cc] hover:bg-[#0099dd] text-white w-full py-3 px-4 rounded-md transition-colors"
          >
            <TelegramIcon />
            <span className="ml-3">Sign in with Telegram</span>
          </button>
        </div>

        <div className="mt-6 text-center text-csm-text-secondary text-sm">
          <p>By signing in, you agree to our <a href="/terms" className="text-csm-blue-accent hover:underline">Terms of Service</a> and <a href="/privacy" className="text-csm-blue-accent hover:underline">Privacy Policy</a>.</p>
        </div>

        {loading && (
          <div className="mt-4 text-center text-csm-text-secondary">
            <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-csm-blue-accent"></div>
            <span className="ml-2">Authenticating...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
