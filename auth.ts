import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'

import prisma from '@/lib/prisma/prisma'
import authConfig from '@/auth.config'

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: PrismaAdapter(prisma),
	...authConfig,
	trustHost: true,
	secret: process.env.AUTH_SECRET,
	session: {
		strategy: 'jwt',
	},
	pages: { signIn: '/signup' },
})
