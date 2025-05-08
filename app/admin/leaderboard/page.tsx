import LeaderboardManagement from './leaderboard'
import prisma from '@/lib/prisma/prisma'

export default async function LeaderboardManagementPage() {
	const allTournaments = await prisma.tournament.findMany()
	const allTeams = await prisma.team.findMany()
	return <LeaderboardManagement allTournaments={allTournaments} allTeams={allTeams} />
}
