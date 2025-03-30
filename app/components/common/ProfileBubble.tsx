'use client'
import { Avatar, User } from '@/types/types';
import Image from 'next/image';
import { avatars } from '../../helpers/avatars';
import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import '@/app/styles/ProfileBubble.scss';

function ProfileDetails({ user }: { user: User }) {
    const t = useTranslations();
    const locale = useLocale();
    const [avatarUrl, setAvatarUrl] = useState<Avatar | undefined>(undefined);

    useEffect(() => {
        if (user?.avatarUrl) {
          const avatar = avatars.find(avatar => avatar.id === user.avatarUrl);
          if (avatar) {
            setAvatarUrl(avatar);
          }
        }
      }, [user]);

    return (
        <div className="profile-bubble">
            <div className="avatar-section">
                <div className="avatar-grid">
                    <Image 
                        src={avatarUrl?.src || avatars[0].src}
                        alt="Avatar"
                        height={100}
                        width={100}
                        className="rounded-full object-cover"
                    />
                </div>
            </div>
            <div className="details-section">
                <h3>{t('Hello')}, {user.name}</h3>
            </div>
        </div>
    )
}

export default ProfileDetails;