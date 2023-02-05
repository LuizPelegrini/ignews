import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { query as q } from 'faunadb';

import { faunaClient } from '@/lib/faunadb';

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      // @ts-ignore
      scope: 'read:user',
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const { email } = user;
      
      try {
        await faunaClient.query(
          q.Create(
            q.Collection('users'),
            {
              data: { email }
            }
          )
        );
  
        return true;
      } catch {
        // Do not login the user if database create operation fails
        return false;
      }
    },
  }
});