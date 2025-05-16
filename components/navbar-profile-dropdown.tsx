'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { buttonVariants } from './ui/button'
import { UserRound } from 'lucide-react'

export default function NavbarProfileDropdown({
	isAuthenticated,
	avatar,
}: {
	isAuthenticated: boolean
	avatar: string | undefined
}) {
	return (
		<div>
			<DropdownMenu>
				<DropdownMenuTrigger className="w-9 aspect-square hover:cursor-pointer rounded-full">
					<Link
						href={'/profile/edit'}
						className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'rounded-full p-0 aspect-square w-full h-full')}>
						{!isAuthenticated ? (
							<UserRound />
						) : (
							<Avatar className="h-9 w-9 aspect-square">
								<AvatarImage src={avatar} />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
						)}
					</Link>
				</DropdownMenuTrigger>
				{isAuthenticated ? (
					<DropdownMenuContent side="bottom" align="center">
						<DropdownMenuItem>
							<Link className="w-full h-full" href={'/profile'}>
								Profile
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Link className="w-full h-full" href={'/profile/edit'}>
								Edit Profile
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
					</DropdownMenuContent>
				) : (
					<DropdownMenuContent>
						<DropdownMenuItem>
							<Link className="w-full h-full" href={'/login'}>
								Login
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Link className="w-full h-full" href={'/signup'}>
								Signup
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				)}
			</DropdownMenu>
		</div>
	)
}
