import { TherapyAreaProps } from '@/types/props';
import { Award } from 'lucide-react';
import { useTranslations } from 'next-intl';
export default function TherapyArea({
  title,
  enabled,
  level,
  isEditing,
  onEnableChange,
  onLevelChange,
}: TherapyAreaProps) {
  const t = useTranslations();
  return (
    <div className="flex items-center justify-between rounded-md">
      <div>
        <h3 className={`${enabled ? 'text-darkPurple' : 'text-gray-400'} font-medium`}>{title}</h3>
        {isEditing ? (
          <div className="flex items-center gap-4 mt-2">
            <label className={`${enabled ? '' : 'disabled'} flex items-center`}>
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => onEnableChange(e.target.checked)}
                className="mr-2"
              />
              {t('setting.Enabled')}
            </label>
            {enabled && <div className="flex items-center">
              <Award className="w-4 h-4" />
              <select
                value={level}
                onChange={(e) => onLevelChange(Number(e.target.value))}
                className="rounded-md border-gray-300"
                disabled={!enabled}
              >
                {[1, 2, 3, 4, 5].map((level) => (
                  <option key={level} value={level}>
                    {t('setting.Level')} {level}
                  </option>
                ))}
              </select>
              
            </div>}
          </div>
        ) : (
          <div className={`flex items-center gap-2 ${enabled ? '' : 'disabled'}`}>
            <Award className="w-4 h-4" />
            <p className="mt-1">{`${t('setting.Level')} ${level}`}</p>
          </div>
        )}
      </div>
    </div>
  );
} 