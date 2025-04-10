import NextAuth from 'next-auth';
import { authOptions } from './auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
export const HEAD = handler.HEAD;
export const OPTIONS = handler.OPTIONS;