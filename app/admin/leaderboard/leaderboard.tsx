'use client'

import { useState, useEffect } from 'react'
import MaxWidthWrapper from '@/components/max-width-wrapper'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

// Import shadcn components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { Trash2, Edit, Trophy } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Team, Tournament } from '@prisma/client'

// Define the form schema with zod
const leaderboardFormSchema = z.object({
	teamId: z.string().min(1, { message: 'Team ID is required' }),
	tournamentId: z.string().min(1, { message: 'Tournament ID is required' }),
	teamName: z.string().min(1, { message: 'Team name is required' }),
	points: z.coerce.number().int().min(0, { message: 'Points must be a positive number' }),
})

// Define the type for our form values
type LeaderboardFormValues = z.infer<typeof leaderboardFormSchema>

// Define the type for our leaderboard data
type Leaderboard = {
	id: string
	teamId: string
	tournamentId: string
	teamName: string
	points: number
}

// Mock tournament data (in a real app, you would fetch this from an API)

export default function LeaderboardManagement({
	allTournaments,
	allTeams,
}: {
	allTournaments: Tournament[]
	allTeams: Team[]
}) {
	const [loading, setLoading] = useState(false)
	const [leaderboardEntries, setLeaderboardEntries] = useState<Leaderboard[]>([])
	const [editingEntry, setEditingEntry] = useState<Leaderboard | null>(null)

	// Initialize the form with shadcn/ui Form
	const form = useForm<LeaderboardFormValues>({
		resolver: zodResolver(leaderboardFormSchema),
		defaultValues: {
			teamId: '',
			tournamentId: '',
			teamName: '',
			points: 0,
		},
	})

	// Fetch existing leaderboard entries when component mounts
	useEffect(() => {
		const fetchLeaderboard = async () => {
			try {
				const response = await fetch('/api/admin/leaderboard')
				if (response.ok) {
					const data = await response.json()
					setLeaderboardEntries(data.leaderboard)
				}
			} catch (error) {
				console.error('Error fetching leaderboard:', error)
				toast.error('Failed to load leaderboard data')
			}
		}

		fetchLeaderboard()
	}, [])

	// Set form values when editing an entry
	useEffect(() => {
		if (editingEntry) {
			form.reset({
				teamId: editingEntry.teamId,
				tournamentId: editingEntry.tournamentId,
				teamName: editingEntry.teamName,
				points: editingEntry.points,
			})
		}
	}, [editingEntry, form])

	// Form submission handler
	const onSubmit = async (data: LeaderboardFormValues) => {
		try {
			setLoading(true)

			const endpoint = '/api/admin/leaderboard'
			const method = editingEntry ? 'PUT' : 'POST'
			const body = editingEntry ? JSON.stringify({ ...data, id: editingEntry.id }) : JSON.stringify(data)

			const response = await fetch(endpoint, {
				method,
				headers: {
					'Content-Type': 'application/json',
				},
				body,
			})

			if (response.ok) {
				const result = await response.json()

				if (editingEntry) {
					setLeaderboardEntries(prev => prev.map(entry => (entry.id === editingEntry.id ? result.leaderboard : entry)))
					setEditingEntry(null)
					toast.success('Leaderboard entry updated successfully!')
				} else {
					setLeaderboardEntries(prev => [...prev, result.leaderboard])
					toast.success('Leaderboard entry added successfully!')
				}

				form.reset({
					teamId: '',
					tournamentId: '',
					teamName: '',
					points: 0,
				})
			} else {
				const error = await response.json()
				toast.error(error.message || 'Failed to save leaderboard entry')
			}
		} catch (error) {
			console.error('Error saving leaderboard entry:', error)
			toast.error('An error occurred while saving the leaderboard entry')
		} finally {
			setLoading(false)
		}
	}

	// Delete leaderboard entry handler
	const handleDelete = async (id: string) => {
		try {
			const response = await fetch(`/api/admin/leaderboard?id=${id}`, {
				method: 'DELETE',
			})

			if (response.ok) {
				setLeaderboardEntries(prev => prev.filter(entry => entry.id !== id))
				toast.success('Leaderboard entry deleted successfully!')
			} else {
				toast.error('Failed to delete leaderboard entry')
			}
		} catch (error) {
			console.error('Error deleting leaderboard entry:', error)
			toast.error('An error occurred while deleting the leaderboard entry')
		}
	}

	// Handle edit button click
	const handleEdit = (entry: Leaderboard) => {
		setEditingEntry(entry)
	}

	// Cancel editing
	const cancelEdit = () => {
		setEditingEntry(null)
		form.reset({
			teamId: '',
			tournamentId: '',
			teamName: '',
			points: 0,
		})
	}

	// Get tournament name by ID
	const getTournamentName = (id: string) => {
		const tournament = allTournaments.find(t => t.id === id)
		return tournament ? tournament.name : id
	}

	return (
		<MaxWidthWrapper className="flex-1 py-8">
			<div className="space-y-8">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Leaderboard Management</h1>
					<p className="text-muted-foreground mt-2">Add and manage tournament leaderboard entries</p>
				</div>

				<Separator />

				{/* Add/Edit Leaderboard Entry Form */}
				<Card>
					<CardHeader>
						<CardTitle>{editingEntry ? 'Edit Leaderboard Entry' : 'Add New Leaderboard Entry'}</CardTitle>
						<CardDescription>
							{editingEntry
								? 'Update the leaderboard entry details below'
								: 'Fill in the team details below to add them to the leaderboard'}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
								<div className="grid gap-4 md:grid-cols-2">
									<FormField
										control={form.control}
										name="teamName"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Team Name</FormLabel>
												<Select
													onValueChange={(selectedTeamName: string) => {
														console.log(selectedTeamName)
														const selectedTeam = allTeams.find(t => t.teamName === selectedTeamName)
														console.log(selectedTeam)
														form.setValue('teamId', selectedTeam?.id || '')
														form.setValue('teamName', selectedTeam?.teamName || '')
													}}
													defaultValue={field.value}
													value={field.value}>
													<FormControl>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="Select a team name" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{allTeams.map(team => (
															<SelectItem key={team.id} value={team.teamName}>
																{team.teamName}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="teamId"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Team ID</FormLabel>
												<Select
													onValueChange={(selectedTeamId: string) => {
														const selectedTeam = allTeams.find(team => team.id === selectedTeamId)
														form.setValue('teamId', selectedTeam?.id || '')
														form.setValue('teamName', selectedTeam?.teamName || '')
													}}
													defaultValue={field.value}
													value={field.value}>
													<FormControl>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="Select a team id" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{allTeams.map(team => (
															<SelectItem key={team.id} value={team.id}>
																{team.id}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="tournamentId"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Tournament</FormLabel>
												<Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
													<FormControl>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="Select a tournament" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{allTournaments.map(tournament => (
															<SelectItem key={tournament.id} value={tournament.id}>
																{tournament.name}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="points"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Points</FormLabel>
												<FormControl>
													<Input type="number" min="0" placeholder="Enter points" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="flex space-x-2">
									<Button type="submit" disabled={loading}>
										{loading ? 'Saving...' : editingEntry ? 'Update Entry' : 'Add Entry'}
									</Button>
									{editingEntry && (
										<Button type="button" variant="outline" onClick={cancelEdit}>
											Cancel
										</Button>
									)}
								</div>
							</form>
						</Form>
					</CardContent>
				</Card>

				{/* Existing Leaderboard Entries List */}
				<Card>
					<CardHeader>
						<CardTitle>Current Leaderboard</CardTitle>
						<CardDescription>Manage your existing leaderboard entries</CardDescription>
					</CardHeader>
					<CardContent>
						{leaderboardEntries.length === 0 ? (
							<div className="text-center py-6">
								<Trophy className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
								<p className="text-muted-foreground mt-2">No leaderboard entries added yet.</p>
							</div>
						) : (
							<Table>
								<TableCaption>A list of all leaderboard entries</TableCaption>
								<TableHeader>
									<TableRow>
										<TableHead>Team</TableHead>
										<TableHead>Tournament</TableHead>
										<TableHead className="text-right">Points</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{leaderboardEntries
										.sort((a, b) => b.points - a.points) // Sort by points in descending order
										.map((entry, index) => (
											<TableRow key={entry.id}>
												<TableCell className="font-medium">
													<div className="flex items-center">
														<div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mr-2">{index + 1}</div>
														{entry.teamName}
													</div>
												</TableCell>
												<TableCell>{getTournamentName(entry.tournamentId)}</TableCell>
												<TableCell className="text-right font-bold">{entry.points}</TableCell>
												<TableCell className="text-right">
													<div className="flex justify-end space-x-2">
														<Button variant="outline" size="icon" onClick={() => handleEdit(entry)}>
															<Edit className="h-4 w-4" />
														</Button>
														<AlertDialog>
															<AlertDialogTrigger asChild>
																<Button variant="destructive" size="icon">
																	<Trash2 className="h-4 w-4" />
																</Button>
															</AlertDialogTrigger>
															<AlertDialogContent>
																<AlertDialogHeader>
																	<AlertDialogTitle>Delete Leaderboard Entry</AlertDialogTitle>
																	<AlertDialogDescription>
																		Are you sure you want to delete {entry.teamName} from the leaderboard? This action cannot be undone.
																	</AlertDialogDescription>
																</AlertDialogHeader>
																<AlertDialogFooter>
																	<AlertDialogCancel>Cancel</AlertDialogCancel>
																	<AlertDialogAction onClick={() => handleDelete(entry.id)}>Delete</AlertDialogAction>
																</AlertDialogFooter>
															</AlertDialogContent>
														</AlertDialog>
													</div>
												</TableCell>
											</TableRow>
										))}
								</TableBody>
							</Table>
						)}
					</CardContent>
				</Card>
			</div>
		</MaxWidthWrapper>
	)
}
