import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import DirectionController from '../components/common/DirectionController';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default async function LocaleLayout({ 
  children, 
  params 
}: LocaleLayoutProps) {
  const { locale } = await params;  // Explicitly await params
  
  // Validate locale early
  if (!locale) notFound();
  
  let messages;
  
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
 
  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <DirectionController>
        {children}
      </DirectionController>
    </NextIntlClientProvider>
  );
}
 
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'he' }];
}