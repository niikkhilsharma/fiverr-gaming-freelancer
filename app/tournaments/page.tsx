import prisma from '@/lib/prisma/prisma'
import TournamentCard from '@/components/tournament-card'
import { auth } from '@/auth'

export default async function TournamentsPage() {
	const session = await auth()
	const user = session?.user

	if (!user) {
		return <p className="text-center mt-20">You need to be logged in to view tournaments.</p>
	}

	// Fetch all tournaments
	const allTournaments = await prisma.tournament.findMany()

	// Fetch teams where the current user is a player
	const myTeams = await prisma.team.findMany({
		where: { TeamPlayer: { hasSome: [user.id || ''] } },
	})

	// Fetch registrations of those teams
	const myAllRegistrations = await prisma.registration.findMany({
		where: {
			teamId: { in: myTeams.map(team => team.id) },
		},
	})

	// Create a map of tournamentId => teamId
	const tournamentToTeamMap = new Map<string, string>()
	myAllRegistrations.forEach(reg => {
		tournamentToTeamMap.set(reg.tournamentId, reg.teamId)
	})

	return (
		<div className="container mx-auto py-12 px-4 sm:px-0 md:py-16 lg:py-20">
			<div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
				<div className="space-y-2">
					<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Tournaments</h1>
					<p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
						Compete in our exciting tournaments and win amazing prizes.
					</p>
				</div>
			</div>

			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{allTournaments.map(tournament => {
					const teamId = tournamentToTeamMap.get(tournament.id)
					const myTeam = myTeams.find(team => team.id === teamId)
					const alreadyRegistered = !!myTeam

					return (
						<TournamentCard key={tournament.id} tournament={tournament} alreadyRegistered={alreadyRegistered} myTeam={myTeam} />
					)
				})}
			</div>
		</div>
	)
}
