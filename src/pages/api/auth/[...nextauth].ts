import NextAuth, { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { query as q } from 'faunadb';

import { faunaClient } from '@/lib/faunadb';

export const authOptions: NextAuthOptions = {
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
      
      try {
        // await faunaClient.query(
        //   q.If(
        //     q.Exists(
        //       q.Match(
        //         q.Index('user_by_email'),
        //         q.Casefold(user.email!)
        //       )
        //     ),
        //     q.Get(
        //       q.Match(
        //         q.Index('user_by_email'),
        //         q.Casefold(user.email!)
        //       )
        //     ),
        //     q.Create(
        //       q.Collection('users'),
        //       {
        //         data: { email: user.email! }
        //       }
        //     )
        //   ),
        // );
  
        return true;
      } catch {
        // Do not login the user if database create operation fails
        return false;
      }
    },
  }
};

export default NextAuth(authOptions);