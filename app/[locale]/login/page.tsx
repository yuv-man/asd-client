import Login from '../../components/login/Login';

export const dynamic = 'force-dynamic';

export default async function LoginPage({ 
  params,
  searchParams 
}: { 
  params: { locale: string },
  searchParams: { step?: string }
}) {
  const { step } = await searchParams; 
  return <Login stepProp={step} />;
}