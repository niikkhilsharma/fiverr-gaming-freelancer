// File: /app/api/admin/create-tournament/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma/prisma'
import { z } from 'zod'
import { auth } from '@/auth'
import { v2 as cloudinary } from 'cloudinary'

type uploadResponse = { secure_url: string } | undefined

// Initialize Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Define validation schema for the request
const tournamentSchema = z.object({
	name: z.string().min(2, { message: 'Tournament name must be at least 2 characters' }),
	description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
	startDate: z.string(),
	startTime: z.string(),
	endDate: z.string(),
	endTime: z.string(),
	prizePool: z.string().transform(val => parseFloat(val) * 100), // Convert to cents for storage
	maxPlayers: z
		.string()
		.optional()
		.transform(val => (val ? parseInt(val) : undefined)),
	streamingUrl: z.string().url().optional().or(z.literal('')),
})

export async function POST(req: NextRequest) {
	try {
		// Authenticate request
		const session = await auth()
		if (!session?.user || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		// Parse form data
		const formData = await req.formData()

		// Extract fields from form data
		const tournamentData = {
			name: formData.get('name') as string,
			description: formData.get('description') as string,
			startDate: formData.get('startDate') as string,
			startTime: formData.get('startTime') as string,
			endDate: formData.get('endDate') as string,
			endTime: formData.get('endTime') as string,
			prizePool: formData.get('prizePool') as string,
			maxPlayers: formData.get('maxPlayers') as string,
			streamingUrl: formData.get('streamingUrl') as string,
		}

		// Validate the tournament data
		const validatedData = tournamentSchema.parse(tournamentData)

		// Process dates and times
		const startDateTime = combineDateTime(validatedData.startDate, validatedData.startTime)
		const endDateTime = combineDateTime(validatedData.endDate, validatedData.endTime)

		// Check if dates are valid
		if (endDateTime <= startDateTime) {
			return NextResponse.json({ error: 'End date and time must be after start date and time' }, { status: 400 })
		}

		// Handle image upload if present
		const imageFile = formData.get('image') as File
		let imageUrl: string | undefined = undefined

		if (imageFile) {
			const arrayBuffer = await imageFile.arrayBuffer()
			const buffer = Buffer.from(arrayBuffer)

			const uploadResponse: uploadResponse = await new Promise((resolve, reject) => {
				cloudinary.uploader
					.upload_stream({ resource_type: 'image' }, (error, result) => {
						if (error) reject(error)
						else resolve(result)
					})
					.end(buffer)
			})

			imageUrl = uploadResponse?.secure_url
		}

		// Create tournament in database
		const tournament = await prisma.tournament.create({
			data: {
				name: validatedData.name,
				description: validatedData.description,
				startDateTime: startDateTime, // Using DateTime objects for both date and time fields
				endDateTime: endDateTime, // Using DateTime objects for both date and time fields
				prizePool: validatedData.prizePool, // Already transformed to cents
				registeredTeamsCount: 0,
				maxTeamCount: validatedData.maxPlayers,
				image: imageUrl!,
				streamingUrl: validatedData.streamingUrl || null,
			},
		})

		return NextResponse.json({
			success: true,
			message: 'Tournament created successfully',
			data: tournament,
		})
	} catch (error) {
		console.error('Error creating tournament:', error)

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					error: 'Validation error',
					details: error.errors,
				},
				{ status: 400 }
			)
		}

		return NextResponse.json(
			{
				error: 'Failed to create tournament',
			},
			{ status: 500 }
		)
	}
}

// Helper function to combine date and time strings into a single Date object
function combineDateTime(dateStr: string, timeStr: string): Date {
	// Parse the date string (which is in ISO format)
	const date = new Date(dateStr)

	// Parse the time string (which is in HH:MM format)
	const [hours, minutes] = timeStr.split(':').map(Number)

	// Set hours and minutes on the date
	date.setHours(hours, minutes, 0, 0)

	return date
}
