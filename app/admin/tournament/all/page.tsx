import prisma from '@/lib/prisma/prisma'
import AdminTournamentCard from '@/components/tournament-card-admin'

export default async function AllTournamentsPage() {
	const allTournaments = await prisma.tournament.findMany({
		orderBy: {
			createdAt: 'desc',
		},
	})

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">All Tournaments</h1>
			<p className="text-gray-600">This page will list all tournaments.</p>
			{/* Add your tournament listing logic here */}

			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{allTournaments.map(tournament => (
					<AdminTournamentCard key={tournament.id} tournament={tournament} isAdmin={true} />
				))}
			</div>
		</div>
	)
}
