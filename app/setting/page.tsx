'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import './setting.sass'
import Dashboard from '../components/setting/dashboard';
import Profile from '../components/setting/profile';
import { useUserStore } from '@/store/userStore'
import { userAPI } from '@/services/api';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isHydrated, setIsHydrated] = useState(false);
  const {user, setUser} = useUserStore()

  useEffect(() => {
    if (user !== undefined) {
      setIsHydrated(true);
    }
  }, [user]);

  const handleProfileSave = (data: any) => {
    setUser(data);
    userAPI.update(data);
  };

  if (!isHydrated) return <p>Loading...</p>;
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center py-4">
            <div className="flex flex-row justify-between w-500 items-center">
                <div className="flex space-x-8" >
                    <button
                        className={`${
                        activeTab === 'profile'
                            ? 'active'
                            : 'text-gray-500 hover:text-gray-700'
                        } px-3 py-2 font-medium nav`}
                        onClick={() => setActiveTab('profile')}
                    >
                        Profile
                    </button>
                    <button
                        className={`nav ${
                        activeTab === 'dashboard'
                            ? 'active'
                            : ''
                        } px-3 py-2 font-medium`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        Dashboard
                    </button>
              </div>
              <Link
                href="/training"
                className="text-gray-500 hover:text-gray-700 mr-6"
                >
                <span className="flex items-center">
                    <span className="ml-1">Back</span>
                    </span>
                </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'profile' && (
          <div>
            <Profile user={user} onSave={handleProfileSave}/>
          </div>
        )}
        {activeTab === 'dashboard' && (
          <div>
            <Dashboard user={user}/>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
