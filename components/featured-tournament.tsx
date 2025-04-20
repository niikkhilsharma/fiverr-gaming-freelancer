import Image from 'next/image'
import { CalendarDays, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function FeaturedTournament() {
	return (
		<Card className="overflow-hidden border-2 border-purple-800">
			<div className="relative">
				<Image
					src="https://picsum.photos/200/300"
					alt="Tournament Banner"
					width={600}
					height={300}
					className="w-full object-cover h-48"
				/>
				<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/60"></div>
				<div className="absolute bottom-0 left-0 p-4">
					<span className="px-2 py-1 text-xs font-medium bg-purple-700 text-white rounded-md">Fortnite</span>
				</div>
			</div>
			<CardContent className="p-6">
				<h3 className="text-xl font-bold mb-2">Summer Championship 2023</h3>
				<div className="flex items-center text-sm text-gray-400 mb-4">
					<CalendarDays className="mr-2 h-4 w-4" />
					<span>August 15, 2023</span>
					<Clock className="ml-4 mr-2 h-4 w-4" />
					<span>6:00 PM EST</span>
				</div>
				<p className="text-sm text-gray-400 mb-4">
					Join our biggest tournament of the summer! Compete against the best players in the community for glory and prizes.
				</p>
				<div className="flex items-center justify-between">
					<div className="text-sm font-medium">
						<span className="text-purple-600">32</span> / 32 Teams
					</div>
					<div className="text-sm font-medium">Registration closing soon</div>
				</div>
			</CardContent>
		</Card>
	)
}
