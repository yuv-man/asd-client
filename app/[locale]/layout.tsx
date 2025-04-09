import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import DirectionController from '../components/common/DirectionController';
import AuthProvider from '../providers/AuthProvider';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}


export default async function LocaleLayout({ 
  children, 
  params 
}: LocaleLayoutProps) {
  const { locale } = await params; 
  
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
        <AuthProvider requireAuth={true}>
          {children}
        </AuthProvider> 
      </DirectionController>
    </NextIntlClientProvider>
  );
}
 
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'he' }];
}