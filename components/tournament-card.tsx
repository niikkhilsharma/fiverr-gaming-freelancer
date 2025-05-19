'use client'

import { Team, Tournament } from '@prisma/client'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CalendarDays, Clock, Trophy, Check, Copy } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

export default function TournamentCard({
	tournament,
	alreadyRegistered,
	myTeam,
	isAdmin,
}: {
	tournament: Tournament
	alreadyRegistered?: boolean
	myTeam?: Team
	isAdmin?: boolean
}) {
	const [copied, setCopied] = useState(false)

	const handleCopyCode = async () => {
		try {
			await navigator.clipboard.writeText(myTeam?.id || '')
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (err) {
			console.error('Failed to copy:', err)
		}
	}

	return (
		<Card key={tournament.id} className={tournament.endDateTime < new Date() ? 'opacity-70' : ''}>
			<div className="relative">
				<Image
					src={'https://picsum.photos/200/300'}
					alt={tournament.name}
					width={400}
					height={200}
					className="w-full object-cover h-48 rounded-t-lg"
				/>
				<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/80 rounded-t-lg"></div>
				{tournament.endDateTime < new Date() && (
					<div className="absolute top-2 right-2 px-2 py-1 text-xs font-medium bg-red-600 text-white rounded-md">
						Registration Closed
					</div>
				)}
			</div>
			<CardHeader>
				<CardTitle>{tournament.name}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex items-center text-sm text-gray-400 mb-4">
					<CalendarDays className="mr-2 h-4 w-4" />
					<span>{tournament.endDateTime.toLocaleDateString()}</span>
					<Clock className="ml-4 mr-2 h-4 w-4" />
					<span>{new Date(tournament.endDateTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
				</div>
				<p className="text-sm text-gray-400 mb-4">{tournament.description}</p>
				<div className="grid grid-cols-2 gap-4 text-sm">
					<div className="flex items-center">
						<Trophy className="mr-2 h-4 w-4 text-purple-600" />
						<span>Prize: ${tournament.prizePool}</span>
					</div>
				</div>
			</CardContent>
			{!isAdmin ? (
				<CardFooter>
					{alreadyRegistered ? (
						<div className="flex flex-col gap-2 w-full">
							<Button disabled className="w-full">
								Already Registered
							</Button>
							<Button className="w-full" variant="outline" onClick={handleCopyCode}>
								{copied ? (
									<>
										<Check className="mr-2 h-4 w-4" />
										Code Copied!
									</>
								) : (
									<>
										<Copy className="mr-2 h-4 w-4" />
										Share Tournament Code
									</>
								)}
							</Button>
						</div>
					) : !(tournament.endDateTime < new Date()) ? (
						<Link href={`/tournaments/signup?id=${tournament.id}`} className="w-full">
							<Button className="w-full bg-purple-700 hover:bg-purple-800"> Register Now</Button>
						</Link>
					) : (
						<Button disabled className="w-full">
							Registration Closed
						</Button>
					)}
				</CardFooter>
			) : (
				<CardFooter>
					<Link href={`/admin/tournament/${tournament.id}/teams`} className="w-full">
						<Button className="w-full bg-purple-700 hover:bg-purple-800"> View Teams</Button>
					</Link>
				</CardFooter>
			)}
		</Card>
	)
}
