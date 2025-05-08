import prisma from '@/lib/prisma/prisma'
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	const session = await auth()
	const user = session?.user

	const { tournamentId, teamName } = await request.json()

	const tournament = await prisma.tournament.findUnique({ where: { id: tournamentId } })

	if (!tournament) {
		return NextResponse.json({ error: 'Tournament not found' }, { status: 404 })
	}

	const team = await prisma.team.create({ data: { teamName, captainEmail: user?.email as string, tournamentId } })
	const registration = await prisma.registration.create({ data: { teamId: team.id, tournamentId } })
	const updatedTournament = await prisma.tournament.update({
		where: { id: tournamentId },
		data: { registeredTeamsCount: tournament.registeredTeamsCount + 1 },
	})

	console.log(team, registration, updatedTournament)

	return NextResponse.json({ success: true })
}
