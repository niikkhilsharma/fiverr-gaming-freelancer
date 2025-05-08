import Link from 'next/link'
import { Youtube, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SocialLinksProps {
	className?: string
	size?: 'default' | 'lg'
}

export default function SocialLinks({ className, size = 'default' }: SocialLinksProps) {
	const iconSize = size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'
	const buttonSize = size === 'lg' ? 'p-3' : 'p-2'

	return (
		<div className={cn('flex items-center gap-4', className)}>
			<Link
				href="https://discord.gg/HeistGames"
				target="_blank"
				rel="noopener noreferrer"
				className={cn(
					'flex items-center justify-center rounded-full bg-[#5865F2] text-white transition-transform hover:scale-110',
					buttonSize
				)}>
				<MessageSquare className={iconSize} />
				<span className="sr-only">Discord</span>
			</Link>
			<Link
				href="https://youtube.com/HeistGames"
				target="_blank"
				rel="noopener noreferrer"
				className={cn(
					'flex items-center justify-center rounded-full bg-[#FF0000] text-white transition-transform hover:scale-110',
					buttonSize
				)}>
				<Youtube className={iconSize} />
				<span className="sr-only">YouTube</span>
			</Link>
		</div>
	)
}
