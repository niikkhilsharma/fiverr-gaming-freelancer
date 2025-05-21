import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma/prisma'

const SECRET = process.env.AUTH_SECRET!

export async function POST(request: Request) {
	try {
		const body = await request.json()
		const { token, newPassword } = body

		if (!token || !newPassword) {
			return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 })
		}

		const decoded = jwt.verify(token, SECRET) as { userId: string }

		const hashedPassword = await bcrypt.hash(newPassword, 10)

		await prisma.user.update({
			where: { id: decoded.userId },
			data: { password: hashedPassword },
		})

		return NextResponse.json({ message: 'Password updated successfully' })
	} catch (error) {
		console.error(error)
		return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
	}
}
