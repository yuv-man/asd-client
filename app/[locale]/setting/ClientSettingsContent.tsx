'use client'
import { useState, useEffect } from 'react';    
import Dashboard from '@/app/components/setting/dashboard';
import Profile from '@/app/components/setting/profile';
import { useUserStore } from '@/store/userStore'
import { userAPI } from '@/lib/api';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/wonderkid.svg';
import '@/app/styles/setting.scss';


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
      <div className="settings-container">
        <nav>
          <div className="nav-container">
            <div className="nav-content">
              <div className="nav-items">
                <div className="nav-buttons">
                  <Image src={logo} alt="logo" width={30} height={30} />
                  <button
                    className={`nav-button ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    {t('setting.profile')}
                  </button>
                  <button
                    className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                  >
                    {t('setting.dashboard')}
                  </button>
                </div>
                <Link
                  href={`/${locale}/training`}
                  className="back-link"
                >
                  <span className="flex items-center">
                    <span className="ml-1">{t('setting.back')}</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </nav>
  
        <div className="content-area">
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