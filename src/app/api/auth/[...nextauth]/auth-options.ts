import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      username?: string | null;
      firstname?: string | null;
      lastname?: string | null;
      role?: string | null;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    username?: string | null;
    firstname?: string | null;
    lastname?: string | null;
    role?: string | null;
  }
}

// Extend JWT type
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    username?: string | null;
    firstname?: string | null;
    lastname?: string | null;
    role?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null;
        }

        if (!user.password) {
          return null;
        }

        // Compare the provided password with the stored hash
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );
        
        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstname} ${user.lastname}`,
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.username = token.username;
        session.user.firstname = token.firstname;
        session.user.lastname = token.lastname;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
