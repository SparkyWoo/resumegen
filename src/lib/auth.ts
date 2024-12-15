import { NextAuthOptions } from 'next-auth';
import LinkedInProvider from 'next-auth/providers/linkedin';

export const authOptions: NextAuthOptions = {
  providers: [
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: {
        url: 'https://www.linkedin.com/oauth/v2/authorization',
        params: {
          scope: 'r_liteprofile r_emailaddress',
          response_type: 'code',
        }
      },
      token: {
        url: 'https://www.linkedin.com/oauth/v2/accessToken',
      },
      userinfo: {
        url: 'https://api.linkedin.com/v2/me',
        params: { projection: '(id,localizedFirstName,localizedLastName,profilePicture(displayImage~:playableStreams))' }
      },
      async profile(profile, tokens) {
        // Get email address from separate endpoint
        const emailRes = await fetch(
          'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
          {
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
            },
          }
        );
        const emailData = await emailRes.json();
        const email = emailData.elements?.[0]?.['handle~']?.emailAddress;

        return {
          id: profile.id,
          name: `${profile.localizedFirstName} ${profile.localizedLastName}`,
          email: email,
          image: profile.profilePicture?.['displayImage~']?.elements?.[0]?.identifiers?.[0]?.identifier || null,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    }
  },
}; 