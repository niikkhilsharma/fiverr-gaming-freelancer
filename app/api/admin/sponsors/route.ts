import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/prisma'
import { v2 as cloudinary } from 'cloudinary'
import { z } from 'zod'

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Get all sponsors
export async function GET() {
	try {
		const sponsors = await prisma.sponsors.findMany()
		return NextResponse.json({ sponsors })
	} catch (error) {
		console.log(error)
		return NextResponse.json({ error: 'Failed to fetch sponsors' })
	}
}

const addSponsorSchema = z.object({
	companyName: z.string().min(2),
	description: z.string().min(10),
	logo: z.instanceof(File),
	website: z.string().url().optional().or(z.literal('')),
})

// create a new sponsor
export async function POST(request: Request) {
	try {
		const formData = await request.formData()

		const data = {
			companyName: formData.get('companyName') as string,
			description: formData.get('description') as string,
			logo: formData.get('logo') as File,
			website: formData.get('website') as string,
		}

		const validatedData = addSponsorSchema.parse(data)

		const arrayBuffer = await validatedData.logo.arrayBuffer()
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
		const logoUrl = (uploadResponse as any).secure_url as string

		const dataToCreate: { companyName: string; description: string; logo: string; website?: string } = {
			companyName: validatedData.companyName,
			description: validatedData.description,
			logo: logoUrl,
		}

		if (validatedData.website) {
			dataToCreate.website = validatedData.website
		}

		const sponsor = await prisma.sponsors.create({
			data: {
				...dataToCreate,
			},
		})
		return NextResponse.json({ sponsor })
	} catch (error) {
		console.log(error)
		return NextResponse.json({ error: 'Failed to create sponsor' })
	}
}

// Delete a sponsor
export async function DELETE(request: Request) {
	try {
		const url = request.url

		const myURL = new URL(url)
		const searchParams = new URLSearchParams(myURL.search)

		const id = searchParams.get('id')

		if (!id) {
			return NextResponse.json({ error: 'No id provided' }, { status: 400 })
		}

		// const id = formData.get('id') as string

		const sponsor = await prisma.sponsors.delete({
			where: {
				id,
			},
		})

		return NextResponse.json({ sponsor })
	} catch (error) {
		console.log(error)
		return NextResponse.json({ error: 'Failed to delete sponsor' }, { status: 500 })
	}
}
