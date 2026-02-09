import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

// File path for persistent user storage
const USERS_FILE = join(process.cwd(), 'data', 'users.json');

// Ensure data directory exists
import { mkdirSync } from 'fs';
const dataDir = join(process.cwd(), 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

type User = { id: string; email: string };

// Load users from file or initialize empty array
let users: User[] = [];
let userIdCounter = 1;

function loadUsers() {
  try {
    if (existsSync(USERS_FILE)) {
      const data = readFileSync(USERS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      users = parsed.users || [];
      userIdCounter = parsed.nextId || 1;
      console.log(` Loaded ${users.length} users from storage`);
    } else {
      users = [];
      userIdCounter = 1;
      console.log('No users file found, starting fresh');
    }
  } catch (error) {
    console.error('Error loading users:', error);
    users = [];
    userIdCounter = 1;
  }
}

function saveUsers() {
  try {
    const data = {
      users,
      nextId: userIdCounter
    };
    writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
    console.log(` Saved ${users.length} users to storage`);
  } catch (error) {
    console.error('Error saving users:', error);
  }
}

// Load users on module initialization
loadUsers();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: { email: { label: 'Email', type: 'email' } },
      async authorize(credentials) {
        if (!credentials?.email) throw new Error('Email required');
        const email = credentials.email;
        let user = users.find((u) => u.email === email);
        if (!user) {
          user = { id: String(userIdCounter++), email };
          users.push(user);
          // Save the new user to persistent storage
          saveUsers();
        }
        console.log(' User authorized:', user);
        return { id: user.id, email: user.email };
      },
    }),
  ],
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      console.log(' JWT callback - token:', token);
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      console.log(' Session callback - session:', session);
      return session;
    },
  },
  session: { 
    strategy: 'jwt', 
    maxAge: 30 * 24 * 60 * 60 
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production',
  debug: true, // Enable debug mode
};