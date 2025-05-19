import MaxWidthWrapper from '@/components/max-width-wrapper'
import TournamentCard from '@/components/tournament-card'
import prisma from '@/lib/prisma/prisma'

export default async function AdminDashboard() {
	const allTournaments = await prisma.tournament.findMany()

	return (
		<MaxWidthWrapper className="flex-1">
			<h1 className="text-xl sm:text-3xl text-center font-bold mb-10">Dashboard</h1>

			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{allTournaments.map(tournament => {
					return <TournamentCard key={tournament.id} tournament={tournament} alreadyRegistered={false} isAdmin={true} />
				})}
			</div>
		</MaxWidthWrapper>
	)
}
