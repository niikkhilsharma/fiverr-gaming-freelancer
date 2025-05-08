import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma/prisma'

// This would be your database client in a real application
// For this example, we'll use a simple in-memory store
const leaderboardEntries = [
	{
		id: 'clq1234567',
		teamId: 'team1',
		tournamentId: 'tournament1',
		teamName: 'Alpha Team',
		points: 120,
	},
	{
		id: 'clq2345678',
		teamId: 'team2',
		tournamentId: 'tournament1',
		teamName: 'Beta Squad',
		points: 95,
	},
	{
		id: 'clq3456789',
		teamId: 'team3',
		tournamentId: 'tournament2',
		teamName: 'Gamma Force',
		points: 150,
	},
]

// Validation schema for POST/PUT requests
const leaderboardSchema = z.object({
	teamId: z.string().min(1),
	tournamentId: z.string().min(1),
	teamName: z.string().min(1),
	points: z.number().int().min(0),
})

// PUT request schema (includes id)
const updateLeaderboardSchema = leaderboardSchema.extend({
	id: z.string().min(1),
})

// GET handler - Fetch all leaderboard entries
export async function GET() {
	try {
		const leaderboardEntries = await prisma.leaderboard.findMany()
		console.log(leaderboardEntries)
		return NextResponse.json({ leaderboard: leaderboardEntries })
	} catch (error) {
		console.log(error)
		return NextResponse.json({ message: 'Failed to fetch leaderboard entries' }, { status: 500 })
	}
}

// POST handler - Create a new leaderboard entry
export async function POST(request: NextRequest) {
	try {
		const body = await request.json()

		// Validate request body
		const validatedData = leaderboardSchema.parse(body)

		const newEntry = await prisma.leaderboard.create({
			data: {
				...validatedData,
			},
		})

		return NextResponse.json({ leaderboard: newEntry }, { status: 201 })
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 })
		}

		return NextResponse.json({ message: 'Failed to create leaderboard entry' }, { status: 500 })
	}
}

// PUT handler - Update an existing leaderboard entry
export async function PUT(request: NextRequest) {
	try {
		const body = await request.json()

		// Validate request body
		const validatedData = updateLeaderboardSchema.parse(body)

		// Find the entry to update
		const allLeaderboardEntries = await prisma.leaderboard.findMany()
		const entryIndex = allLeaderboardEntries.findIndex(entry => entry.id === validatedData.id)

		if (entryIndex === -1) {
			return NextResponse.json({ message: 'Leaderboard entry not found' }, { status: 404 })
		}

		// Update the entry
		const updatedLeaderboardEntry = await prisma.leaderboard.update({
			where: { id: validatedData.id },
			data: {
				teamId: validatedData.teamId,
				tournamentId: validatedData.tournamentId,
				teamName: validatedData.teamName,
				points: validatedData.points,
			},
		})

		return NextResponse.json({ leaderboard: updatedLeaderboardEntry })
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 })
		}

		return NextResponse.json({ message: 'Failed to update leaderboard entry' }, { status: 500 })
	}
}

// DELETE handler - Delete a leaderboard entry
export async function DELETE(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const id = searchParams.get('id')

		if (!id) {
			return NextResponse.json({ message: 'ID is required' }, { status: 400 })
		}

		// Find the entry to delete
		const entryIndex = leaderboardEntries.findIndex(entry => entry.id === id)

		if (entryIndex === -1) {
			return NextResponse.json({ message: 'Leaderboard entry not found' }, { status: 404 })
		}

		// Remove the entry
		leaderboardEntries.splice(entryIndex, 1)

		return NextResponse.json({ message: 'Leaderboard entry deleted successfully' })
	} catch (error) {
		console.log(error)
		return NextResponse.json({ message: 'Failed to delete leaderboard entry' }, { status: 500 })
	}
}
