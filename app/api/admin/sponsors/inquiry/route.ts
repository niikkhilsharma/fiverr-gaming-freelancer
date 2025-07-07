import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/prisma'
import { z } from 'zod'

const sponsorInquirySchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.string().email(),
	companyName: z.string().min(1, 'Company name is required'),
	message: z.string().min(1, 'Message is required'),
})

export async function POST(request: Request) {
	const body = await request.json()

	try {
		const validatedData = sponsorInquirySchema.parse(body)
		const { name, email, companyName, message } = validatedData

		const inquiry = await prisma.becomeSponsor.create({
			data: { email, name, companyName, message },
		})

		console.log(inquiry)

		return NextResponse.json({ message: 'Inquiry submitted successfully' })
	} catch (error) {
		console.log(error)
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 })
		}

		return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
	}
}
