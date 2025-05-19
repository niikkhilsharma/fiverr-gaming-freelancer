import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Leaderboard } from '@prisma/client'

export default function LatestScores({ latestTournamentLeaderboard }: { latestTournamentLeaderboard: Leaderboard[] }) {
	return (
		<Card className="bg-[#a50000]/30">
			<CardHeader>
				<CardTitle>Tournament Results</CardTitle>
			</CardHeader>
			<CardContent>
				<div>
					<div className="rounded-md border">
						<div className="grid grid-cols-9 bg-muted p-3 font-medium">
							<div className="col-span-1 text-center">S.no</div>
							<div className="col-span-6">Team</div>
							<div className="col-span-2 text-center">Score</div>
						</div>
						{latestTournamentLeaderboard.map((tournament, indx) => (
							<div key={tournament.id} className="grid grid-cols-9 p-3 border-t">
								<div className="col-span-1 text-center font-medium">{indx + 1}</div>
								<div className="col-span-6 flex items-center">
									<div className="w-8 h-8 rounded-full bg-gray-200 mr-2 flex items-center justify-center text-xs font-bold">
										{tournament.teamId.substring(0, 2)}
									</div>
									{tournament.teamId}
								</div>
								<div className="col-span-2 text-center">{tournament.points}</div>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
