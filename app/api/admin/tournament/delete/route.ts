import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma/prisma'

export async function POST(request: NextRequest) {
	const tournamentId = await request.json()
	if (!tournamentId) {
		return new Response('Tournament ID is required', { status: 400 })
	}

	try {
		// Delete the tournament
		const deletedTournament = await prisma.tournament.delete({
			where: { id: tournamentId },
		})

		if (!deletedTournament) {
			return NextResponse.json({ error: 'Tournament not found' }, { status: 404 })
		}

		return NextResponse.json({ message: 'Tournament deleted successfully' }, { status: 200 })
	} catch (error) {
		console.error('Error deleting tournament:', error)
		return NextResponse.json({ error: 'Failed to delete tournament' }, { status: 500 })
	}
}
