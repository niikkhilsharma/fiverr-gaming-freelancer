import { EmailTemplate } from '@/app/email-template'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import z from 'zod'
import prisma from '@/lib/prisma/prisma'
import jwt from 'jsonwebtoken'

const resend = new Resend(process.env.RESEND_API_KEY)
const SECRET = process.env.AUTH_SECRET!

if (!SECRET) throw new Error('Missing AUTH_SECRET env variable')

const schema = z.object({
	email: z.string().email(),
})

export async function POST(request: Request) {
	const body = await request.json()
	const validation = schema.safeParse(body)

	if (!validation.success) {
		return NextResponse.json({ error: validation.error.errors }, { status: 400 })
	}

	const { email } = validation.data
	const user = await prisma.user.findFirst({ where: { email } })

	if (!user) {
		return NextResponse.json({ error: 'Email not found' }, { status: 400 })
	}

	const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '15m' })
	const resetLink = `https://heistgamestournament.com/reset-password?token=${token}&email=${email}`

	try {
		const { data, error } = await resend.emails.send({
			from: 'delivered@resend.dev',
			to: email,
			subject: 'Reset Your Password',
			react: await EmailTemplate({ firstName: user.firstName || 'there', link: resetLink }),
		})

		if (error) {
			console.error(error)
			return NextResponse.json({ error }, { status: 500 })
		}

		return NextResponse.json({ message: 'Reset email sent successfully', data })
	} catch (error) {
		console.error(error)
		return NextResponse.json({ error: 'Server error' }, { status: 500 })
	}
}
