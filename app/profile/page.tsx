import MaxWidthWrapper from '@/components/max-width-wrapper'
import { auth } from '@/auth'
import prisma from '@/lib/prisma/prisma'
import TournamentCard from '@/components/tournament-card'

export default async function ProfilePage() {
	const session = await auth()
	const user = session?.user

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
		<MaxWidthWrapper className="flex-1">
			<div>
				<h1 className="text-xl sm:text-3xl">My Tournaments</h1>
				<p className="text-gray-300">Here are all the tournaments you have registered for.</p>
				<div className="mt-4">
					{myTournaments.length > 0 ? (
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{myTournaments.map(tournament => (
								<TournamentCard alreadyRegistered={true} key={tournament.id} tournament={tournament} />
							))}
						</div>
					) : (
						<p>No registrations found.</p>
					)}
				</div>
			</div>
		</MaxWidthWrapper>
	)
}
