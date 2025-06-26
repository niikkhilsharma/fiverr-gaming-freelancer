import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/prisma'
import { auth } from '@/auth'

export async function POST(request: Request) {
	const session = await auth()
	const user = session?.user

	const body = await request.json()
	const { tournamentId } = body

	const tournament = await prisma.tournament.findUnique({ where: { id: tournamentId } })

	if (!tournament) {
		return NextResponse.json({ error: 'Tournament not found' }, { status: 404 })
	}

	if (!tournament.isRegistrationOpen) {
		return NextResponse.json({ error: 'Registration is closed' }, { status: 400 })
	}

	const team = await prisma.team.findFirst({ where: { tournamentId: tournamentId } })

	if (!team) {
		return NextResponse.json({ error: 'Team not found' }, { status: 404 })
	}

	// checking if the user is already in the team
	if (team.TeamPlayer.includes(user?.id as string)) {
		return NextResponse.json({ error: 'User is already in the team' }, { status: 400 })
	}

	await prisma.team.update({
		where: { id: team.id },
		data: { TeamPlayer: [...team.TeamPlayer, user?.id as string] },
	})

	return NextResponse.json({ success: true })
}
