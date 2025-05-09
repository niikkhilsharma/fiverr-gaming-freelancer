'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetTitle, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import SocialLinks from '@/components/social-links'
import Image from 'next/image'
import NavbarProfileDropdown from './navbar-profile-dropdown'

export default function Navbar({ avatar, isAdmin }: { avatar?: string; isAdmin: boolean }) {
	const [isOpen, setIsOpen] = useState(false)

	const userNavigation = [
		{ name: 'Home', href: '/' },
		{ name: 'Tournaments', href: '/tournaments' },
		{ name: 'leaderboard', href: '/leaderboard' },
		{ name: 'Sponsors', href: '/sponsors' },
		{ name: 'Rules', href: '/rules' },
	]

	const adminNavigation = [
		{ name: 'Create Tournament', href: '/admin/create-tournaments' },
		{ name: 'Add Leaderboard', href: '/admin/leaderboard' },
		{ name: 'Add Sponsors', href: '/admin/sponsors' },
	]

	const navigation = isAdmin ? adminNavigation : userNavigation

	return (
		<header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pr-3.5 sm:pr-0">
			<div className="container mx-auto flex h-16 items-center justify-between">
				<div className="flex items-center gap-2">
					<Link href="/" className="flex items-center space-x-2">
						<Image
							src={'/assets/images/logo/logo.png'}
							alt="HeistGames Logo"
							width={3000}
							height={3000}
							className="w-36 aspect-square"
						/>
					</Link>
				</div>

				<nav className="hidden md:flex gap-6">
					{navigation.map(item => (
						<Link key={item.name} href={item.href} className="text-sm font-medium transition-colors hover:text-primary">
							{item.name}
						</Link>
					))}
				</nav>

				<div className="hidden md:flex items-center gap-4">
					<SocialLinks />
					{<NavbarProfileDropdown isAuthenticated={!!avatar} avatar={avatar} />}
				</div>

				<Sheet open={isOpen} onOpenChange={setIsOpen}>
					<SheetTrigger asChild className="md:hidden">
						<Button variant="outline" size="icon" className="h-9 w-9">
							<Menu className="h-5 w-5" />
							<span className="sr-only">Toggle menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="right" className="pr-0">
						<div className="px-7">
							<SheetTitle>
								<Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
									<Image
										src={'/assets/images/logo/logo.png'}
										alt="HeistGames Logo"
										width={3000}
										height={3000}
										className="mt-2 w-20 aspect-square"
									/>
								</Link>
							</SheetTitle>

							<nav className="mt-4 flex flex-col gap-4">
								{navigation.map(item => (
									<Link
										key={item.name}
										href={item.href}
										className="text-base font-medium transition-colors hover:text-primary"
										onClick={() => setIsOpen(false)}>
										{item.name}
									</Link>
								))}
							</nav>

							<div className="mt-8">
								<SocialLinks />
							</div>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</header>
	)
}
