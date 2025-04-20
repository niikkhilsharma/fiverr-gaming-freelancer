import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function ScoreboardPage() {
	const teamRankings = {
		fortnite: [
			{ rank: 1, team: 'Team Alpha', points: 3250, wins: 12, logo: '/placeholder.svg?height=40&width=40&text=TA' },
			{ rank: 2, team: 'Omega Squad', points: 2980, wins: 10, logo: '/placeholder.svg?height=40&width=40&text=OS' },
			{ rank: 3, team: 'Victory Royale', points: 2750, wins: 8, logo: '/placeholder.svg?height=40&width=40&text=VR' },
			{ rank: 4, team: 'Storm Chasers', points: 2520, wins: 7, logo: '/placeholder.svg?height=40&width=40&text=SC' },
			{ rank: 5, team: 'Build Masters', points: 2340, wins: 6, logo: '/placeholder.svg?height=40&width=40&text=BM' },
		],
	}

	return (
		<div className="container mx-auto py-12 px-4 sm:px-0 md:py-16 lg:py-20 ">
			<div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
				<div className="space-y-2">
					<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Scoreboard</h1>
					<p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
						Track tournament results and player rankings across all our games.
					</p>
				</div>
			</div>

			<div className="grid gap-8">
				<Card>
					<CardHeader>
						<CardTitle>Leaderboards</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="mb-4">
							<Button variant={'outline'}>Game: Fortnite</Button>
						</div>

						<Tabs defaultValue="teams">
							<TabsList className="w-full mb-6">
								<TabsTrigger value="teams">Team Rankings</TabsTrigger>
							</TabsList>

							<TabsContent value="teams">
								<div className="rounded-md border">
									<div className="grid grid-cols-12 bg-muted p-3 font-medium">
										<div className="col-span-1 text-center">#</div>
										<div className="col-span-5">Team</div>
										<div className="col-span-3 text-center">Wins</div>
										<div className="col-span-3 text-center">Points</div>
									</div>

									{teamRankings.fortnite.map(team => (
										<div key={team.rank} className="grid grid-cols-12 p-3 border-t">
											<div className="col-span-1 text-center font-medium">{team.rank}</div>
											<div className="col-span-5 flex items-center">
												<Image
													src={team.logo || 'https://picsum.photos/200/300'}
													alt={team.team}
													width={32}
													height={32}
													className="rounded-full mr-2"
												/>
												<span>{team.team}</span>
											</div>
											<div className="col-span-3 text-center">{team.wins}</div>
											<div className="col-span-3 text-center font-medium">{team.points}</div>
										</div>
									))}
								</div>
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
