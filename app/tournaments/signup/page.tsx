'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { MessageSquare, PlusCircle, Trash2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function TournamentSignupPage() {
	const [formData, setFormData] = useState({
		teamName: '',
		captainName: '',
		captainEmail: '',
		discord: '',
		game: '',
		agreeToRules: false,
	})

	const [players, setPlayers] = useState([
		{
			name: '',
			email: '',
			isCaptain: true,
		},
	])

	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [error, setError] = useState('')

	// Update captain player when form captain data changes
	useEffect(() => {
		if (formData.captainName || formData.captainEmail) {
			const updatedPlayers = [...players]
			const captainIndex = updatedPlayers.findIndex(player => player.isCaptain)

			if (captainIndex >= 0) {
				updatedPlayers[captainIndex] = {
					...updatedPlayers[captainIndex],
					name: formData.captainName,
					email: formData.captainEmail,
				}
				setPlayers(updatedPlayers)
			}
		}
	}, [formData.captainName, formData.captainEmail])

	// Update captain form data when captain player changes
	const updateCaptainFormData = playerData => {
		setFormData(prev => ({
			...prev,
			captainName: playerData.name,
			captainEmail: playerData.email,
		}))
	}

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

	const handlePlayerChange = (index: number, field: string, value: string) => {
		const updatedPlayers = [...players]
		updatedPlayers[index] = { ...updatedPlayers[index], [field]: value }

		// If this is the captain player, update the form data too
		if (updatedPlayers[index].isCaptain) {
			updateCaptainFormData(updatedPlayers[index])
		}

		setPlayers(updatedPlayers)
	}

	const handleCaptainToggle = (index: number) => {
		// Only allow one captain
		if (players[index].isCaptain) {
			setError('At least one player must be designated as captain')
			return
		}

		const updatedPlayers = players.map((player, i) => ({
			...player,
			isCaptain: i === index,
		}))

		// Update captain form fields
		updateCaptainFormData(updatedPlayers[index])
		setPlayers(updatedPlayers)
		setError('')
	}

	const addPlayer = () => {
		setPlayers([...players, { name: '', email: '', isCaptain: false }])
	}

	const removePlayer = (index: number) => {
		// Don't allow removing the captain
		if (players[index].isCaptain) {
			setError('You cannot remove the team captain')
			return
		}

		// Don't allow removing the last player
		if (players.length <= 1) {
			setError('Team must have at least one player')
			return
		}

		const updatedPlayers = players.filter((_, i) => i !== index)
		setPlayers(updatedPlayers)
		setError('')
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)

		// Check if players have valid data
		const validPlayers = players.every(player => player.name && player.email)
		if (!validPlayers) {
			setError('All players must have name and email')
			setIsSubmitting(false)
			return
		}

		// Simulate form submission
		console.log({
			...formData,
			players,
		})

		setTimeout(() => {
			setIsSubmitting(false)
			setIsSubmitted(true)
		}, 1500)
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
		<div className="container py-12 mx-auto md:py-16 lg:py-20">
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

							<div className="space-y-2">
								<Label htmlFor="captainEmail">Team Captain Email</Label>
								<Input
									id="captainEmail"
									name="captainEmail"
									type="email"
									placeholder="Enter team captain's email"
									value={formData.captainEmail}
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

							<div>
								<div className="flex justify-between items-center mb-4">
									<h3 className="text-lg font-medium">Team Players</h3>
									<Button type="button" variant="outline" size="sm" onClick={addPlayer} className="flex items-center">
										<PlusCircle className="h-4 w-4 mr-1" /> Add Player
									</Button>
								</div>

								{error && (
									<Alert variant="destructive" className="mb-4">
										<AlertDescription>{error}</AlertDescription>
									</Alert>
								)}

								{players.map((player, index) => (
									<div key={index} className="mb-6 p-4 border border-gray-700 rounded-md">
										<div className="flex justify-between items-center mb-3">
											<div className="flex items-center">
												<h4 className="font-medium">Player {index + 1}</h4>
												{player.isCaptain && (
													<span className="ml-2 text-xs bg-purple-700 text-white px-2 py-1 rounded-full">Captain</span>
												)}
											</div>
											<div className="flex items-center gap-2">
												{!player.isCaptain && (
													<Button type="button" variant="outline" size="sm" onClick={() => handleCaptainToggle(index)}>
														Make Captain
													</Button>
												)}
												<Button
													type="button"
													variant="outline"
													size="sm"
													onClick={() => removePlayer(index)}
													className="text-red-500 hover:text-red-400">
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</div>

										<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
											<div className="space-y-2">
												<Label htmlFor={`player-${index}-name`}>Name</Label>
												<Input
													id={`player-${index}-name`}
													placeholder="Player name"
													value={player.name}
													onChange={e => handlePlayerChange(index, 'name', e.target.value)}
													required
													disabled={player.isCaptain} // Disabled if captain (controlled by captain field)
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor={`player-${index}-email`}>Email</Label>
												<Input
													id={`player-${index}-email`}
													type="email"
													placeholder="Player email"
													value={player.email}
													onChange={e => handlePlayerChange(index, 'email', e.target.value)}
													required
													disabled={player.isCaptain} // Disabled if captain (controlled by captain field)
												/>
											</div>
										</div>
									</div>
								))}
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
