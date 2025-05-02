import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function LeaderboardPage() {
	const teamRankings = {
		'THE FINALS': [
			{ rank: 1, team: 'Team Alpha', points: 3250, wins: 12, logo: 'https://picsum.photos/200/300' },
			{ rank: 2, team: 'Omega Squad', points: 2980, wins: 10, logo: 'https://picsum.photos/200/300' },
			{ rank: 3, team: 'Victory Royale', points: 2750, wins: 8, logo: 'https://picsum.photos/200/300' },
			{ rank: 4, team: 'Storm Chasers', points: 2520, wins: 7, logo: 'https://picsum.photos/200/300' },
			{ rank: 5, team: 'Build Masters', points: 2340, wins: 6, logo: 'https://picsum.photos/200/300' },
		],
	}

	return (
		<div className="container mx-auto py-12 px-4 sm:px-0 md:py-16 lg:py-20 ">
			<div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
				<div className="space-y-2">
					<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Leaderboard</h1>
					<p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
						Track tournament results and player rankings across all our games.
					</p>
				</div>
			</div>

			<div className="grid gap-8">
				<Card className="p-0 overflow-hidden">
					<CardContent className="p-0">
						<div className="grid grid-cols-12 bg-muted p-3 font-medium">
							<div className="col-span-1 text-center">S.no</div>
							<div className="col-span-5">Team</div>
							<div className="col-span-3 text-center">Wins</div>
							<div className="col-span-3 text-center">Points</div>
						</div>

						{teamRankings['THE FINALS'].map(team => (
							<div key={team.rank} className="grid grid-cols-12 p-3 border-t">
								<div className="col-span-1 text-center font-medium">{team.rank}</div>
								<div className="col-span-5 flex gap-2 items-center">
									<Avatar>
										<AvatarImage src={team.logo} alt={team.team} />
										<AvatarFallback>CN</AvatarFallback>
									</Avatar>
									<span>{team.team}</span>
								</div>
								<div className="col-span-3 text-center">{team.wins}</div>
								<div className="col-span-3 text-center font-medium">{team.points}</div>
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
