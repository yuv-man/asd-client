import useLanguageStore from '@/store/languageStore';
import { useTranslations } from 'next-intl';
import { useUserStore } from '@/store/userStore';
import { userAPI } from '@/lib/api';
import { Listbox } from '@headlessui/react';
import { HiChevronUpDown } from "react-icons/hi2";
import { useRouter, usePathname } from 'next/navigation';
import '@/app/styles/languageSelector.scss';


export function LanguageSelector() {
  const t = useTranslations();
  const { locale, changeLanguage } = useLanguageStore();
  const { user } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();
  const languages = [
    { value: 'en', label: t('setting.English') },
    { value: 'he', label: t('setting.Hebrew') },
  ];

  const handleLanguageChange = async (value: string) => {
    changeLanguage(value, user?._id || "", router, pathname);
  };

  return (
    <Listbox value={locale} onChange={handleLanguageChange}>
      <div className="language-selector">
        <Listbox.Button className="language-selector__button">
          <span className="language-selector__label">
            {languages.find(lang => lang.value === locale)?.label || 'Select language'}
          </span>
          <span className="language-selector__icon">
            <HiChevronUpDown aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Listbox.Options className="language-selector__options">
          {languages.map((lang) => (
            <Listbox.Option
              key={lang.value}
              value={lang.value}
              className={({ active }) =>
                `language-selector__option ${active ? 'language-selector__option--active' : ''}`
              }
            >
              {lang.label}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}
