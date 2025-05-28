import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useAuth, User } from '../contexts/AuthContext';
import defaultAvatar from '../assets/default-avatar.jpg';

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

interface ProfileFormData {
  displayName: string;
  tradeLink: string;
}

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser, loading, updateUserProfile, logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    displayName: '',
    tradeLink: ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');

  // Update form data when user data changes
  useEffect(() => {
    if (currentUser) {
      setFormData({
        displayName: currentUser.displayName || '',
        tradeLink: currentUser.tradeLink || ''
      });
    }
  }, [currentUser]);

  // If not authenticated, redirect to home
  if (!loading && !currentUser) {
    return <Navigate to="/" />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError('');
    setUpdateSuccess(false);

    try {
      await updateUserProfile(formData);
      setUpdateSuccess(true);
      setIsEditing(false);
    } catch (error) {
      if (error instanceof Error) {
        setUpdateError(error.message);
      } else {
        setUpdateError('An unknown error occurred');
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect will happen automatically since we check auth state
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'steam':
        return <SteamIcon />;
      case 'google':
        return <GoogleIcon />;
      case 'telegram':
        return <TelegramIcon />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-csm-blue-accent"></div>
            <span className="ml-3 text-csm-text-secondary">Loading profile...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Profile</h1>

          <div className="bg-csm-bg-card rounded-xl overflow-hidden mb-6">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-csm-bg-darker to-csm-blue-primary/30 p-6 relative">
              <div className="flex items-center">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-csm-bg-darker flex items-center justify-center">
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.displayName} className="w-full h-full object-cover" />
                  ) : (
                    <img src={defaultAvatar} alt={currentUser?.displayName} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="ml-4 md:ml-6">
                  <h2 className="text-xl md:text-2xl font-bold text-white">{currentUser?.displayName}</h2>
                  <div className="flex items-center mt-1 text-csm-text-secondary">
                    <span className="mr-2">@{currentUser?.username}</span>
                    {currentUser && (
                      <span className="flex items-center text-xs bg-csm-bg-darker px-2 py-1 rounded-full">
                        {getProviderIcon(currentUser.provider)}
                        <span className="ml-1 capitalize">{currentUser.provider}</span>
                      </span>
                    )}
                  </div>
                  <div className="text-csm-text-secondary text-sm mt-1">
                    Member since {currentUser && formatDate(currentUser.memberSince)}
                  </div>
                </div>
              </div>

              <div className="absolute top-4 right-4 md:top-6 md:right-6">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-csm-bg-darker text-csm-text-secondary hover:text-white px-3 py-1 rounded transition-colors text-sm"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-csm-bg-darker text-csm-text-secondary hover:text-white px-3 py-1 rounded transition-colors text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6">
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="displayName" className="block text-csm-text-secondary mb-2">Display Name</label>
                    <input
                      type="text"
                      id="displayName"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      className="bg-csm-bg-darker text-white w-full px-4 py-2 rounded border border-csm-border focus:outline-none focus:border-csm-blue-accent"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="tradeLink" className="block text-csm-text-secondary mb-2">Trade Link</label>
                    <input
                      type="text"
                      id="tradeLink"
                      name="tradeLink"
                      value={formData.tradeLink}
                      onChange={handleInputChange}
                      placeholder="https://steamcommunity.com/tradeoffer/new/?partner=..."
                      className="bg-csm-bg-darker text-white w-full px-4 py-2 rounded border border-csm-border focus:outline-none focus:border-csm-blue-accent"
                    />
                    <p className="text-csm-text-secondary text-xs mt-1">
                      Your Steam trade link is required for trading items.
                      <a
                        href="https://steamcommunity.com/my/tradeoffers/privacy#trade_offer_access_url"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-csm-blue-accent hover:underline ml-1"
                      >
                        How to find it?
                      </a>
                    </p>
                  </div>

                  {updateError && (
                    <div className="mb-4 text-red-500 bg-red-500/10 p-3 rounded">
                      {updateError}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={updateLoading}
                      className="bg-csm-blue-accent text-white px-4 py-2 rounded hover:bg-csm-blue-hover transition-colors"
                    >
                      {updateLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  {updateSuccess && (
                    <div className="mb-4 text-green-500 bg-green-500/10 p-3 rounded">
                      Profile updated successfully!
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-csm-text-secondary mb-2">Display Name</h3>
                      <p className="text-white">{currentUser?.displayName}</p>
                    </div>

                    <div>
                      <h3 className="text-csm-text-secondary mb-2">Trade Link</h3>
                      {currentUser?.tradeLink ? (
                        <div className="flex items-center">
                          <p className="text-white truncate">{currentUser.tradeLink}</p>
                          <a
                            href={currentUser.tradeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-csm-blue-accent"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                      ) : (
                        <p className="text-csm-text-secondary italic">No trade link set</p>
                      )}
                    </div>

                    <div>
                      <h3 className="text-csm-text-secondary mb-2">Username</h3>
                      <p className="text-white">@{currentUser?.username}</p>
                    </div>

                    <div>
                      <h3 className="text-csm-text-secondary mb-2">Provider ID</h3>
                      <p className="text-white truncate">{currentUser?.providerId}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Section */}
          <div className="bg-csm-bg-card rounded-xl overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-csm-border">
              <h2 className="text-lg font-bold text-white">Account Settings</h2>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-csm-text-secondary mb-2">Connected Account</h3>
                <div className="flex items-center bg-csm-bg-darker p-3 rounded">
                  {currentUser && (
                    <>
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-opacity-20">
                        {getProviderIcon(currentUser.provider)}
                      </div>
                      <div className="ml-3">
                        <p className="text-white capitalize">{currentUser.provider}</p>
                        <p className="text-csm-text-secondary text-sm">Connected on {formatDate(currentUser.memberSince)}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="border-t border-csm-border pt-4">
                <h3 className="text-red-500 mb-2">Danger Zone</h3>
                <button
                  onClick={handleLogout}
                  className="bg-red-900/20 text-red-500 border border-red-900/50 px-4 py-2 rounded hover:bg-red-900/30 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
