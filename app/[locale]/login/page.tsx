import Login from '@/app/components/login/Login';

export const dynamic = 'force-dynamic';

export default async function LoginPage({ 
  params,
}: { 
  params: Promise<{ locale: string }>
}) { 
  return <Login />;
}