import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import './globals.css'
import Footer from '@/components/footer'
import { auth } from '@/auth'
import Navbar from '@/components/navbar'
import { Toaster } from 'sonner'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'HeistGames - Gaming Community',
	description:
		'Join our thriving gaming community. Compete in tournaments, connect with fellow gamers, and level up your gaming experience.',
}
export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const session = await auth()
	const user = session?.user

	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
				{user?.image ? <Navbar avatar={user.image} isAdmin={user.role === 'ADMIN'} /> : <Navbar isAdmin={false} />}
				<main className="flex-1 w-full! flex flex-col justify-center">
					<NextThemesProvider attribute={'class'} themes={['light', 'dark']} enableSystem defaultTheme="dark">
						{children}
						<Toaster />
					</NextThemesProvider>
				</main>
				<Footer />
			</body>
		</html>
	)
}
