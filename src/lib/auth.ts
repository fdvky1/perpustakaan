import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { NextAuthOptions, getServerSession } from 'next-auth';
import { compare } from 'bcrypt';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/db';

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
              username: {},
              password: {},
              email: {},
              address: {}
            },
            async authorize(credentials, req) {
              const user = await prisma.user.findUnique({
                where: {
                    email: credentials!.email
                },
              });
              if (user) {
                const isCorrect = await compare(credentials!.password, user.password);
                if (isCorrect) return {
                    id: user.id,
                    email: user.email
                }
              }
              return null;
            },
          }),
    ],
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/sign-in'
    },
    secret: process.env.NEXTAUTH_SECRET!,
    callbacks: {
        async jwt({ token, user}){
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },
        async session({ token, session }){
            if (session.user){
                // session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
            }
            return session;
        },
        redirect(){
            return '/';
        }
    }
}

export const getAuthSession = () => getServerSession(authOptions);