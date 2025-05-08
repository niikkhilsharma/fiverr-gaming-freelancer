import type { Metadata } from 'next'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
	title: 'HeistGames - Gaming Community',
	description:
		'Join our thriving gaming community. Compete in tournaments, connect with fellow gamers, and level up your gaming experience.',
}

export default async function AdminLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const session = await auth()
	const user = session?.user
	console.log(user)
	if (user?.role !== 'ADMIN') {
		redirect('/')
	}

	return <>{children}</>
}
