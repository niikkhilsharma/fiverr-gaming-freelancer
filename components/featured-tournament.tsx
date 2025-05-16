import Image from 'next/image'
import { CalendarDays, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Tournament } from '@prisma/client'

export default function FeaturedTournament({ tournament }: { tournament: Tournament }) {
	return (
		<Card className="overflow-hidden py-0 border-2 border-primary">
			<div className="relative">
				<Image src={tournament.image} alt="Tournament Banner" width={600} height={300} className="w-full object-cover h-48" />
				<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/60"></div>
				<div className="absolute bottom-0 left-0 p-4">
					<span className="px-2 py-1 text-xs font-medium bg-primary text-white rounded-md">{tournament.name}</span>
				</div>
			</div>
			<CardContent className="p-6">
				<h3 className="text-xl font-bold mb-2">{tournament.name}</h3>
				<div className="flex items-center text-sm text-gray-400 mb-4">
					<CalendarDays className="mr-2 h-4 w-4" />
					<span>{tournament.endDateTime.toLocaleDateString()}</span>
					<Clock className="ml-4 mr-2 h-4 w-4" />
					<span>{tournament.endDateTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} EST</span>
				</div>
				<p className="text-sm text-gray-400 mb-4">{tournament.description}</p>
				<div className="flex items-center justify-between">
					{/* <div className="text-sm font-medium">
						<span className="text-purple-600">32</span> / 32 Teams
					</div> */}
					<div className="text-sm font-medium">Registration closing soon</div>
				</div>
			</CardContent>
		</Card>
	)
}
