import Link from 'next/link'
import SocialLinks from '@/components/social-links'

export default function Footer() {
	return (
		<footer className="w-full border-t mt-auto border-gray-800 bg-background py-6 md:py-10">
			<div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
				<div className="flex flex-col items-center gap-4 md:items-start">
					<Link href="/" className="flex items-center space-x-2">
						<span className="font-bold text-xl">HeistGames</span>
					</Link>
					<p className="text-center text-sm text-muted-foreground md:text-left">
						&copy; {new Date().getFullYear()} HeistGames. All rights reserved.
					</p>
				</div>

				<div className="flex flex-col items-center gap-4 md:items-end">
					<nav className="flex gap-4 sm:gap-6">
						<Link href="/terms" className="text-sm font-medium text-muted-foreground hover:text-foreground">
							Terms
						</Link>
						<Link href="/privacy" className="text-sm font-medium text-muted-foreground hover:text-foreground">
							Privacy
						</Link>
						<Link href="/sponsors?tab=contact" className="text-sm font-medium text-muted-foreground hover:text-foreground">
							Contact
						</Link>
					</nav>
					<SocialLinks />
				</div>
			</div>
		</footer>
	)
}
