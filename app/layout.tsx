import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import './globals.css'
import Header from '@/components/header'
import Footer from '@/components/footer'

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
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<NextThemesProvider attribute={'class'} themes={['light', 'dark']} enableSystem defaultTheme="dark">
					<Header />
					<main>{children}</main>
					<Footer />
				</NextThemesProvider>
			</body>
		</html>
	)
}
