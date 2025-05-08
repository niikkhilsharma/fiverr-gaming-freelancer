'use client'
import type React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { MessageSquare } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import axios from 'axios'

export default function TournamentSignupPage() {
	const params = useSearchParams()
	const tournamentId = params.get('id')

	const [formData, setFormData] = useState({
		teamName: '',
		discord: '',
		agreeToRules: false,
	})

	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isSubmitted, setIsSubmitted] = useState(false)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleCheckboxChange = (checked: boolean) => {
		setFormData(prev => ({ ...prev, agreeToRules: checked }))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)

		const response = await axios.post('/api/tournament/create', { tournamentId: tournamentId!, teamName: formData.teamName })

		if (response.data.success) {
			toast('Registration successful', {
				description: 'You have successfully registered for the tournament.',
			})

			setTimeout(() => {
				setIsSubmitted(true)
			}, 1500)
		} else if (response.data.error) {
			toast('Registration failed', {
				description: 'Something went wrong. Please try again.',
			})
		}

		setIsSubmitting(false)
	}

	if (isSubmitted) {
		return (
			<div className="container py-12 mx-auto md:py-16 lg:py-20 flex items-center justify-center">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle className="text-center text-green-600">Registration Complete!</CardTitle>
						<CardDescription className="text-center">Thank you for registering for the tournament.</CardDescription>
					</CardHeader>
					<CardContent className="text-center">
						<p className="mb-4">
							Your team has been successfully registered. You will receive a confirmation email with further details. You can share
							the team code with your friends to join the tournament.
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
		<div className="container px-4 py-12 mx-auto md:py-16 lg:py-20">
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
								<Label htmlFor="discord">Discord Username</Label>
								<Input
									id="discord"
									name="discord"
									placeholder="Enter your Discord username"
									value={formData.discord}
									onChange={handleChange}
								/>
							</div>

							<div className="flex items-center space-x-2 mb-2">
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
