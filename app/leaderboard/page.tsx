import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import prisma from '@/lib/prisma/prisma'

// Define interfaces for our data structures
interface LeaderboardEntry {
	id: string
	teamId: string
	tournamentId: string
	teamName: string
	points: number
}

// We no longer need a separate interface for ranked entries
type TournamentGroups = {
	[tournamentId: string]: LeaderboardEntry[]
}

export default async function LeaderboardPage() {
	// Fetch leaderboard entries from database
	const leaderboardEntries: LeaderboardEntry[] = await prisma.leaderboard.findMany({
		orderBy: {
			points: 'desc',
		},
	})

	// Group entries by tournamentId
	const tournamentGroups: TournamentGroups = leaderboardEntries.reduce<TournamentGroups>((groups, entry) => {
		if (!groups[entry.tournamentId]) {
			groups[entry.tournamentId] = []
		}
		groups[entry.tournamentId].push(entry)
		return groups
	}, {})

	// Sort teams within each tournament by points (highest first)
	Object.keys(tournamentGroups).forEach(tournamentId => {
		tournamentGroups[tournamentId].sort((a, b) => b.points - a.points)
	})

	return (
		<div className="container mx-auto py-12 px-4 sm:px-0 md:py-16 lg:py-20">
			<div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
				<div className="space-y-2">
					<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Leaderboard</h1>
					<p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
						Track tournament results and player rankings across all our games.
					</p>
				</div>
			</div>

			<div className="grid gap-8">
				{Object.keys(tournamentGroups).map(tournamentId => (
					<div key={tournamentId} className="space-y-4">
						<h2 className="text-2xl font-bold">Tournament: {tournamentId}</h2>
						<Card className="p-0 overflow-hidden">
							<CardContent className="p-0">
								<div className="overflow-x-auto">
									<table className="w-full">
										{/* Header */}
										<thead>
											<tr className="bg-muted">
												<th className="p-3 text-left font-medium text-sm">S.No</th>
												<th className="p-3 text-left font-medium text-sm">Team</th>
												<th className="p-3 text-center font-medium text-sm hidden md:table-cell">Team ID</th>
												<th className="p-3 text-center font-medium text-sm">Points</th>
											</tr>
										</thead>
										{/* Data Rows */}
										<tbody>
											{tournamentGroups[tournamentId].map((entry, indx) => (
												<tr key={entry.id} className="border-t">
													<td className="p-3 text-sm">{indx + 1}</td>
													<td className="p-3 text-sm">
														<div className="flex items-center gap-2">
															<Avatar className="h-8 w-8">
																<AvatarImage src={entry.teamId || ''} alt="Profile picture" />
																<AvatarFallback>{entry.teamName.substring(0, 2).toUpperCase()}</AvatarFallback>
															</Avatar>
															<span className="hidden sm:inline">{entry.teamName}</span>
														</div>
													</td>
													<td className="p-3 text-sm text-center hidden md:table-cell">{entry.teamId}</td>
													<td className="p-3 text-sm text-center font-medium">{entry.points}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</CardContent>
						</Card>
					</div>
				))}
			</div>
		</div>
	)
}
