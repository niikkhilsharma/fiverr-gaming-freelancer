import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { MessageSquare, Trophy, Medal, Users } from 'lucide-react'
import FeaturedTournament from '@/components/featured-tournament'
import SocialLinks from '@/components/social-links'
import LatestScores from '@/components/latest-scores'
import prisma from '@/lib/prisma/prisma'

export default async function Home() {
	const upcomingTournaments = await prisma.tournament.findMany({
		where: {
			endDateTime: {
				gt: new Date(),
			},
		},
		orderBy: {
			endDateTime: 'asc',
		},
		take: 1,
	})

	const latestTournament = await prisma.tournament.findFirst({
		where: { endDateTime: { gt: new Date() } },
		orderBy: { endDateTime: 'asc' },
	})

	const latestTournamentResult = await prisma.leaderboard.findMany({
		where: { tournamentId: latestTournament?.id },
		orderBy: { points: 'desc' },
	})

	const sponsors = await prisma.sponsors.findMany()

	return (
		<div className="flex flex-col min-h-screen bg-background">
			{/* Hero Section */}
			<section className="relative w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-[#a50000] to-[#edab3b] text-white">
				<div className="container px-4 md:px-6 mx-auto">
					<div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
						<div className="flex flex-col justify-center space-y-4">
							<div className="space-y-2">
								<h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">Welcome to HeistGames</h1>
								<p className="max-w-[600px] text-gray-200 md:text-xl">
									Join our thriving gaming community. Compete in tournaments, connect with fellow gamers, and level up your gaming
									experience.
								</p>
							</div>
							<div className="flex flex-col gap-2 min-[400px]:flex-row">
								<Link href="/tournaments">
									<Button size="lg" className="bg-[#e59e3b] hover:bg-[#e59e3b]/90 text-black">
										<Trophy className="mr-2 h-4 w-4" />
										Join Tournaments
									</Button>
								</Link>
							</div>
							<SocialLinks />
						</div>
						<Image
							src="https://picsum.photos/200/300"
							width={500}
							height={400}
							alt="Gaming Community"
							className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
							priority
						/>
					</div>
				</div>
			</section>

			{/* Featured Tournament */}
			<section className="w-full py-12 md:py-16 lg:py-20">
				<div className="container px-4 md:px-6 mx-auto">
					<div className="flex flex-col items-center justify-center space-y-4 text-center">
						<div className="space-y-2">
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Upcoming Tournament</h2>
							<p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
								Register now for our next big tournament and compete for amazing prizes.
							</p>
						</div>
					</div>
					{upcomingTournaments.length > 0 ? (
						<div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
							<FeaturedTournament tournament={upcomingTournaments[0]} />
							<div className="flex flex-col justify-center space-y-4">
								<ul className="grid gap-3">
									<li className="flex items-center gap-2">
										<Trophy className="h-5 w-5 text-primary" />
										<span>${upcomingTournaments[0].prizePool.toLocaleString()} Prize Pool</span>
									</li>
									<li className="flex items-center gap-2">
										<Users className="h-5 w-5 text-primary" />
										<span>32 Team Bracket</span>
									</li>
									<li className="flex items-center gap-2">
										<MessageSquare className="h-5 w-5 text-primary" />
										<span>Live on Discord</span>
									</li>
								</ul>
								<Link href={`/tournaments/signup?id=${upcomingTournaments[0].id}`}>
									<Button size="lg" className="w-full md:w-auto bg-blue-800/20">
										Register Now
									</Button>
								</Link>
							</div>
						</div>
					) : (
						<div className="text-xl sm:text-3xl font-bold text-center mt-10">No upcoming tournaments</div>
					)}
				</div>
			</section>

			{/* Latest Scores */}
			<section className="w-full py-12 md:py-16 lg:py-20">
				<div className="container px-4 md:px-6 mx-auto">
					<div className="flex flex-col items-center justify-center space-y-4 text-center">
						<div className="space-y-2">
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Latest Tournament Results</h2>
							<p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
								Check out the results from our most recent tournaments.
							</p>
						</div>
						<Link href="/leaderboard">
							<Button variant="outline" className="mt-4">
								<Medal className="mr-2 h-4 w-4" />
								View All Scoreboard
							</Button>
						</Link>
					</div>
					<div className="mx-auto max-w-4xl py-12">
						<LatestScores latestTournamentLeaderboard={latestTournamentResult} />
					</div>
				</div>
			</section>

			{/* Sponsors */}
			<section className="w-full py-12 md:py-16 lg:py-20">
				<div className="container px-4 md:px-6 mx-auto">
					<div className="flex flex-col items-center justify-center space-y-4 text-center">
						<div className="space-y-2">
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Sponsors</h2>
							<p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
								Thanks to these amazing companies for supporting our community.
							</p>
						</div>
					</div>
					<div className="mx-auto grid max-w-5xl grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center gap-8 py-12">
						{sponsors.map(i => (
							<div key={i.id} className="flex items-center justify-center p-4">
								<Image src={i.logo} alt={`Sponsor ${i}`} width={300} height={300} className="h-40 w-auto aspect-square rounded-md" />
							</div>
						))}
					</div>
					<div className="flex justify-center">
						<Link href="/sponsors">
							<Button variant="outline">Learn More About Our Sponsors</Button>
						</Link>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="w-full py-12 md:py-16 lg:py-20 bg-orange-950 text-white">
				<div className="container px-4 md:px-6 mx-auto">
					<div className="flex flex-col items-center justify-center space-y-4 text-center">
						<div className="space-y-2">
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Join Our Community</h2>
							<p className="max-w-[900px] text-gray-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
								Connect with fellow gamers, participate in tournaments, and stay updated on the latest events.
							</p>
						</div>
						<SocialLinks size="lg" className="mt-6" />
					</div>
				</div>
			</section>
		</div>
	)
}
