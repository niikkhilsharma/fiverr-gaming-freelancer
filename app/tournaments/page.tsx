import prisma from '@/lib/prisma/prisma'
import TournamentCard from '@/components/tournament-card'
import { auth } from '@/auth'

export default async function TournamentsPage() {
	const session = await auth()
	const user = session?.user

	const allTournaments = await prisma.tournament.findMany()

	const myTeams = await prisma.team.findMany({
		where: { captainEmail: user?.email },
	})

	const myAllRegistrations = await prisma.registration.findMany({
		where: {
			teamId: { in: myTeams.map(team => team.id) },
		},
	})

	const myTournaments = await prisma.tournament.findMany({
		where: {
			id: { in: myAllRegistrations.map(registration => registration.tournamentId) },
		},
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
				{allTournaments.map(tournament => (
					<TournamentCard
						key={tournament.id}
						tournament={tournament}
						alreadyRegistered={myTournaments.some(myTournament => myTournament.id === tournament.id)}
					/>
				))}
			</div>
		</div>
	)
}
