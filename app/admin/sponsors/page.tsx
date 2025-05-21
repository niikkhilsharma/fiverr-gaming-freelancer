'use client'

import { useState, useEffect } from 'react'
import MaxWidthWrapper from '@/components/max-width-wrapper'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import { ExternalLink, Trash2 } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import Image from 'next/image'

// Define the form schema with zod
const sponsorFormSchema = z.object({
	companyName: z.string().min(1, { message: 'Company name is required' }),
	description: z.string().min(1, { message: 'Description is required' }),
	website: z.string().url({ message: 'Please enter a valid URL' }),
	// Make logo optional in the schema since we can't control it properly with react-hook-form
	// We'll handle validation separately
})

// Define the type for our form values
type SponsorFormValues = z.infer<typeof sponsorFormSchema>

// Define the type for our sponsor data
type Sponsor = {
	id: string
	companyName: string
	description: string
	website: string
	logo?: string
}

export default function AddSponsorsPage() {
	const [loading, setLoading] = useState(false)
	const [sponsors, setSponsors] = useState<Sponsor[]>([])
	const [logo, setLogo] = useState<File | null>(null)
	const [logoError, setLogoError] = useState('')

	// Initialize the form with shadcn/ui Form
	const form = useForm<SponsorFormValues>({
		resolver: zodResolver(sponsorFormSchema),
		defaultValues: {
			companyName: '',
			description: '',
			website: '',
		},
	})

	// Fetch existing sponsors when component mounts
	useEffect(() => {
		const fetchSponsors = async () => {
			try {
				const response = await fetch('/api/admin/sponsors')
				if (response.ok) {
					const data = await response.json()
					// Ensure we're getting an array and each sponsor has the expected structure
					const validSponsors = Array.isArray(data.sponsors) ? data.sponsors : []
					console.log('Fetched sponsors:', validSponsors)
					setSponsors(validSponsors)
				}
			} catch (error) {
				console.error('Error fetching sponsors:', error)
				toast.error('Failed to load sponsors')
			}
		}

		fetchSponsors()
	}, [])

	// File input change handler
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLogoError('')
		if (e.target.files && e.target.files.length > 0) {
			setLogo(e.target.files[0])
		} else {
			setLogo(null)
		}
	}

	// Form submission handler
	const onSubmit = async (data: SponsorFormValues) => {
		// Check logo separately since it's not handled by react-hook-form
		if (!logo) {
			setLogoError('Logo is required')
			return
		}

		try {
			setLoading(true)

			// Create FormData for file upload
			const formData = new FormData()
			formData.append('companyName', data.companyName)
			formData.append('description', data.description)
			formData.append('website', data.website)
			formData.append('logo', logo)

			const response = await fetch('/api/admin/sponsors', {
				method: 'POST',
				body: formData,
			})

			if (response.ok) {
				const result = await response.json()
				// Safely add the new sponsor to the list
				const newSponsor = result.sponsor || {}

				// Ensure the new sponsor has all required properties
				if (!newSponsor.id) newSponsor.id = `sponsor-${Date.now()}`
				if (!newSponsor.companyName) newSponsor.companyName = data.companyName
				if (!newSponsor.description) newSponsor.description = data.description
				if (!newSponsor.website) newSponsor.website = data.website

				setSponsors(prev => [...prev, newSponsor])
				toast.success('Sponsor added successfully!')

				// Reset form
				form.reset()
				setLogo(null)

				// Reset file input by clearing its value
				const fileInput = document.getElementById('logo-input') as HTMLInputElement
				if (fileInput) fileInput.value = ''
			} else {
				const error = await response.json()
				toast.error(error.message || 'Failed to add sponsor')
			}
		} catch (error) {
			console.error('Error adding sponsor:', error)
			toast.error('An error occurred while adding the sponsor')
		} finally {
			setLoading(false)
		}
	}

	// Delete sponsor handler
	const handleDelete = async (id: string) => {
		try {
			const response = await fetch(`/api/admin/sponsors?id=${id}`, {
				method: 'DELETE',
				body: JSON.stringify({ id }),
			})

			if (response.ok) {
				setSponsors(prev => prev.filter(sponsor => sponsor.id !== id))
				toast.success('Sponsor deleted successfully!')
			} else {
				toast.error('Failed to delete sponsor')
			}
		} catch (error) {
			console.error('Error deleting sponsor:', error)
			toast.error('An error occurred while deleting the sponsor')
		}
	}

	return (
		<MaxWidthWrapper className="flex-1 py-8">
			<div className="space-y-8">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Sponsor Management</h1>
					<p className="text-muted-foreground mt-2">Add and manage sponsors for your website or game</p>
				</div>

				<Separator />

				{/* Add Sponsor Form */}
				<Card>
					<CardHeader>
						<CardTitle>Add New Sponsor</CardTitle>
						<CardDescription>Fill in the sponsor details below to add them to your platform</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
								<div className="grid gap-4">
									<FormField
										control={form.control}
										name="companyName"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Company Name</FormLabel>
												<FormControl>
													<Input placeholder="Enter company name" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="description"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Description</FormLabel>
												<FormControl>
													<Textarea placeholder="Describe the sponsor" rows={3} {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="website"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Website URL</FormLabel>
												<FormControl>
													<Input type="url" placeholder="https://example.com" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Handle file input separately since react-hook-form doesn't handle it well */}
									<div className="space-y-2">
										<FormLabel>Logo</FormLabel>
										<Input id="logo-input" type="file" accept="image/*" onChange={handleFileChange} />
										{logoError && <p className="text-sm font-medium text-red-500">{logoError}</p>}
									</div>
								</div>

								<Button type="submit" disabled={loading}>
									{loading ? 'Adding...' : 'Add Sponsor'}
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>

				{/* Existing Sponsors List */}
				<Card>
					<CardHeader>
						<CardTitle>Current Sponsors</CardTitle>
						<CardDescription>Manage your existing sponsors</CardDescription>
					</CardHeader>
					<CardContent>
						{sponsors.length === 0 ?
							<div className="text-center py-6">
								<p className="text-muted-foreground">No sponsors added yet.</p>
							</div>
						:	<Table>
								<TableCaption>A list of all sponsors for your platform</TableCaption>
								<TableHeader>
									<TableRow>
										<TableHead>Logo</TableHead>
										<TableHead>Company</TableHead>
										<TableHead>Description</TableHead>
										<TableHead>Website</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{sponsors.map((sponsor, indx) => {
										// Ensure sponsor has all required properties with fallbacks
										const safeCompanyName = sponsor?.companyName || 'Unknown Company'
										const safeDescription = sponsor?.description || 'No description available'
										const safeWebsite = sponsor?.website || '#'
										const safeLogo = sponsor?.logo || ''
										const safeId = sponsor?.id || `sponsor-${indx}`

										return (
											<TableRow key={indx}>
												<TableCell>
													<div className="h-12 w-12 rounded-md overflow-hidden bg-muted">
														{safeLogo ?
															<Image
																width={120}
																height={120}
																src={safeLogo}
																alt={`${safeCompanyName} logo`}
																className="h-full w-full object-contain"
															/>
														:	<div className="h-full w-full flex items-center justify-center text-xs text-gray-400">No Logo</div>}
													</div>
												</TableCell>
												<TableCell className="font-medium">{safeCompanyName}</TableCell>
												<TableCell className="max-w-xs truncate">{safeDescription}</TableCell>
												<TableCell>
													<a
														href={safeWebsite}
														target="_blank"
														rel="noopener noreferrer"
														className="flex items-center text-primary hover:underline">
														Visit <ExternalLink className="ml-1 h-3 w-3" />
													</a>
												</TableCell>
												<TableCell className="text-right">
													<AlertDialog>
														<AlertDialogTrigger asChild>
															<Button variant="destructive" size="icon">
																<Trash2 className="h-4 w-4" />
															</Button>
														</AlertDialogTrigger>
														<AlertDialogContent>
															<AlertDialogHeader>
																<AlertDialogTitle>Delete Sponsor</AlertDialogTitle>
																<AlertDialogDescription>
																	Are you sure you want to delete {safeCompanyName}? This action cannot be undone.
																</AlertDialogDescription>
															</AlertDialogHeader>
															<AlertDialogFooter>
																<AlertDialogCancel>Cancel</AlertDialogCancel>
																<AlertDialogAction onClick={() => handleDelete(safeId)}>Delete</AlertDialogAction>
															</AlertDialogFooter>
														</AlertDialogContent>
													</AlertDialog>
												</TableCell>
											</TableRow>
										)
									})}
								</TableBody>
							</Table>
						}
					</CardContent>
				</Card>
			</div>
		</MaxWidthWrapper>
	)
}
