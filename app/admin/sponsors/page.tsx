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

// Define the form schema with zod
const sponsorFormSchema = z.object({
	companyName: z.string().min(1, { message: 'Company name is required' }),
	description: z.string().min(1, { message: 'Description is required' }),
	website: z.string().url({ message: 'Please enter a valid URL' }),
	logo: z.any().refine(files => files instanceof FileList && files.length > 0, { message: 'Logo is required' }),
})

// Define the type for our form values
type SponsorFormValues = z.infer<typeof sponsorFormSchema>

// Define the type for our sponsor data
type Sponsor = {
	id: string
	companyName: string
	description: string
	website: string
	logo: string
}

export default function AddSponsorsPage() {
	const [loading, setLoading] = useState(false)
	const [sponsors, setSponsors] = useState<Sponsor[]>([])

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
					console.log(data)
					setSponsors(data.sponsors)
				}
			} catch (error) {
				console.error('Error fetching sponsors:', error)
				toast.error('Failed to load sponsors')
			}
		}

		fetchSponsors()
	}, [])

	// Form submission handler
	const onSubmit = async (data: SponsorFormValues) => {
		try {
			setLoading(true)

			// Create FormData for file upload
			const formData = new FormData()
			formData.append('companyName', data.companyName)
			formData.append('description', data.description)
			formData.append('website', data.website)
			if (data.logo && data.logo[0]) {
				formData.append('logo', data.logo[0])
			}

			const response = await fetch('/api/admin/sponsors', {
				method: 'POST',
				body: formData,
			})

			if (response.ok) {
				const newSponsor = await response.json()
				setSponsors(prev => [...prev, newSponsor.sponsor])
				toast.success('Sponsor added successfully!')
				form.reset()
			} else {
				const error = await response.json()
				toast.error(error.message || 'Failed to add sponsor')
			}
		} catch (error) {
			console.log('Error adding sponsor:', error)
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

									<FormField
										control={form.control}
										name="logo"
										render={({ field: { onChange, ...rest } }) => (
											<FormItem>
												<FormLabel>Logo</FormLabel>
												<FormControl>
													<Input type="file" accept="image/*" onChange={e => onChange(e.target.files)} {...rest} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
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
						{sponsors.length === 0 ? (
							<div className="text-center py-6">
								<p className="text-muted-foreground">No sponsors added yet.</p>
							</div>
						) : (
							<Table>
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
									{sponsors.map((sponsor, indx) => (
										<TableRow key={indx}>
											<TableCell>
												<div className="h-12 w-12 rounded-md overflow-hidden bg-muted">
													{sponsor.logo && (
														<img
															src={sponsor.logo || '/placeholder.svg'}
															alt={`${sponsor.companyName} logo`}
															className="h-full w-full object-contain"
														/>
													)}
												</div>
											</TableCell>
											<TableCell className="font-medium">{sponsor.companyName}</TableCell>
											<TableCell className="max-w-xs truncate">{sponsor.description}</TableCell>
											<TableCell>
												<a
													href={sponsor.website}
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
																Are you sure you want to delete {sponsor.companyName}? This action cannot be undone.
															</AlertDialogDescription>
														</AlertDialogHeader>
														<AlertDialogFooter>
															<AlertDialogCancel>Cancel</AlertDialogCancel>
															<AlertDialogAction onClick={() => handleDelete(sponsor.id)}>Delete</AlertDialogAction>
														</AlertDialogFooter>
													</AlertDialogContent>
												</AlertDialog>
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
