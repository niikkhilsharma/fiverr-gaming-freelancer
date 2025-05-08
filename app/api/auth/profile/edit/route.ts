import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma/prisma'
import { auth } from '@/auth'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

type uploadResponse = { secure_url: string } | undefined

// Define schema for validation
const updateProfileSchema = z.object({
	firstName: z.string().min(2),
	lastName: z.string().min(2),
	discordUsername: z.string().optional(),
})

export async function PUT(request: NextRequest) {
	try {
		// Check if user is authenticated
		const session = await auth()
		if (!session?.user) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
		}

		const formData = await request.formData()

		// Extract and validate form data
		const data: z.TypeOf<typeof updateProfileSchema> = {
			firstName: formData.get('firstName') as string,
			lastName: formData.get('lastName') as string,
		}

		if (formData.get('discordUsername')) {
			data.discordUsername = formData.get('discordUsername') as string
		}

		// Validate data
		const validatedData = updateProfileSchema.parse(data)

		// Handle profile picture if provided
		const profilePicture = formData.get('profilePicture') as File | null
		let profilePictureUrl: string | undefined = undefined

		if (profilePicture) {
			const arrayBuffer = await profilePicture.arrayBuffer()
			const buffer = Buffer.from(arrayBuffer)

			const uploadResponse: uploadResponse = await new Promise((resolve, reject) => {
				cloudinary.uploader
					.upload_stream({ resource_type: 'image' }, (error, result) => {
						if (error) reject(error)
						else resolve(result)
					})
					.end(buffer)
			})

			profilePictureUrl = uploadResponse?.secure_url
		}

		// Prepare update data
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const updateData: any = {
			firstName: validatedData.firstName,
			lastName: validatedData.lastName,
			discordUsername: validatedData.discordUsername || null,
		}

		// Only update profile picture if provided
		if (profilePictureUrl) {
			updateData.avatarUrl = profilePictureUrl
		}

		// Update user in database
		const user = await prisma.user.update({
			where: { id: session.user.id },
			data: updateData,
		})

		// Return success response without exposing sensitive data
		return NextResponse.json(
			{
				message: 'Profile updated successfully',
				userId: user.id,
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error('Profile update error:', error)

		if (error instanceof z.ZodError) {
			return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 })
		}

		return NextResponse.json({ message: 'Failed to update profile' }, { status: 500 })
	}
}
