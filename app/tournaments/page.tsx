import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays, Clock, Trophy, Users } from 'lucide-react'

export default function TournamentsPage() {
	const tournaments = [
		{
			id: 1,
			title: 'Summer Championship 2023',
			game: 'Fortnite',
			date: 'August 15, 2023',
			time: '6:00 PM EST',
			teams: '32',
			prize: '$1,000',
			status: 'open',
			description:
				'Join our biggest tournament of the summer! Compete against the best players in the community for glory and prizes.',
		},
		{
			id: 2,
			title: 'Weekly Showdown',
			game: 'Valorant',
			date: 'August 10, 2023',
			time: '7:00 PM EST',
			teams: '16',
			prize: '$500',
			status: 'open',
			description: 'Our weekly tournament series featuring intense competition and great prizes.',
		},
		{
			id: 3,
			title: 'Rocket League Cup',
			game: 'Rocket League',
			date: 'August 20, 2023',
			time: '5:00 PM EST',
			teams: '24',
			prize: '$750',
			status: 'open',
			description: 'Show off your aerial skills and teamwork in this exciting Rocket League tournament.',
		},
		{
			id: 4,
			title: 'Spring Invitational',
			game: 'League of Legends',
			date: 'July 25, 2023',
			time: '6:00 PM EST',
			teams: '8',
			prize: '$1,200',
			status: 'closed',
			description: 'Our exclusive invitational tournament featuring the top teams from previous competitions.',
		},
	]

	return (
		<div className="container mx-auto py-12 px-4 sm:px-0 md:py-16 lg:py-20">
			<div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
				<div className="space-y-2">
					<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Tournaments</h1>
					<p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
						Compete in our exciting tournaments and win amazing prizes.
					</p>
				</div>
			</div>

			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{tournaments.map(tournament => (
					<Card key={tournament.id} className={tournament.status === 'closed' ? 'opacity-70' : ''}>
						<div className="relative">
							<Image
								src={'https://picsum.photos/200/300'}
								alt={tournament.game}
								width={400}
								height={200}
								className="w-full object-cover h-48 rounded-t-lg"
							/>
							<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/80 rounded-t-lg"></div>
							<div className="absolute bottom-0 left-0 p-4">
								<span className="px-2 py-1 text-xs font-medium bg-purple-700 text-white rounded-md">{tournament.game}</span>
							</div>
							{tournament.status === 'closed' && (
								<div className="absolute top-2 right-2 px-2 py-1 text-xs font-medium bg-red-600 text-white rounded-md">
									Registration Closed
								</div>
							)}
						</div>
						<CardHeader>
							<CardTitle>{tournament.title}</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center text-sm text-gray-400 mb-4">
								<CalendarDays className="mr-2 h-4 w-4" />
								<span>{tournament.date}</span>
								<Clock className="ml-4 mr-2 h-4 w-4" />
								<span>{tournament.time}</span>
							</div>
							<p className="text-sm text-gray-400 mb-4">{tournament.description}</p>
							<div className="grid grid-cols-2 gap-4 text-sm">
								<div className="flex items-center">
									<Trophy className="mr-2 h-4 w-4 text-purple-600" />
									<span>Prize: {tournament.prize}</span>
								</div>
								<div className="flex items-center">
									<Users className="mr-2 h-4 w-4 text-purple-600" />
									<span>Teams: {tournament.teams}</span>
								</div>
							</div>
						</CardContent>
						<CardFooter>
							{tournament.status === 'open' ? (
								<Link href={`/tournaments/signup?id=${tournament.id}`} className="w-full">
									<Button className="w-full bg-purple-700 hover:bg-purple-800">Register Now</Button>
								</Link>
							) : (
								<Button disabled className="w-full">
									Registration Closed
								</Button>
							)}
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	)
}
