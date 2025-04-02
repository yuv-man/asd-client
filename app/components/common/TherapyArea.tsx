import { TherapyAreaProps } from '@/types/props';
import { Award } from 'lucide-react';
import { useTranslations } from 'next-intl';
import '@/app/styles/TherapyArea.scss';

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
    <div className="therapy-area">
      <div>
        <h3 className={enabled ? 'title-enabled' : 'title-disabled'}>{title}</h3>
        {isEditing ? (
          <div className="edit-controls">
            <label className={`enable-checkbox ${!enabled ? 'disabled' : ''}`}>
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => onEnableChange(e.target.checked)}
              />
              {t('setting.enabled')}
            </label>
            {enabled && <div className="level-selector">
              <Award className="award-icon" />
              <select
                value={level}
                onChange={(e) => onLevelChange(Number(e.target.value))}
                disabled={!enabled}
              >
                {[1, 2, 3, 4, 5].map((level) => (
                  <option key={level} value={level}>
                    {t('setting.level')} {level}
                  </option>
                ))}
              </select>
            </div>}
          </div>
        ) : (
          <div className={`level-display ${!enabled ? 'disabled' : ''}`}>
            <Award className="award-icon" />
            <p>{`${t('setting.level')} ${level}`}</p>
          </div>
        )}
      </div>
    </div>
  );
} 