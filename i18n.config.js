import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  try {
    const activeLocale = locale || 'en'; // Fallback to 'en' if locale is undefined
    return {
      locale: activeLocale,
      messages: (await import(`./messages/${activeLocale}.json`)).default
    };
  } catch (error) {
    console.error(`Failed to load messages for locale "${locale}":`, error);
    // Fallback to empty messages object to prevent complete app failure
    return { 
      locale: 'en',
      messages: {} 
    };
  }
});