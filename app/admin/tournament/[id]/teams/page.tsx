import MaxWidthWrapper from '@/components/max-width-wrapper'
import { Separator } from '@/components/ui/separator'
import prisma from '@/lib/prisma/prisma'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default async function AllTeams({ params }: { params: Promise<{ id: string }> }) {
	const param = await params
	const tournamentId = param.id

	const allTeams = await prisma.team.findMany({
		where: { tournamentId },
	})

	return (
		<MaxWidthWrapper className="flex-1 py-8">
			<h1 className="text-3xl font-bold text-center mb-8">All Teams</h1>
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{allTeams.map(team => (
					<TeamCard key={team.id} teamName={team.teamName} playersId={team.TeamPlayer} />
				))}
			</div>
		</MaxWidthWrapper>
	)
}

async function TeamCard({ teamName, playersId }: { teamName: string; playersId: string[] }) {
	const players = await prisma.user.findMany({
		where: {
			id: {
				in: playersId,
			},
		},
		select: {
			id: true,
			firstName: true,
			lastName: true,
			email: true,
			avatarUrl: true,
		},
	})

	return (
		<div className="rounded-2xl shadow-md p-6 border hover:shadow-lg transition-shadow duration-200 bg-foreground text-background">
			<h2 className="font-semibold mb-4">Team Name: {teamName}</h2>
			<div className="space-y-2">
				{players.map((player, index) => (
					<div key={player.email}>
						<div className="flex items-center gap-4">
							<Avatar>
								<AvatarImage src={player.avatarUrl || ''} />
								<AvatarFallback>
									{player.firstName[0].toUpperCase()}
									{player.lastName[0].toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-col">
								<span className="font-medium line-clamp-1">
									Name: {player.firstName} {player.lastName}
								</span>
								<span className="text-sm text-muted-foreground">Email: {player.email}</span>
							</div>
						</div>
						{index !== players.length - 1 && <Separator />}
					</div>
				))}
			</div>
		</div>
	)
}
