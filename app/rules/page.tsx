import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'

export default function RulesPage() {
	return (
		<div className="container mx-auto py-8 px-4 max-w-4xl">
			<div className="space-y-6">
				<div className="text-center space-y-2">
					<h1 className="text-4xl font-bold tracking-tight">Tournament Rules</h1>
					<p className="text-muted-foreground">THE FINALS Tournament - Official Rules and Guidelines</p>
				</div>

				<Separator className="my-6" />

				<Card>
					<CardContent className="pt-6">
						<h2 className="text-2xl font-bold mb-4">1. General Information</h2>
						<ul className="list-disc pl-6 space-y-2">
							<li>
								<span className="font-medium">Format:</span> 3v3v3v3 (Four teams per match), Finals are 3v3 head-to-head
							</li>
							<li>
								<span className="font-medium">Platform:</span> Mixed (PC and console)
							</li>
							<li>
								<span className="font-medium">Game:</span> THE FINALS
							</li>
							<li>
								<span className="font-medium">Entry Fee:</span> $10 per person ($30 per team)
							</li>
							<li>
								<span className="font-medium">Check-In:</span> Teams must check in 30 minutes before their first match
							</li>
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<h2 className="text-2xl font-bold mb-4">2. Player Eligibility</h2>
						<ul className="list-disc pl-6 space-y-2">
							<li>All players must be at least 16 years old</li>
							<li>Must have a valid THE FINALS account and access to Discord</li>
							<li>Rosters are locked at the start of the tournament—no substitutions mid-event unless approved</li>
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<h2 className="text-2xl font-bold mb-4">3. Team Structure</h2>
						<ul className="list-disc pl-6 space-y-2">
							<li>Each team must consist of 3 core players</li>
							<li>An optional 1 substitute is allowed but must be declared before the tournament starts</li>
							<li>No player may be on more than one roster</li>
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<h2 className="text-2xl font-bold mb-4">4. Match Format</h2>
						<ul className="list-disc pl-6 space-y-2">
							<li>Matches are played in 3v3v3v3 (4 teams per match) using the standard Cashout format</li>
							<li>All matches until the finals are Best of 1</li>
							<li>Finals will be a 3v3 head-to-head, Best of 3</li>
							<li>Maps will be randomly selected from the official rotation</li>
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<h2 className="text-2xl font-bold mb-4">5. Match Rules</h2>
						<ul className="list-disc pl-6 space-y-2">
							<li>Teams must enter the private lobby within 5 minutes of being pinged</li>
							<li>Failure to appear within 10 minutes results in a forfeit</li>
							<li>Cheating, glitch abuse, macros, or third-party tools are strictly prohibited</li>
							<li>Match results must be submitted via screenshot by both team captains</li>
							<li>
								It is encouraged (but not required) for at least one player per team to record gameplay and comms audio for
								promotional use and potential dispute resolution
							</li>
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<h2 className="text-2xl font-bold mb-4">6. Conduct & Fair Play</h2>
						<ul className="list-disc pl-6 space-y-2">
							<li>Toxic behavior, hate speech, slurs, or harassment will result in immediate disqualification</li>
							<li>No stream sniping, win trading, or collusion of any kind</li>
							<li>Players must respect admins, referees, and opponents—this is a community-first event</li>
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<h2 className="text-2xl font-bold mb-4">7. Disputes</h2>
						<ul className="list-disc pl-6 space-y-2">
							<li>All disputes must be submitted via Discord with accompanying video/screenshot proof</li>
							<li>Final rulings will be made by the admin team</li>
							<li>Decisions made by tournament officials are final</li>
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<h2 className="text-2xl font-bold mb-4">8. Prizing</h2>
						<ul className="list-disc pl-6 space-y-2">
							<li>Prizes will be distributed to team captains via Cash App or by mailed check</li>
							<li>Processing of payouts may take up to 3–5 business days after verification</li>
							<li>Sponsored prizes (if any) may be shipped or emailed</li>
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<h2 className="text-2xl font-bold mb-4">9. Streaming & Content</h2>
						<ul className="list-disc pl-6 space-y-2">
							<li>Players are welcome to stream their POVs but must use at least a 60-second delay</li>
							<li>The Heist Games reserves the right to record and broadcast matches</li>
							<li>Recorded content may be used in promotional materials for future tournaments</li>
						</ul>
					</CardContent>
				</Card>

				<div className="text-center text-sm text-muted-foreground mt-8">
					<p>Last updated: May 9, 2025</p>
				</div>
			</div>
		</div>
	)
}
