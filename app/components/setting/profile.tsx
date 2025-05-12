import { useState, useEffect } from 'react';
import Image from 'next/image';
import { avatars } from '../../helpers/avatars';
import TherapyArea from '../common/TherapyArea';
import { ProfileProps } from '@/types/props';
import { Avatar } from '@/types/types';
import { LanguageSelector } from '../common/languageSelector';
import { useTranslations } from 'next-intl';
import '@/app/styles/profile.scss';

function Profile({ user, onSave }: ProfileProps) {
  const t = useTranslations();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [parentPhone, setParentPhone] = useState(user?.parentPhone || '')
  const [age, setAge] = useState(user?.age || 4)
  const [avatarUrl, setAvatarUrl] = useState<Avatar | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [levelCognitive, setLevelCognitive] = useState(user?.areasProgress?.cognitive
    .difficultyLevel || 1)
  const [levelOt, setLevelOt] = useState(user?.areasProgress?.ot
    .difficultyLevel || 1)
  const [levelSpeech, setLevelSpeech] = useState(user?.areasProgress?.speech
    .difficultyLevel || 1)
  const [enabledCognitive, setEnabledCognitive] = useState(user?.areasProgress?.cognitive?.enabled ?? true);
  const [enabledOt, setEnabledOt] = useState(user?.areasProgress?.ot?.enabled ?? true);
  const [enabledSpeech, setEnabledSpeech] = useState(user?.areasProgress?.speech?.enabled ?? true);
  const [numOfExercises, setNumOfExercises] = useState(3);

  useEffect(() => {
    if (user?.avatarUrl) {
      const avatar = avatars.find(avatar => avatar.id === user.avatarUrl);
      if (avatar) {
        setAvatarUrl(avatar);
      }
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave({ 
        _id: user?._id || '',
        name, 
        email, 
        parentPhone, 
        levelCognitive, 
        levelOt, 
        levelSpeech,
        enabledCognitive,
        enabledOt,
        enabledSpeech,
        avatarUrl: avatarUrl?.id ?? '',
        numOfExercises,
        age
      });
    }
    setIsEditing(false);
  };

  const pickAvatar = (e: React.MouseEvent<HTMLButtonElement>, avatar: Avatar) => {
    e.preventDefault();
    setAvatarUrl(avatar);
  };

  return (
    <div className="profile-container">
      <div className="header">
        <h1 className="title">{t('setting.profileSettings')}</h1>
        <LanguageSelector />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="avatar-section">
          <div className="avatar-grid">
            <div className="selected-avatar">
              <Image
                src={avatarUrl?.src || avatars[0].src}
                alt="Profile avatar"
                fill
                className="avatar-image"
                sizes='(max-width: 640px) 100px, (max-width: 768px) 150px, 200px'
              />
            </div>

            {isEditing && (
              <div className="avatar-selection">
                {avatars.map((avatar, index) => (
                  <button
                    key={index}
                    onClick={(e) => pickAvatar(e, avatar)}
                    className={`image-button ${avatarUrl?.src === avatar.src ? 'selected' : ''}`}
                  >
                    <Image
                      src={avatar.src}
                      alt={`Avatar option ${index + 1}`}
                      fill
                      className="avatar-image"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-layout">
          <div className="form-column">
            <h2 className="title">{t('setting.personalInformation')}</h2>
            <div className="input-group">
              <label htmlFor="name" className="block text-sm font-medium">
                {t('setting.name')}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  required
                />
              ) : (
                <p className="mt-1">{name || 'Not set'}</p>
              )}
            </div>
            <div className="input-group">
              <label htmlFor="age" className="block text-sm font-medium">
                {t('setting.age')}
              </label>
              {isEditing ? (
                <input
                  type="number"
                  id="age"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value))}
                  className="input-field"
                />
              ) : (
                <p className="mt-1">{age || 4}</p>
              )}
            </div>
            <div className="input-group">
              <label htmlFor="email" className="block text-sm font-medium">
                {t('setting.email')}
              </label>
              {isEditing ? (
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                />
              ) : (
                <p className="mt-1">{email || 'Not set'}</p>
              )}
            </div>
            <div className="input-group">
              <label htmlFor="phone" className="block text-sm font-medium">
                {t('setting.phone')}
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  id="phone"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="input-field"
                />
              ) : (
                <p className="mt-1">{parentPhone || 'Not set'}</p>
              )}
            </div>
          </div>

          <div className="form-column">
            <h2 className="title">{t('setting.therapyAreas')}</h2>
            
            <div className="grid gap-4">
              <TherapyArea
                title={t('setting.cognitiveTherapy')}
                enabled={enabledCognitive}
                level={levelCognitive}
                isEditing={isEditing}
                onEnableChange={setEnabledCognitive}
                onLevelChange={setLevelCognitive}
              />
              <TherapyArea
                title={t('setting.occupationalTherapy')}
                enabled={enabledOt}
                level={levelOt}
                isEditing={isEditing}
                onEnableChange={setEnabledOt}
                onLevelChange={setLevelOt}
              />
              <TherapyArea
                title={t('setting.speechTherapy')}
                enabled={enabledSpeech}
                level={levelSpeech}
                isEditing={isEditing}
                onEnableChange={setEnabledSpeech}
                onLevelChange={setLevelSpeech}
              />
              <div className="input-group">
                <label htmlFor="numOfExercises" className="block text-sm font-medium">
                  {t('setting.number_of_exercises')}
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    id="numOfExercises"
                    value={numOfExercises}
                    onChange={(e) => setNumOfExercises(parseInt(e.target.value))}
                    className="input-field"
                  />
                ) : (
                  <p className="mt-1">{numOfExercises || 3}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="button-group">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="setting-button"
              >
                {t('setting.cancel')}
              </button>
              <button
                type="submit"
                className="setting-button"
              >
                {t('setting.save')}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="setting-button"
            >
              {t('setting.editProfile')}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default Profile;
