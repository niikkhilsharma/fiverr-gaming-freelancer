import MaxWidthWrapper from '@/components/max-width-wrapper'
import { auth } from '@/auth'
import prisma from '@/lib/prisma/prisma'
import TournamentCard from '@/components/tournament-card'

export default async function ProfilePage() {
	const session = await auth()
	const user = session?.user

	// Get all registrations for teams where the user is a member, including team and tournament data
	const myRegistrations = await prisma.registration.findMany({
		where: {
			team: {
				TeamPlayer: { hasSome: [user?.id || ''] },
			},
		},
		include: {
			team: true,
			tournament: true,
		},
	})

	// Create a map for easy lookup of team by tournament ID
	const teamByTournamentId = new Map()
	myRegistrations.forEach(registration => {
		teamByTournamentId.set(registration.tournament.id, registration.team)
	})

	// Extract tournaments from registrations
	const myTournaments = myRegistrations.map(registration => registration.tournament)

	return (
		<MaxWidthWrapper className="flex-1">
			<div>
				<h1 className="text-xl sm:text-3xl">My Tournaments</h1>
				<p className="text-gray-300">Here are all the tournaments you have registered for.</p>
				<div className="mt-4">
					{myTournaments.length > 0 ?
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{myTournaments.map(tournament => (
								<TournamentCard
									myTeam={teamByTournamentId.get(tournament.id)}
									isAdmin={false}
									alreadyRegistered={true}
									key={tournament.id}
									tournament={tournament}
								/>
							))}
						</div>
					:	<p>No registrations found.</p>}
				</div>
			</div>
		</MaxWidthWrapper>
	)
}
