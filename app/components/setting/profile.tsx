import { useState, useEffect } from 'react';
import Image from 'next/image';
import { avatars } from '../../helpers/avatars';
import TherapyArea from '../common/TherapyArea';
import { ProfileProps } from '@/types/props';
import { Avatar } from '@/types/types';
import { LanguageSelector } from '../common/languageSelector';
import { useTranslations } from 'next-intl';

export default function Profile({ user, onSave }: ProfileProps) {
  const t = useTranslations();
  const [name, setName] = useState(user?.name || '');
  const [parentEmail, setParentEmail] = useState(user?.parentEmail || '');
  const [parentPhone, setParentPhone] = useState(user?.parentPhone || '')
  const [age, setAge] = useState(user?.age || 4)
  const [avatarUrl, setAvatarUrl] = useState<Avatar | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [levelCognitive, setLevelCognitive] = useState(user?.areasProgress?.cognitive
    .difficultyLevel || 1)
  const [levelOt, setLevelOt] = useState(user?.areasProgress?.occupationalTherapy
    .difficultyLevel || 1)
  const [levelSpeech, setLevelSpeech] = useState(user?.areasProgress?.speechTherapy
    .difficultyLevel || 1)
  const [enabledCognitive, setEnabledCognitive] = useState(user?.areasProgress?.cognitive?.enabled ?? true);
  const [enabledOt, setEnabledOt] = useState(user?.areasProgress?.occupationalTherapy?.enabled ?? true);
  const [enabledSpeech, setEnabledSpeech] = useState(user?.areasProgress?.speechTherapy?.enabled ?? true);
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
        parentEmail, 
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
    <div className="max-w-2xl mx-auto p-4">
      <div className='flex justify-between items-center'>
        <h1 className="title text-2xl font-bold mb-6">{t('setting.Profile_Settings')}</h1>
        <LanguageSelector />
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Selected avatar - larger size */}
            <div className="relative w-32 h-32">
              <Image
                src={avatarUrl?.src || avatars[0].src}
                alt="Profile avatar"
                fill
                className="rounded-full object-cover"
              />
            </div>

            {/* Avatar selection grid - only shown when editing */}
            {isEditing && (
              <div className="flex flex-wrap gap-2">
                {avatars.map((avatar, index) => (
                  <button
                    key={index}
                    onClick={(e) => pickAvatar(e, avatar)}
                    className={`image-button relative w-16 h-16 rounded-full overflow-hidden hover:ring-2 hover:ring-primary-500 
                      ${avatarUrl?.src === avatar.src ? 'ring-2 ring-primary-500' : ''}`}
                  >
                    <Image
                      src={avatar.src}
                      alt={`Avatar option ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
                
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-8">
          <div className="w-1/2 space-y-4">
            <h2 className="title text-lg font-semibold">{t('setting.Personal_Information')}</h2>
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                {t('setting.Name')}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              ) : (
                <p className="mt-1">{name || 'Not set'}</p>
              )}
            </div>
            <div>
              <label htmlFor="age" className="block text-sm font-medium">
                {t('setting.Age')}
              </label>
              {isEditing ? (
                <input
                  type="number"
                  id="age"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              ) : (
                <p className="mt-1">{age || 4}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                {t('setting.Email')}
              </label>
              {isEditing ? (
                <input
                  type="email"
                  id="email"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              ) : (
                <p className="mt-1">{parentEmail || 'Not set'}</p>
              )}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium">
                {t('setting.Phone')}
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  id="phone"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
              ) : (
                <p className="mt-1">{parentPhone || 'Not set'}</p>
              )}
            </div>
          </div>

          <div className="w-1/2 space-y-4">
            <h2 className="title text-lg font-semibold">{t('setting.Therapy_Areas')}</h2>
            
            <div className="grid gap-4">
              <TherapyArea
                title={t('setting.Cognitive_Therapy')}
                enabled={enabledCognitive}
                level={levelCognitive}
                isEditing={isEditing}
                onEnableChange={setEnabledCognitive}
                onLevelChange={setLevelCognitive}
              />
              <TherapyArea
                title={t('setting.Occupational_Therapy')}
                enabled={enabledOt}
                level={levelOt}
                isEditing={isEditing}
                onEnableChange={setEnabledOt}
                onLevelChange={setLevelOt}
              />
              <TherapyArea
                title={t('setting.Speech_Therapy')}
                enabled={enabledSpeech}
                level={levelSpeech}
                isEditing={isEditing}
                onEnableChange={setEnabledSpeech}
                onLevelChange={setLevelSpeech}
              />
              <div>
              <label htmlFor="numOfExercises" className="block text-sm font-medium">
                {t('setting.Number_of_Exercises')}
              </label>
              {isEditing ? (
                <input
                  type="number"
                  id="numOfExercises"
                  value={numOfExercises}
                  onChange={(e) => setNumOfExercises(parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
              ) : (
                <p className="mt-1">{numOfExercises || 3}</p>
              )}
            </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border rounded-md"
              >
                {t('setting.Cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                {t('setting.Save')}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              {t('setting.Edit_Profile')}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
