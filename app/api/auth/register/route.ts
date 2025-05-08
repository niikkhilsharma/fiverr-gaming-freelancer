import { type NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { v2 as cloudinary } from 'cloudinary'
import prisma from '@/lib/prisma/prisma'

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Define schema for validation
const registerSchema = z.object({
	firstName: z.string().min(3),
	lastName: z.string().min(3),
	email: z.string().email(),
	password: z.string().min(8),
	discordUsername: z.string().url().optional().or(z.literal('')),
})

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData()

		// Extract and validate form data
		const data = {
			firstName: formData.get('firstName') as string,
			lastName: formData.get('lastName') as string,
			email: formData.get('email') as string,
			password: formData.get('password') as string,
			discordUsername: (formData.get('discordUsername') as string) || '',
		}

		// Validate data
		const validatedData = registerSchema.parse(data)

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email: validatedData.email },
		})

		if (existingUser) {
			return NextResponse.json({ message: 'User with this email already exists' }, { status: 400 })
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(validatedData.password, 10)

		// Handle profile picture if provided
		const profilePicture = formData.get('profilePicture') as File | null
		let profilePictureUrl = ''

		if (profilePicture) {
			const arrayBuffer = await profilePicture.arrayBuffer()
			const buffer = Buffer.from(arrayBuffer)

			const uploadResponse = await new Promise((resolve, reject) => {
				cloudinary.uploader
					.upload_stream({ resource_type: 'image' }, (error, result) => {
						if (error) reject(error)
						else resolve(result)
					})
					.end(buffer)
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			profilePictureUrl = (uploadResponse as any).secure_url
		}

		// Create user in database
		const user = await prisma.user.create({
			data: {
				role: 'USER',
				firstName: validatedData.firstName,
				lastName: validatedData.lastName,
				email: validatedData.email,
				password: hashedPassword,
				discordUsername: validatedData.discordUsername || null,
				avatarUrl: profilePictureUrl || null,
			},
		})

		// Return success response without exposing sensitive data
		return NextResponse.json(
			{
				message: 'User registered successfully',
				userId: user.id,
			},
			{ status: 201 }
		)
	} catch (error) {
		console.error('Registration error:', error)

		if (error instanceof z.ZodError) {
			return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 })
		}

		return NextResponse.json({ message: 'Failed to register user' }, { status: 500 })
	}
}
