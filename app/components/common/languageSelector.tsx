import useLanguageStore from '@/store/languageStore';
import { useTranslations } from 'next-intl';
import { useUserStore } from '@/store/userStore';
import { userAPI } from '@/services/api';
import { Listbox } from '@headlessui/react';
import { HiChevronUpDown } from "react-icons/hi2";
import { useRouter, usePathname } from 'next/navigation';


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
      <div className="relative w-[180px]">
        <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-purple-500 py-2 pl-3 pr-10 text-left border focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2">
          <span className="block truncate ">
            {languages.find(lang => lang.value === locale)?.label || 'Select language'}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <HiChevronUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none">
          {languages.map((lang) => (
            <Listbox.Option
              key={lang.value}
              value={lang.value}
              className={({ active }) =>
                `relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                  active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                }`
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
