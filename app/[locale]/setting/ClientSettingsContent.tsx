'use client'
import { useState, useEffect } from 'react';    
import Dashboard from '@/app/components/setting/dashboard';
import Profile from '@/app/components/setting/profile';
import { useUserStore } from '@/store/userStore'
import { userAPI } from '@/services/api';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/wonderkid.svg';


const ClientSettingsContent = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isHydrated, setIsHydrated] = useState(false);
    const {user, setUser} = useUserStore()
    const t = useTranslations();
    const locale = useLocale();
  
    useEffect(() => {
      if (user !== undefined) {
        setIsHydrated(true);
      }
    }, [user]);
  
    const handleProfileSave = async (data: any) => {
      const res = await userAPI.update(data);
      if (res.status === 200) {
        setUser(res.data);
      }
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
                    <Image src={logo} alt="logo" width={15} height={15} />
                      <button
                          className={`${
                          activeTab === 'profile'
                              ? 'active'
                              : 'text-gray-500 hover:text-gray-700'
                          } px-3 py-2 font-medium nav`}
                          onClick={() => setActiveTab('profile')}
                      >
                          {t('setting.profile')}
                      </button>
                      <button
                          className={`nav ${
                          activeTab === 'dashboard'
                              ? 'active'
                              : ''
                          } px-3 py-2 font-medium`}
                          onClick={() => setActiveTab('dashboard')}
                      >
                          {t('setting.dashboard')}
                      </button>
                </div>
                <Link
                  href={`/${locale}/training`}
                  className="text-gray-500 hover:text-gray-700 mr-6"
                >
                  <span className="flex items-center">
                    <span className="ml-1">{t('setting.back')}</span>
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

export default ClientSettingsContent;