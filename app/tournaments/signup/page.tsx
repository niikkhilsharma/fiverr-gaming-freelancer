'use client'

import type React from 'react'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { MessageSquare } from 'lucide-react'

export default function TournamentSignupPage() {
	const searchParams = useSearchParams()
	const tournamentId = searchParams.get('id') || '1'

	const [formData, setFormData] = useState({
		teamName: '',
		captainName: '',
		email: '',
		discord: '',
		players: '',
		game: '',
		agreeToRules: false,
	})

	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isSubmitted, setIsSubmitted] = useState(false)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleSelectChange = (name: string, value: string) => {
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleCheckboxChange = (checked: boolean) => {
		setFormData(prev => ({ ...prev, agreeToRules: checked }))
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)

		// Simulate form submission
		setTimeout(() => {
			setIsSubmitting(false)
			setIsSubmitted(true)
		}, 1500)
	}

	if (isSubmitted) {
		return (
			<div className="container py-12 md:py-16 lg:py-20 flex items-center justify-center">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle className="text-center text-green-600">Registration Complete!</CardTitle>
						<CardDescription className="text-center">Thank you for registering for the tournament.</CardDescription>
					</CardHeader>
					<CardContent className="text-center">
						<p className="mb-4">
							Your team has been successfully registered. You will receive a confirmation email with further details.
						</p>
						<div className="flex items-center justify-center gap-2 p-4 bg-gray-800 rounded-lg mb-4">
							<MessageSquare className="h-5 w-5 text-purple-600" />
							<p className="text-sm">Make sure to join our Discord server for tournament communications.</p>
						</div>
					</CardContent>
					<CardFooter className="flex justify-center gap-4">
						<Link href="/tournaments">
							<Button variant="outline">Back to Tournaments</Button>
						</Link>
						<Link href="https://discord.gg/HeistGames" target="_blank" rel="noopener noreferrer">
							<Button className="bg-[#5865F2] hover:bg-[#4752C4]">
								<MessageSquare className="mr-2 h-4 w-4" />
								Join Discord
							</Button>
						</Link>
					</CardFooter>
				</Card>
			</div>
		)
	}

	return (
		<div className="container py-12 md:py-16 lg:py-20">
			<div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
				<div className="space-y-2">
					<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Tournament Registration</h1>
					<p className="max-w-[600px] text-gray-400">Fill out the form below to register your team for the tournament.</p>
				</div>
			</div>

			<div className="mx-auto max-w-2xl">
				<Card>
					<CardHeader>
						<CardTitle>Team Registration</CardTitle>
						<CardDescription>Please provide all required information to complete your registration.</CardDescription>
					</CardHeader>
					<form onSubmit={handleSubmit}>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="teamName">Team Name</Label>
								<Input
									id="teamName"
									name="teamName"
									placeholder="Enter your team name"
									value={formData.teamName}
									onChange={handleChange}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="captainName">Team Captain Name</Label>
								<Input
									id="captainName"
									name="captainName"
									placeholder="Enter team captain's name"
									value={formData.captainName}
									onChange={handleChange}
									required
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="email">Email Address</Label>
									<Input
										id="email"
										name="email"
										type="email"
										placeholder="Enter your email"
										value={formData.email}
										onChange={handleChange}
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="discord">Discord Username</Label>
									<Input
										id="discord"
										name="discord"
										placeholder="username#0000"
										value={formData.discord}
										onChange={handleChange}
										required
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="game">Game</Label>
								<Select value={formData.game} onValueChange={value => handleSelectChange('game', value)} required>
									<SelectTrigger>
										<SelectValue placeholder="Select game" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="fortnite">Fortnite</SelectItem>
										<SelectItem value="valorant">Valorant</SelectItem>
										<SelectItem value="rocket-league">Rocket League</SelectItem>
										<SelectItem value="league-of-legends">League of Legends</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="players">Team Players</Label>
								<Textarea
									id="players"
									name="players"
									placeholder="List all player names and their in-game IDs (one per line)"
									value={formData.players}
									onChange={handleChange}
									required
									className="min-h-[120px]"
								/>
							</div>

							<div className="flex items-center space-x-2 pt-2">
								<Checkbox id="agreeToRules" checked={formData.agreeToRules} onCheckedChange={handleCheckboxChange} required />
								<Label htmlFor="agreeToRules" className="text-sm">
									I agree to the tournament rules and code of conduct
								</Label>
							</div>
						</CardContent>
						<CardFooter>
							<Button type="submit" className="w-full bg-purple-700 hover:bg-purple-800" disabled={isSubmitting}>
								{isSubmitting ? 'Submitting...' : 'Register Team'}
							</Button>
						</CardFooter>
					</form>
				</Card>
			</div>
		</div>
	)
}
