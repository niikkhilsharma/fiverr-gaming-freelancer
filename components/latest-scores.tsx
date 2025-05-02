import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LatestScores() {
	const tournaments = [
		{
			id: 'THE FINALS',
			name: 'THE FINALS',
			results: [
				{ rank: 1, team: 'Team Alpha', score: 89, prize: '$500' },
				{ rank: 2, team: 'Omega Squad', score: 76, prize: '$250' },
				{ rank: 3, team: 'Victory Royale', score: 65, prize: '$100' },
				{ rank: 4, team: 'Storm Chasers', score: 54, prize: '$50' },
			],
		},
	]

	return (
		<Card>
			<CardHeader>
				<CardTitle>Tournament Results</CardTitle>
			</CardHeader>
			<CardContent>
				{tournaments.map(tournament => (
					<div key={tournament.id}>
						<div className="rounded-md border">
							<div className="grid grid-cols-12 bg-muted p-3 font-medium">
								<div className="col-span-1 text-center">S.no</div>
								<div className="col-span-6">Team</div>
								<div className="col-span-2 text-center">Score</div>
								<div className="col-span-3 text-center">Prize</div>
							</div>

							{tournament.results.map(result => (
								<div key={result.rank} className="grid grid-cols-12 p-3 border-t">
									<div className="col-span-1 text-center font-medium">{result.rank}</div>
									<div className="col-span-6 flex items-center">
										<div className="w-8 h-8 rounded-full bg-gray-200 mr-2 flex items-center justify-center text-xs font-bold">
											{result.team.substring(0, 2)}
										</div>
										{result.team}
									</div>
									<div className="col-span-2 text-center">{result.score}</div>
									<div className="col-span-3 text-center font-medium text-green-500">{result.prize}</div>
								</div>
							))}
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	)
}
